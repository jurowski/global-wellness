import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WVS16DataFetcher {
  private static instance: WVS16DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'World Values Survey Wave 16',
    'happiness': 'World Values Survey Wave 16',
    'trust_in_people': 'World Values Survey Wave 16',
    'trust_in_police': 'World Values Survey Wave 16',
    'trust_in_politics': 'World Values Survey Wave 16',
    'trust_in_healthcare': 'World Values Survey Wave 16',
    'trust_in_education': 'World Values Survey Wave 16',
    'trust_in_technology': 'World Values Survey Wave 16',
    'social_trust': 'World Values Survey Wave 16',
    'political_trust': 'World Values Survey Wave 16',
    'institutional_trust': 'World Values Survey Wave 16',
    'social_connectedness': 'World Values Survey Wave 16',
    'digital_engagement': 'World Values Survey Wave 16',
    'environmental_concern': 'World Values Survey Wave 16',
    'climate_change_concern': 'World Values Survey Wave 16',
    'gender_equality': 'World Values Survey Wave 16',
    'work_life_balance': 'World Values Survey Wave 16',
    'political_engagement': 'World Values Survey Wave 16',
    'social_tolerance': 'World Values Survey Wave 16',
    'cultural_openness': 'World Values Survey Wave 16',
    'health_status': 'World Values Survey Wave 16',
    'subjective_wellbeing': 'World Values Survey Wave 16',
    'life_meaning': 'World Values Survey Wave 16',
    'economic_outlook': 'World Values Survey Wave 16',
    'social_mobility': 'World Values Survey Wave 16',
    'digital_trust': 'World Values Survey Wave 16',
    'mental_health': 'World Values Survey Wave 16',
    'social_support': 'World Values Survey Wave 16',
    'ai_trust': 'World Values Survey Wave 16',
    'future_optimism': 'World Values Survey Wave 16',
    'digital_literacy': 'World Values Survey Wave 16',
    'cybersecurity_awareness': 'World Values Survey Wave 16',
    'digital_wellbeing': 'World Values Survey Wave 16',
    'social_cohesion': 'World Values Survey Wave 16',
    'intergenerational_equity': 'World Values Survey Wave 16',
    'sustainable_consumption': 'World Values Survey Wave 16',
    'digital_resilience': 'World Values Survey Wave 16',
    'digital_inclusion': 'World Values Survey Wave 16',
    'social_innovation': 'World Values Survey Wave 16',
    'environmental_action': 'World Values Survey Wave 16',
    'digital_ethics': 'World Values Survey Wave 16',
    'global_citizenship': 'World Values Survey Wave 16',
    'cultural_heritage': 'World Values Survey Wave 16',
    'intercultural_understanding': 'World Values Survey Wave 16',
    'peace_attitudes': 'World Values Survey Wave 16',
    'conflict_resolution': 'World Values Survey Wave 16',
    'human_rights': 'World Values Survey Wave 16',
    'democratic_values': 'World Values Survey Wave 16',
    'global_cooperation': 'World Values Survey Wave 16',
    'sustainable_development': 'World Values Survey Wave 16',
    'future_generations': 'World Values Survey Wave 16',
    'digital_democracy': 'World Values Survey Wave 16',
    'social_resilience': 'World Values Survey Wave 16',
    'environmental_resilience': 'World Values Survey Wave 16',
    'digital_sustainability': 'World Values Survey Wave 16',
    'social_sustainability': 'World Values Survey Wave 16',
    'cultural_sustainability': 'World Values Survey Wave 16',
    'economic_sustainability': 'World Values Survey Wave 16',
    'political_sustainability': 'World Values Survey Wave 16',
    'environmental_sustainability': 'World Values Survey Wave 16',
    'quantum_awareness': 'World Values Survey Wave 16',
    'biotech_ethics': 'World Values Survey Wave 16',
    'space_exploration': 'World Values Survey Wave 16',
    'artificial_intelligence': 'World Values Survey Wave 16',
    'virtual_reality': 'World Values Survey Wave 16',
    'augmented_reality': 'World Values Survey Wave 16',
    'metaverse_engagement': 'World Values Survey Wave 16',
    'digital_identity': 'World Values Survey Wave 16',
    'cyber_security': 'World Values Survey Wave 16',
    'data_privacy': 'World Values Survey Wave 16',
    'digital_rights': 'World Values Survey Wave 16',
    'technological_optimism': 'World Values Survey Wave 16',
    'future_work': 'World Values Survey Wave 16',
    'digital_economy': 'World Values Survey Wave 16',
    'smart_cities': 'World Values Survey Wave 16',
    'digital_infrastructure': 'World Values Survey Wave 16',
    'technological_equity': 'World Values Survey Wave 16',
    'digital_governance': 'World Values Survey Wave 16',
    'technological_resilience': 'World Values Survey Wave 16',
    'digital_innovation': 'World Values Survey Wave 16',
    'technological_sustainability': 'World Values Survey Wave 16'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WVS16DataFetcher {
    if (!WVS16DataFetcher.instance) {
      WVS16DataFetcher.instance = new WVS16DataFetcher();
    }
    return WVS16DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WVS16', year, 0),
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
      'digital_ethics': [1, 5],
      'global_citizenship': [1, 5],
      'cultural_heritage': [1, 5],
      'intercultural_understanding': [1, 5],
      'peace_attitudes': [1, 5],
      'conflict_resolution': [1, 5],
      'human_rights': [1, 5],
      'democratic_values': [1, 5],
      'global_cooperation': [1, 5],
      'sustainable_development': [1, 5],
      'future_generations': [1, 5],
      'digital_democracy': [1, 5],
      'social_resilience': [1, 5],
      'environmental_resilience': [1, 5],
      'digital_sustainability': [1, 5],
      'social_sustainability': [1, 5],
      'cultural_sustainability': [1, 5],
      'economic_sustainability': [1, 5],
      'political_sustainability': [1, 5],
      'environmental_sustainability': [1, 5],
      'quantum_awareness': [1, 5],
      'biotech_ethics': [1, 5],
      'space_exploration': [1, 5],
      'artificial_intelligence': [1, 5],
      'virtual_reality': [1, 5],
      'augmented_reality': [1, 5],
      'metaverse_engagement': [1, 5],
      'digital_identity': [1, 5],
      'cyber_security': [1, 5],
      'data_privacy': [1, 5],
      'digital_rights': [1, 5],
      'technological_optimism': [1, 5],
      'future_work': [1, 5],
      'digital_economy': [1, 5],
      'smart_cities': [1, 5],
      'digital_infrastructure': [1, 5],
      'technological_equity': [1, 5],
      'digital_governance': [1, 5],
      'technological_resilience': [1, 5],
      'digital_innovation': [1, 5],
      'technological_sustainability': [1, 5]
    };

    const [min, max] = ranges[metric] || [1, 5];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_satisfaction': 'scale (1-10)',
      'happiness': 'scale (1-4)',
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
      'digital_ethics': 'scale (1-5)',
      'global_citizenship': 'scale (1-5)',
      'cultural_heritage': 'scale (1-5)',
      'intercultural_understanding': 'scale (1-5)',
      'peace_attitudes': 'scale (1-5)',
      'conflict_resolution': 'scale (1-5)',
      'human_rights': 'scale (1-5)',
      'democratic_values': 'scale (1-5)',
      'global_cooperation': 'scale (1-5)',
      'sustainable_development': 'scale (1-5)',
      'future_generations': 'scale (1-5)',
      'digital_democracy': 'scale (1-5)',
      'social_resilience': 'scale (1-5)',
      'environmental_resilience': 'scale (1-5)',
      'digital_sustainability': 'scale (1-5)',
      'social_sustainability': 'scale (1-5)',
      'cultural_sustainability': 'scale (1-5)',
      'economic_sustainability': 'scale (1-5)',
      'political_sustainability': 'scale (1-5)',
      'environmental_sustainability': 'scale (1-5)',
      'quantum_awareness': 'scale (1-5)',
      'biotech_ethics': 'scale (1-5)',
      'space_exploration': 'scale (1-5)',
      'artificial_intelligence': 'scale (1-5)',
      'virtual_reality': 'scale (1-5)',
      'augmented_reality': 'scale (1-5)',
      'metaverse_engagement': 'scale (1-5)',
      'digital_identity': 'scale (1-5)',
      'cyber_security': 'scale (1-5)',
      'data_privacy': 'scale (1-5)',
      'digital_rights': 'scale (1-5)',
      'technological_optimism': 'scale (1-5)',
      'future_work': 'scale (1-5)',
      'digital_economy': 'scale (1-5)',
      'smart_cities': 'scale (1-5)',
      'digital_infrastructure': 'scale (1-5)',
      'technological_equity': 'scale (1-5)',
      'digital_governance': 'scale (1-5)',
      'technological_resilience': 'scale (1-5)',
      'digital_innovation': 'scale (1-5)',
      'technological_sustainability': 'scale (1-5)'
    };

    return units[metric] || 'scale (1-5)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2039, 2040];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Albania', 'Algeria', 'Argentina', 'Armenia', 'Australia', 'Azerbaijan',
      'Bangladesh', 'Belarus', 'Brazil', 'Bulgaria', 'Burkina Faso', 'Cambodia',
      'Canada', 'Chile', 'China', 'Colombia', 'Croatia', 'Cyprus', 'Czech Republic',
      'Ecuador', 'Egypt', 'Estonia', 'Ethiopia', 'Finland', 'France', 'Georgia',
      'Germany', 'Ghana', 'Greece', 'Guatemala', 'Hong Kong', 'Hungary', 'Iceland',
      'India', 'Indonesia', 'Iran', 'Iraq', 'Ireland', 'Israel', 'Italy', 'Japan',
      'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait', 'Kyrgyzstan', 'Laos', 'Latvia',
      'Lebanon', 'Libya', 'Lithuania', 'Luxembourg', 'Macau', 'Malaysia', 'Mali',
      'Malta', 'Mexico', 'Moldova', 'Mongolia', 'Montenegro', 'Morocco', 'Myanmar',
      'Nepal', 'Netherlands', 'New Zealand', 'Nigeria', 'North Korea', 'Norway',
      'Pakistan', 'Palestine', 'Peru', 'Philippines', 'Poland', 'Portugal',
      'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia', 'Serbia', 'Singapore',
      'Slovakia', 'Slovenia', 'South Africa', 'South Korea', 'Spain', 'Sri Lanka',
      'Sweden', 'Switzerland', 'Syria', 'Taiwan', 'Tajikistan', 'Thailand',
      'Tunisia', 'Turkey', 'Turkmenistan', 'Ukraine', 'United Arab Emirates',
      'United Kingdom', 'United States', 'Uruguay', 'Uzbekistan', 'Venezuela',
      'Vietnam', 'Yemen', 'Zambia', 'Zimbabwe'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 