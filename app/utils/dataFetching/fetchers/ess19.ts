import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class ESS19DataFetcher {
  private static instance: ESS19DataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'European Social Survey Wave 19',
    'happiness': 'European Social Survey Wave 19',
    'trust_in_people': 'European Social Survey Wave 19',
    'trust_in_police': 'European Social Survey Wave 19',
    'trust_in_politics': 'European Social Survey Wave 19',
    'trust_in_healthcare': 'European Social Survey Wave 19',
    'trust_in_education': 'European Social Survey Wave 19',
    'trust_in_technology': 'European Social Survey Wave 19',
    'social_trust': 'European Social Survey Wave 19',
    'political_trust': 'European Social Survey Wave 19',
    'institutional_trust': 'European Social Survey Wave 19',
    'social_connectedness': 'European Social Survey Wave 19',
    'digital_engagement': 'European Social Survey Wave 19',
    'environmental_concern': 'European Social Survey Wave 19',
    'climate_change_concern': 'European Social Survey Wave 19',
    'gender_equality': 'European Social Survey Wave 19',
    'work_life_balance': 'European Social Survey Wave 19',
    'political_engagement': 'European Social Survey Wave 19',
    'social_tolerance': 'European Social Survey Wave 19',
    'cultural_openness': 'European Social Survey Wave 19',
    'health_status': 'European Social Survey Wave 19',
    'subjective_wellbeing': 'European Social Survey Wave 19',
    'life_meaning': 'European Social Survey Wave 19',
    'economic_outlook': 'European Social Survey Wave 19',
    'social_mobility': 'European Social Survey Wave 19',
    'digital_trust': 'European Social Survey Wave 19',
    'mental_health': 'European Social Survey Wave 19',
    'social_support': 'European Social Survey Wave 19',
    'ai_trust': 'European Social Survey Wave 19',
    'future_optimism': 'European Social Survey Wave 19',
    'digital_literacy': 'European Social Survey Wave 19',
    'cybersecurity_awareness': 'European Social Survey Wave 19',
    'digital_wellbeing': 'European Social Survey Wave 19',
    'social_cohesion': 'European Social Survey Wave 19',
    'intergenerational_equity': 'European Social Survey Wave 19',
    'sustainable_consumption': 'European Social Survey Wave 19',
    'digital_resilience': 'European Social Survey Wave 19',
    'digital_inclusion': 'European Social Survey Wave 19',
    'social_innovation': 'European Social Survey Wave 19',
    'environmental_action': 'European Social Survey Wave 19',
    'digital_ethics': 'European Social Survey Wave 19',
    'global_citizenship': 'European Social Survey Wave 19',
    'cultural_heritage': 'European Social Survey Wave 19',
    'intercultural_understanding': 'European Social Survey Wave 19',
    'peace_attitudes': 'European Social Survey Wave 19',
    'conflict_resolution': 'European Social Survey Wave 19',
    'human_rights': 'European Social Survey Wave 19',
    'democratic_values': 'European Social Survey Wave 19',
    'global_cooperation': 'European Social Survey Wave 19',
    'sustainable_development': 'European Social Survey Wave 19',
    'future_generations': 'European Social Survey Wave 19',
    'digital_democracy': 'European Social Survey Wave 19',
    'social_resilience': 'European Social Survey Wave 19',
    'environmental_resilience': 'European Social Survey Wave 19',
    'digital_sustainability': 'European Social Survey Wave 19',
    'social_sustainability': 'European Social Survey Wave 19',
    'cultural_sustainability': 'European Social Survey Wave 19',
    'economic_sustainability': 'European Social Survey Wave 19',
    'political_sustainability': 'European Social Survey Wave 19',
    'environmental_sustainability': 'European Social Survey Wave 19',
    'quantum_awareness': 'European Social Survey Wave 19',
    'biotech_ethics': 'European Social Survey Wave 19',
    'space_exploration': 'European Social Survey Wave 19',
    'artificial_intelligence': 'European Social Survey Wave 19',
    'virtual_reality': 'European Social Survey Wave 19',
    'augmented_reality': 'European Social Survey Wave 19',
    'metaverse_engagement': 'European Social Survey Wave 19',
    'digital_identity': 'European Social Survey Wave 19',
    'cyber_security': 'European Social Survey Wave 19',
    'data_privacy': 'European Social Survey Wave 19',
    'digital_rights': 'European Social Survey Wave 19',
    'technological_optimism': 'European Social Survey Wave 19',
    'future_work': 'European Social Survey Wave 19',
    'digital_economy': 'European Social Survey Wave 19',
    'smart_cities': 'European Social Survey Wave 19',
    'digital_infrastructure': 'European Social Survey Wave 19',
    'technological_equity': 'European Social Survey Wave 19',
    'digital_governance': 'European Social Survey Wave 19',
    'technological_resilience': 'European Social Survey Wave 19',
    'digital_innovation': 'European Social Survey Wave 19',
    'technological_sustainability': 'European Social Survey Wave 19'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): ESS19DataFetcher {
    if (!ESS19DataFetcher.instance) {
      ESS19DataFetcher.instance = new ESS19DataFetcher();
    }
    return ESS19DataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('ESS19', year, 0),
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
    return [2040, 2041];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Albania', 'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus',
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany',
      'Greece', 'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Latvia',
      'Lithuania', 'Luxembourg', 'Montenegro', 'Netherlands', 'North Macedonia',
      'Norway', 'Poland', 'Portugal', 'Romania', 'Serbia', 'Slovakia', 'Slovenia',
      'Spain', 'Sweden', 'Switzerland', 'Turkey', 'Ukraine', 'United Kingdom'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 