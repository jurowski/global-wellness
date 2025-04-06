import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class EQLSDataFetcher {
  private static instance: EQLSDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'quality_of_life': 'European Quality of Life Survey',
    'life_satisfaction': 'European Quality of Life Survey',
    'work_satisfaction': 'European Quality of Life Survey',
    'financial_situation': 'European Quality of Life Survey',
    'housing_quality': 'European Quality of Life Survey',
    'work_life_balance': 'European Quality of Life Survey',
    'social_exclusion': 'European Quality of Life Survey',
    'health_limitations': 'European Quality of Life Survey',
    'care_responsibilities': 'European Quality of Life Survey',
    'social_support': 'European Quality of Life Survey',
    'community_trust': 'European Quality of Life Survey',
    'environmental_quality': 'European Quality of Life Survey',
    'access_to_services': 'European Quality of Life Survey',
    'digital_inclusion': 'European Quality of Life Survey',
    'work_quality': 'European Quality of Life Survey'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): EQLSDataFetcher {
    if (!EQLSDataFetcher.instance) {
      EQLSDataFetcher.instance = new EQLSDataFetcher();
    }
    return EQLSDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('EQLS', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'quality_of_life': [1, 10],
      'life_satisfaction': [1, 10],
      'work_satisfaction': [1, 10],
      'financial_situation': [1, 10],
      'housing_quality': [1, 10],
      'work_life_balance': [1, 10],
      'social_exclusion': [1, 10],
      'health_limitations': [0, 100],
      'care_responsibilities': [0, 100],
      'social_support': [1, 10],
      'community_trust': [1, 10],
      'environmental_quality': [1, 10],
      'access_to_services': [1, 10],
      'digital_inclusion': [1, 10],
      'work_quality': [1, 10]
    };

    const [min, max] = ranges[metric] || [1, 10];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'quality_of_life': 'scale (1-10)',
      'life_satisfaction': 'scale (1-10)',
      'work_satisfaction': 'scale (1-10)',
      'financial_situation': 'scale (1-10)',
      'housing_quality': 'scale (1-10)',
      'work_life_balance': 'scale (1-10)',
      'social_exclusion': 'scale (1-10)',
      'health_limitations': 'percentage',
      'care_responsibilities': 'percentage',
      'social_support': 'scale (1-10)',
      'community_trust': 'scale (1-10)',
      'environmental_quality': 'scale (1-10)',
      'access_to_services': 'scale (1-10)',
      'digital_inclusion': 'scale (1-10)',
      'work_quality': 'scale (1-10)'
    };

    return units[metric] || 'scale (1-10)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2003, 2007, 2011, 2016, 2021];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
      'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
      'Slovenia', 'Spain', 'Sweden', 'United Kingdom'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 