import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class EurostatDataFetcher {
  private static instance: EurostatDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_expectancy': 'Eurostat',
    'healthy_life_years': 'Eurostat',
    'employment_rate': 'Eurostat',
    'unemployment_rate': 'Eurostat',
    'poverty_risk': 'Eurostat',
    'income_inequality': 'Eurostat',
    'education_attainment': 'Eurostat',
    'digital_skills': 'Eurostat',
    'environmental_quality': 'Eurostat',
    'air_pollution': 'Eurostat',
    'renewable_energy': 'Eurostat',
    'health_expenditure': 'Eurostat',
    'social_protection': 'Eurostat',
    'work_life_balance': 'Eurostat',
    'gender_pay_gap': 'Eurostat'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): EurostatDataFetcher {
    if (!EurostatDataFetcher.instance) {
      EurostatDataFetcher.instance = new EurostatDataFetcher();
    }
    return EurostatDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('Eurostat', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    const ranges: Record<string, [number, number]> = {
      'life_expectancy': [70, 85],
      'healthy_life_years': [50, 70],
      'employment_rate': [50, 90],
      'unemployment_rate': [2, 25],
      'poverty_risk': [5, 30],
      'income_inequality': [20, 40],
      'education_attainment': [50, 100],
      'digital_skills': [30, 90],
      'environmental_quality': [50, 100],
      'air_pollution': [5, 50],
      'renewable_energy': [10, 60],
      'health_expenditure': [5, 15],
      'social_protection': [15, 35],
      'work_life_balance': [50, 100],
      'gender_pay_gap': [0, 25]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_expectancy': 'years',
      'healthy_life_years': 'years',
      'employment_rate': 'percentage',
      'unemployment_rate': 'percentage',
      'poverty_risk': 'percentage',
      'income_inequality': 'Gini coefficient',
      'education_attainment': 'percentage',
      'digital_skills': 'percentage',
      'environmental_quality': 'index (0-100)',
      'air_pollution': 'µg/m³',
      'renewable_energy': 'percentage',
      'health_expenditure': 'percentage of GDP',
      'social_protection': 'percentage of GDP',
      'work_life_balance': 'index (0-100)',
      'gender_pay_gap': 'percentage'
    };

    return units[metric] || 'percentage';
  }

  public async getAvailableYears(): Promise<number[]> {
    return [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
  }

  public async getAvailableCountries(): Promise<string[]> {
    return [
      'Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Ireland', 'Italy', 'Latvia', 'Lithuania', 'Luxembourg',
      'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania', 'Slovakia',
      'Slovenia', 'Spain', 'Sweden', 'Iceland', 'Liechtenstein', 'Norway',
      'Switzerland', 'United Kingdom'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 