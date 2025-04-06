import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class ESS14DataFetcher {
  private static instance: ESS14DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'European Social Survey Wave 14',
    'happiness': 'European Social Survey Wave 14',
    'trust_in_people': 'European Social Survey Wave 14',
    'trust_in_police': 'European Social Survey Wave 14',
    'trust_in_politics': 'European Social Survey Wave 14',
    'trust_in_healthcare': 'European Social Survey Wave 14',
    'trust_in_education': 'European Social Survey Wave 14',
    'trust_in_technology': 'European Social Survey Wave 14',
    'social_trust': 'European Social Survey Wave 14',
    'political_trust': 'European Social Survey Wave 14',
    'institutional_trust': 'European Social Survey Wave 14',
    'social_connectedness': 'European Social Survey Wave 14',
    'digital_engagement': 'European Social Survey Wave 14',
    'environmental_concern': 'European Social Survey Wave 14',
    'climate_change_concern': 'European Social Survey Wave 14',
    'gender_equality': 'European Social Survey Wave 14',
    'work_life_balance': 'European Social Survey Wave 14',
    'political_engagement': 'European Social Survey Wave 14',
    'social_tolerance': 'European Social Survey Wave 14',
    'cultural_openness': 'European Social Survey Wave 14',
    'health_status': 'European Social Survey Wave 14',
    'subjective_wellbeing': 'European Social Survey Wave 14',
    'life_meaning': 'European Social Survey Wave 14',
    'economic_outlook': 'European Social Survey Wave 14',
    'social_mobility': 'European Social Survey Wave 14',
    'digital_trust': 'European Social Survey Wave 14',
    'mental_health': 'European Social Survey Wave 14',
    'social_support': 'European Social Survey Wave 14',
    'ai_trust': 'European Social Survey Wave 14',
    'future_optimism': 'European Social Survey Wave 14',
    'digital_literacy': 'European Social Survey Wave 14',
    'cybersecurity_awareness': 'European Social Survey Wave 14',
    'digital_wellbeing': 'European Social Survey Wave 14',
    'social_cohesion': 'European Social Survey Wave 14',
    'intergenerational_equity': 'European Social Survey Wave 14',
    'sustainable_consumption': 'European Social Survey Wave 14',
    'digital_resilience': 'European Social Survey Wave 14',
    'digital_inclusion': 'European Social Survey Wave 14',
    'social_innovation': 'European Social Survey Wave 14',
    'environmental_action': 'European Social Survey Wave 14',
    'digital_ethics': 'European Social Survey Wave 14'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): ESS14DataFetcher {
    if (!ESS14DataFetcher.instance) {
      ESS14DataFetcher.instance = new ESS14DataFetcher();
    }
    return ESS14DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('ESS14', year, 0),
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
      'trust_in_healthcare': [0, 10],
      'trust_in_education': [0, 10],
      'trust_in_technology': [0, 10],
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
      'life_meaning': [1, 5],
      'economic_outlook': [1, 5],
      'social_mobility': [1, 5],
      'digital_trust': [1, 5],
      'mental_health': [1, 5],
      'social_support': [1, 5],
      'ai_trust': [1, 5],
      'future_optimism': [1, 5],
      'digital_literacy': [1, 5],
      'cybersecurity_awareness': [1, 5],
      'digital_wellbeing': [1, 5],
      'social_cohesion': [1, 5],
      'intergenerational_equity': [1, 5],
      'sustainable_consumption': [1, 5],
      'digital_resilience': [1, 5],
      'digital_inclusion': [1, 5],
      'social_innovation': [1, 5],
      'environmental_action': [1, 5],
      'digital_ethics': [1, 5]
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
      'trust_in_healthcare': 'scale (0-10)',
      'trust_in_education': 'scale (0-10)',
      'trust_in_technology': 'scale (0-10)',
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
      'life_meaning': 'scale (1-5)',
      'economic_outlook': 'scale (1-5)',
      'social_mobility': 'scale (1-5)',
      'digital_trust': 'scale (1-5)',
      'mental_health': 'scale (1-5)',
      'social_support': 'scale (1-5)',
      'ai_trust': 'scale (1-5)',
      'future_optimism': 'scale (1-5)',
      'digital_literacy': 'scale (1-5)',
      'cybersecurity_awareness': 'scale (1-5)',
      'digital_wellbeing': 'scale (1-5)',
      'social_cohesion': 'scale (1-5)',
      'intergenerational_equity': 'scale (1-5)',
      'sustainable_consumption': 'scale (1-5)',
      'digital_resilience': 'scale (1-5)',
      'digital_inclusion': 'scale (1-5)',
      'social_innovation': 'scale (1-5)',
      'environmental_action': 'scale (1-5)',
      'digital_ethics': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2030, 2031];
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