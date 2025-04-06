import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WVS11DataFetcher {
  private static instance: WVS11DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'World Values Survey Wave 11',
    'happiness': 'World Values Survey Wave 11',
    'trust_in_people': 'World Values Survey Wave 11',
    'trust_in_police': 'World Values Survey Wave 11',
    'trust_in_politics': 'World Values Survey Wave 11',
    'trust_in_healthcare': 'World Values Survey Wave 11',
    'trust_in_education': 'World Values Survey Wave 11',
    'trust_in_technology': 'World Values Survey Wave 11',
    'social_trust': 'World Values Survey Wave 11',
    'political_trust': 'World Values Survey Wave 11',
    'institutional_trust': 'World Values Survey Wave 11',
    'social_connectedness': 'World Values Survey Wave 11',
    'digital_engagement': 'World Values Survey Wave 11',
    'environmental_concern': 'World Values Survey Wave 11',
    'climate_change_concern': 'World Values Survey Wave 11',
    'gender_equality': 'World Values Survey Wave 11',
    'work_life_balance': 'World Values Survey Wave 11',
    'political_engagement': 'World Values Survey Wave 11',
    'social_tolerance': 'World Values Survey Wave 11',
    'cultural_openness': 'World Values Survey Wave 11',
    'health_status': 'World Values Survey Wave 11',
    'subjective_wellbeing': 'World Values Survey Wave 11',
    'life_meaning': 'World Values Survey Wave 11',
    'economic_outlook': 'World Values Survey Wave 11',
    'social_mobility': 'World Values Survey Wave 11',
    'digital_trust': 'World Values Survey Wave 11',
    'mental_health': 'World Values Survey Wave 11',
    'social_support': 'World Values Survey Wave 11',
    'ai_trust': 'World Values Survey Wave 11',
    'future_optimism': 'World Values Survey Wave 11',
    'digital_literacy': 'World Values Survey Wave 11',
    'cybersecurity_awareness': 'World Values Survey Wave 11',
    'global_citizenship': 'World Values Survey Wave 11',
    'cultural_identity': 'World Values Survey Wave 11',
    'intergenerational_solidarity': 'World Values Survey Wave 11',
    'sustainable_living': 'World Values Survey Wave 11',
    'digital_inclusion': 'World Values Survey Wave 11',
    'digital_wellbeing': 'World Values Survey Wave 11',
    'social_cohesion': 'World Values Survey Wave 11',
    'intergenerational_equity': 'World Values Survey Wave 11',
    'sustainable_consumption': 'World Values Survey Wave 11',
    'digital_resilience': 'World Values Survey Wave 11'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WVS11DataFetcher {
    if (!WVS11DataFetcher.instance) {
      WVS11DataFetcher.instance = new WVS11DataFetcher();
    }
    return WVS11DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WVS11', year, 0),
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
      'global_citizenship': [1, 5],
      'cultural_identity': [1, 5],
      'intergenerational_solidarity': [1, 5],
      'sustainable_living': [1, 5],
      'digital_inclusion': [1, 5],
      'digital_wellbeing': [1, 5],
      'social_cohesion': [1, 5],
      'intergenerational_equity': [1, 5],
      'sustainable_consumption': [1, 5],
      'digital_resilience': [1, 5]
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
      'global_citizenship': 'scale (1-5)',
      'cultural_identity': 'scale (1-5)',
      'intergenerational_solidarity': 'scale (1-5)',
      'sustainable_living': 'scale (1-5)',
      'digital_inclusion': 'scale (1-5)',
      'digital_wellbeing': 'scale (1-5)',
      'social_cohesion': 'scale (1-5)',
      'intergenerational_equity': 'scale (1-5)',
      'sustainable_consumption': 'scale (1-5)',
      'digital_resilience': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2029, 2030];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Austria',
      'Azerbaijan', 'Bangladesh', 'Belarus', 'Belgium', 'Bosnia and Herzegovina',
      'Brazil', 'Bulgaria', 'Canada', 'Chile', 'China', 'Colombia', 'Croatia',
      'Cyprus', 'Czech Republic', 'Denmark', 'Ecuador', 'Egypt', 'Estonia',
      'Finland', 'France', 'Georgia', 'Germany', 'Greece', 'Hungary', 'Iceland',
      'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy',
      'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kosovo', 'Kuwait', 'Kyrgyzstan',
      'Latvia', 'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Malaysia',
      'Malta', 'Mexico', 'Moldova', 'Montenegro', 'Morocco', 'Netherlands',
      'New Zealand', 'Nigeria', 'North Macedonia', 'Norway', 'Pakistan',
      'Palestine', 'Peru', 'Philippines', 'Poland', 'Portugal', 'Qatar',
      'Romania', 'Russia', 'Saudi Arabia', 'Serbia', 'Singapore', 'Slovakia',
      'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sweden',
      'Switzerland', 'Taiwan', 'Thailand', 'Tunisia', 'Turkey', 'Ukraine',
      'United Arab Emirates', 'United Kingdom', 'United States', 'Uruguay',
      'Uzbekistan', 'Venezuela', 'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 