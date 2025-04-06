import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WEFDataFetcher {
  private static instance: WEFDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'global_competitiveness': 'World Economic Forum',
    'innovation_capability': 'World Economic Forum',
    'digital_skills': 'World Economic Forum',
    'labor_market_efficiency': 'World Economic Forum',
    'financial_system_development': 'World Economic Forum',
    'market_size': 'World Economic Forum',
    'business_dynamism': 'World Economic Forum',
    'product_market_efficiency': 'World Economic Forum',
    'infrastructure_quality': 'World Economic Forum',
    'macroeconomic_stability': 'World Economic Forum',
    'health_quality': 'World Economic Forum',
    'skills_quality': 'World Economic Forum',
    'institutions_quality': 'World Economic Forum',
    'ict_adoption': 'World Economic Forum',
    'sustainable_development': 'World Economic Forum',
    'social_capital': 'World Economic Forum',
    'environmental_sustainability': 'World Economic Forum',
    'economic_complexity': 'World Economic Forum',
    'future_readiness': 'World Economic Forum',
    'digital_transformation': 'World Economic Forum'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WEFDataFetcher {
    if (!WEFDataFetcher.instance) {
      WEFDataFetcher.instance = new WEFDataFetcher();
    }
    return WEFDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('WEF', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'global_competitiveness': [0, 100],
      'innovation_capability': [0, 100],
      'digital_skills': [0, 100],
      'labor_market_efficiency': [0, 100],
      'financial_system_development': [0, 100],
      'market_size': [0, 100],
      'business_dynamism': [0, 100],
      'product_market_efficiency': [0, 100],
      'infrastructure_quality': [0, 100],
      'macroeconomic_stability': [0, 100],
      'health_quality': [0, 100],
      'skills_quality': [0, 100],
      'institutions_quality': [0, 100],
      'ict_adoption': [0, 100],
      'sustainable_development': [0, 100],
      'social_capital': [0, 100],
      'environmental_sustainability': [0, 100],
      'economic_complexity': [0, 100],
      'future_readiness': [0, 100],
      'digital_transformation': [0, 100]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    return 'index (0-100)';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2023, 2024];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Albania', 'Argentina', 'Armenia', 'Australia', 'Austria', 'Azerbaijan',
      'Bahrain', 'Bangladesh', 'Belgium', 'Bolivia', 'Brazil', 'Bulgaria',
      'Cambodia', 'Canada', 'Chile', 'China', 'Colombia', 'Costa Rica',
      'Croatia', 'Cyprus', 'Czech Republic', 'Denmark', 'Dominican Republic',
      'Ecuador', 'Egypt', 'El Salvador', 'Estonia', 'Ethiopia', 'Finland',
      'France', 'Georgia', 'Germany', 'Greece', 'Guatemala', 'Honduras',
      'Hong Kong', 'Hungary', 'Iceland', 'India', 'Indonesia', 'Ireland',
      'Israel', 'Italy', 'Japan', 'Jordan', 'Kazakhstan', 'Kenya', 'Kuwait',
      'Latvia', 'Lithuania', 'Luxembourg', 'Macau', 'Malaysia', 'Malta',
      'Mauritius', 'Mexico', 'Mongolia', 'Montenegro', 'Morocco', 'Myanmar',
      'Nepal', 'Netherlands', 'New Zealand', 'Nicaragua', 'Nigeria', 'Norway',
      'Oman', 'Pakistan', 'Panama', 'Paraguay', 'Peru', 'Philippines', 'Poland',
      'Portugal', 'Qatar', 'Romania', 'Russia', 'Rwanda', 'Saudi Arabia',
      'Serbia', 'Singapore', 'Slovakia', 'Slovenia', 'South Africa', 'South Korea',
      'Spain', 'Sri Lanka', 'Sweden', 'Switzerland', 'Taiwan', 'Tajikistan',
      'Thailand', 'Tunisia', 'Turkey', 'Ukraine', 'United Arab Emirates',
      'United Kingdom', 'United States', 'Uruguay', 'Vietnam', 'Zambia'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 