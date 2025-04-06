import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class ESSDataFetcher {
  private static instance: ESSDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'social_trust': 'European Social Survey',
    'political_trust': 'European Social Survey',
    'life_satisfaction': 'European Social Survey',
    'happiness': 'European Social Survey',
    'health_status': 'European Social Survey',
    'social_contact': 'European Social Survey',
    'volunteering': 'European Social Survey',
    'political_interest': 'European Social Survey',
    'immigration_attitudes': 'European Social Survey',
    'gender_equality': 'European Social Survey',
    'work_life_balance': 'European Social Survey',
    'environmental_concern': 'European Social Survey',
    'digital_engagement': 'European Social Survey',
    'social_exclusion': 'European Social Survey',
    'welfare_support': 'European Social Survey'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): ESSDataFetcher {
    if (!ESSDataFetcher.instance) {
      ESSDataFetcher.instance = new ESSDataFetcher();
    }
    return ESSDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('ESS', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'social_trust': [0, 10],
      'political_trust': [0, 10],
      'life_satisfaction': [0, 10],
      'happiness': [0, 10],
      'health_status': [1, 5],
      'social_contact': [1, 7],
      'volunteering': [0, 100],
      'political_interest': [1, 4],
      'immigration_attitudes': [0, 10],
      'gender_equality': [1, 5],
      'work_life_balance': [1, 5],
      'environmental_concern': [1, 5],
      'digital_engagement': [1, 5],
      'social_exclusion': [1, 5],
      'welfare_support': [1, 5]
    };

    const [min, max] = ranges[metric] || [0, 10];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'social_trust': 'scale (0-10)',
      'political_trust': 'scale (0-10)',
      'life_satisfaction': 'scale (0-10)',
      'happiness': 'scale (0-10)',
      'health_status': 'scale (1-5)',
      'social_contact': 'scale (1-7)',
      'volunteering': 'percentage',
      'political_interest': 'scale (1-4)',
      'immigration_attitudes': 'scale (0-10)',
      'gender_equality': 'scale (1-5)',
      'work_life_balance': 'scale (1-5)',
      'environmental_concern': 'scale (1-5)',
      'digital_engagement': 'scale (1-5)',
      'social_exclusion': 'scale (1-5)',
      'welfare_support': 'scale (1-5)'
    };

    return units[metric] || 'scale (0-10)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2002, 2004, 2006, 2008, 2010, 2012, 2014, 2016, 2018, 2020, 2022];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Lithuania',
      'Luxembourg', 'Netherlands', 'Norway', 'Poland', 'Portugal',
      'Romania', 'Russia', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
      'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 