import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WVS7DataFetcher {
  private static instance: WVS7DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'World Values Survey Wave 7',
    'happiness': 'World Values Survey Wave 7',
    'trust_in_people': 'World Values Survey Wave 7',
    'trust_in_government': 'World Values Survey Wave 7',
    'trust_in_science': 'World Values Survey Wave 7',
    'trust_in_media': 'World Values Survey Wave 7',
    'social_connectedness': 'World Values Survey Wave 7',
    'digital_engagement': 'World Values Survey Wave 7',
    'environmental_concern': 'World Values Survey Wave 7',
    'climate_change_concern': 'World Values Survey Wave 7',
    'gender_equality': 'World Values Survey Wave 7',
    'work_life_balance': 'World Values Survey Wave 7',
    'political_engagement': 'World Values Survey Wave 7',
    'social_tolerance': 'World Values Survey Wave 7',
    'cultural_openness': 'World Values Survey Wave 7'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WVS7DataFetcher {
    if (!WVS7DataFetcher.instance) {
      WVS7DataFetcher.instance = new WVS7DataFetcher();
    }
    return WVS7DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WVS7', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'life_satisfaction': [1, 10],
      'happiness': [1, 4],
      'trust_in_people': [0, 10],
      'trust_in_government': [0, 10],
      'trust_in_science': [0, 10],
      'trust_in_media': [0, 10],
      'social_connectedness': [1, 5],
      'digital_engagement': [1, 5],
      'environmental_concern': [1, 5],
      'climate_change_concern': [1, 5],
      'gender_equality': [1, 5],
      'work_life_balance': [1, 5],
      'political_engagement': [1, 5],
      'social_tolerance': [1, 5],
      'cultural_openness': [1, 5]
    };

    const [min, max] = ranges[metric] || [1, 5];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_satisfaction': 'scale (1-10)',
      'happiness': 'scale (1-4)',
      'trust_in_people': 'scale (0-10)',
      'trust_in_government': 'scale (0-10)',
      'trust_in_science': 'scale (0-10)',
      'trust_in_media': 'scale (0-10)',
      'social_connectedness': 'scale (1-5)',
      'digital_engagement': 'scale (1-5)',
      'environmental_concern': 'scale (1-5)',
      'climate_change_concern': 'scale (1-5)',
      'gender_equality': 'scale (1-5)',
      'work_life_balance': 'scale (1-5)',
      'political_engagement': 'scale (1-5)',
      'social_tolerance': 'scale (1-5)',
      'cultural_openness': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2017, 2018, 2019, 2020, 2021, 2022];
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