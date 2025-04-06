import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WVS8DataFetcher {
  private static instance: WVS8DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'World Values Survey Wave 8',
    'happiness': 'World Values Survey Wave 8',
    'trust_in_people': 'World Values Survey Wave 8',
    'trust_in_government': 'World Values Survey Wave 8',
    'trust_in_science': 'World Values Survey Wave 8',
    'trust_in_media': 'World Values Survey Wave 8',
    'trust_in_healthcare': 'World Values Survey Wave 8',
    'trust_in_education': 'World Values Survey Wave 8',
    'social_connectedness': 'World Values Survey Wave 8',
    'digital_engagement': 'World Values Survey Wave 8',
    'environmental_concern': 'World Values Survey Wave 8',
    'climate_change_concern': 'World Values Survey Wave 8',
    'gender_equality': 'World Values Survey Wave 8',
    'work_life_balance': 'World Values Survey Wave 8',
    'political_engagement': 'World Values Survey Wave 8',
    'social_tolerance': 'World Values Survey Wave 8',
    'cultural_openness': 'World Values Survey Wave 8',
    'health_status': 'World Values Survey Wave 8',
    'subjective_wellbeing': 'World Values Survey Wave 8',
    'life_meaning': 'World Values Survey Wave 8',
    'economic_outlook': 'World Values Survey Wave 8',
    'social_mobility': 'World Values Survey Wave 8',
    'digital_trust': 'World Values Survey Wave 8'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WVS8DataFetcher {
    if (!WVS8DataFetcher.instance) {
      WVS8DataFetcher.instance = new WVS8DataFetcher();
    }
    return WVS8DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WVS8', year, 0),
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
      'trust_in_healthcare': [0, 10],
      'trust_in_education': [0, 10],
      'social_connectedness': [1, 5],
      'digital_engagement': [1, 5],
      'environmental_concern': [1, 5],
      'climate_change_concern': [1, 5],
      'gender_equality': [1, 5],
      'work_life_balance': [1, 5],
      'political_engagement': [1, 5],
      'social_tolerance': [1, 5],
      'cultural_openness': [1, 5],
      'health_status': [1, 5],
      'subjective_wellbeing': [0, 10],
      'life_meaning': [1, 5],
      'economic_outlook': [1, 5],
      'social_mobility': [1, 5],
      'digital_trust': [1, 5]
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
      'trust_in_healthcare': 'scale (0-10)',
      'trust_in_education': 'scale (0-10)',
      'social_connectedness': 'scale (1-5)',
      'digital_engagement': 'scale (1-5)',
      'environmental_concern': 'scale (1-5)',
      'climate_change_concern': 'scale (1-5)',
      'gender_equality': 'scale (1-5)',
      'work_life_balance': 'scale (1-5)',
      'political_engagement': 'scale (1-5)',
      'social_tolerance': 'scale (1-5)',
      'cultural_openness': 'scale (1-5)',
      'health_status': 'scale (1-5)',
      'subjective_wellbeing': 'scale (0-10)',
      'life_meaning': 'scale (1-5)',
      'economic_outlook': 'scale (1-5)',
      'social_mobility': 'scale (1-5)',
      'digital_trust': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2022, 2023, 2024];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Argentina', 'Australia', 'Brazil', 'Canada', 'Chile', 'China',
      'Colombia', 'Egypt', 'France', 'Germany', 'India', 'Indonesia',
      'Iran', 'Iraq', 'Italy', 'Japan', 'Jordan', 'Kazakhstan',
      'Malaysia', 'Mexico', 'Netherlands', 'New Zealand', 'Nigeria',
      'Pakistan', 'Peru', 'Philippines', 'Poland', 'Romania', 'Russia',
      'South Africa', 'South Korea', 'Spain', 'Sweden', 'Thailand',
      'Turkey', 'Ukraine', 'United Kingdom', 'United States', 'Vietnam',
      'Bangladesh', 'Ethiopia', 'Ghana', 'Kenya', 'Morocco', 'Myanmar',
      'Nepal', 'Senegal', 'Tanzania', 'Uganda', 'Zambia'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 