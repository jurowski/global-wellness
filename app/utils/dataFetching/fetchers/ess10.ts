import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class ESS10DataFetcher {
  private static instance: ESS10DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'European Social Survey Wave 10',
    'happiness': 'European Social Survey Wave 10',
    'trust_in_people': 'European Social Survey Wave 10',
    'trust_in_police': 'European Social Survey Wave 10',
    'trust_in_politics': 'European Social Survey Wave 10',
    'social_trust': 'European Social Survey Wave 10',
    'political_trust': 'European Social Survey Wave 10',
    'institutional_trust': 'European Social Survey Wave 10',
    'social_connectedness': 'European Social Survey Wave 10',
    'digital_engagement': 'European Social Survey Wave 10',
    'environmental_concern': 'European Social Survey Wave 10',
    'climate_change_concern': 'European Social Survey Wave 10',
    'gender_equality': 'European Social Survey Wave 10',
    'work_life_balance': 'European Social Survey Wave 10',
    'political_engagement': 'European Social Survey Wave 10',
    'social_tolerance': 'European Social Survey Wave 10',
    'cultural_openness': 'European Social Survey Wave 10',
    'health_status': 'European Social Survey Wave 10',
    'subjective_wellbeing': 'European Social Survey Wave 10',
    'life_meaning': 'European Social Survey Wave 10'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): ESS10DataFetcher {
    if (!ESS10DataFetcher.instance) {
      ESS10DataFetcher.instance = new ESS10DataFetcher();
    }
    return ESS10DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('ESS10', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'life_satisfaction': [0, 10],
      'happiness': [0, 10],
      'trust_in_people': [0, 10],
      'trust_in_police': [0, 10],
      'trust_in_politics': [0, 10],
      'social_trust': [0, 10],
      'political_trust': [0, 10],
      'institutional_trust': [0, 10],
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
      'life_meaning': [1, 5]
    };

    const [min, max] = ranges[metric] || [1, 5];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_satisfaction': 'scale (0-10)',
      'happiness': 'scale (0-10)',
      'trust_in_people': 'scale (0-10)',
      'trust_in_police': 'scale (0-10)',
      'trust_in_politics': 'scale (0-10)',
      'social_trust': 'scale (0-10)',
      'political_trust': 'scale (0-10)',
      'institutional_trust': 'scale (0-10)',
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
      'life_meaning': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Latvia',
      'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Norway', 'Poland',
      'Portugal', 'Romania', 'Slovakia', 'Slovenia', 'Spain', 'Sweden',
      'Switzerland', 'United Kingdom'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 