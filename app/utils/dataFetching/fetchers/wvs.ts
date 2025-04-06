import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WVSDataFetcher {
  private static instance: WVSDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'trust_in_people': 'World Values Survey',
    'happiness': 'World Values Survey',
    'life_satisfaction': 'World Values Survey',
    'importance_of_family': 'World Values Survey',
    'importance_of_friends': 'World Values Survey',
    'importance_of_leisure': 'World Values Survey',
    'importance_of_work': 'World Values Survey',
    'importance_of_religion': 'World Values Survey',
    'importance_of_politics': 'World Values Survey',
    'gender_equality': 'World Values Survey',
    'environmental_concern': 'World Values Survey',
    'tolerance_of_diversity': 'World Values Survey',
    'confidence_in_government': 'World Values Survey',
    'confidence_in_science': 'World Values Survey',
    'social_trust': 'World Values Survey'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WVSDataFetcher {
    if (!WVSDataFetcher.instance) {
      WVSDataFetcher.instance = new WVSDataFetcher();
    }
    return WVSDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WVS', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'trust_in_people': [0, 100],
      'happiness': [1, 4],
      'life_satisfaction': [1, 10],
      'importance_of_family': [1, 4],
      'importance_of_friends': [1, 4],
      'importance_of_leisure': [1, 4],
      'importance_of_work': [1, 4],
      'importance_of_religion': [1, 4],
      'importance_of_politics': [1, 4],
      'gender_equality': [1, 4],
      'environmental_concern': [1, 4],
      'tolerance_of_diversity': [1, 4],
      'confidence_in_government': [1, 4],
      'confidence_in_science': [1, 4],
      'social_trust': [0, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'trust_in_people': 'percentage',
      'happiness': 'scale (1-4)',
      'life_satisfaction': 'scale (1-10)',
      'importance_of_family': 'scale (1-4)',
      'importance_of_friends': 'scale (1-4)',
      'importance_of_leisure': 'scale (1-4)',
      'importance_of_work': 'scale (1-4)',
      'importance_of_religion': 'scale (1-4)',
      'importance_of_politics': 'scale (1-4)',
      'gender_equality': 'scale (1-4)',
      'environmental_concern': 'scale (1-4)',
      'tolerance_of_diversity': 'scale (1-4)',
      'confidence_in_government': 'scale (1-4)',
      'confidence_in_science': 'scale (1-4)',
      'social_trust': 'percentage'
    };

    return units[metric] || 'scale (1-4)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [1981, 1990, 1995, 2000, 2005, 2010, 2017, 2022];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'China',
      'Colombia', 'Egypt', 'France', 'Germany', 'India', 'Indonesia',
      'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
      'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria',
      'Pakistan', 'Peru', 'Philippines', 'Poland', 'Romania', 'Russia',
      'South Africa', 'South Korea', 'Spain', 'Sweden', 'Thailand',
      'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 