import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class OECDDataFetcher {
  private static instance: OECDDataFetcher;
  private marker: DataSourceMarker;
  private readonly metrics = {
    'life_satisfaction': 'BLI',
    'work_life_balance': 'BLI',
    'environment_quality': 'BLI',
    'housing_conditions': 'BLI',
    'income_wealth': 'BLI',
    'jobs_earnings': 'BLI',
    'education_skills': 'BLI',
    'social_connections': 'BLI',
    'civic_engagement': 'BLI',
    'health_status': 'BLI',
    'safety': 'BLI',
    'subjective_wellbeing': 'BLI'
  };

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): OECDDataFetcher {
    if (!OECDDataFetcher.instance) {
      OECDDataFetcher.instance = new OECDDataFetcher();
    }
    return OECDDataFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual OECD API call
    // For now, return mock data based on OECD Better Life Index structure
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      // Generate mock data for each metric
      Object.entries(this.metrics).forEach(([metric, source]) => {
        mockData[`${country}_${metric}`] = {
          name: metric,
          value: this.generateMockValue(metric),
          validity: this.marker.markData('OECD', year, 0),
          unit: this.getUnitForMetric(metric)
        };
      });
    });

    return mockData;
  }

  private generateMockValue(metric: string): number {
    // Generate realistic mock values based on metric type
    const ranges: Record<string, [number, number]> = {
      'life_satisfaction': [0, 10],
      'work_life_balance': [0, 10],
      'environment_quality': [0, 100],
      'housing_conditions': [0, 100],
      'income_wealth': [0, 100],
      'jobs_earnings': [0, 100],
      'education_skills': [0, 100],
      'social_connections': [0, 100],
      'civic_engagement': [0, 100],
      'health_status': [0, 100],
      'safety': [0, 100],
      'subjective_wellbeing': [0, 10]
    };

    const [min, max] = ranges[metric] || [0, 100];
    return Math.random() * (max - min) + min;
  }

  private getUnitForMetric(metric: string): string {
    const units: Record<string, string> = {
      'life_satisfaction': 'points',
      'work_life_balance': 'hours',
      'environment_quality': 'index',
      'housing_conditions': 'index',
      'income_wealth': 'USD',
      'jobs_earnings': 'USD',
      'education_skills': 'years',
      'social_connections': 'index',
      'civic_engagement': 'index',
      'health_status': 'index',
      'safety': 'index',
      'subjective_wellbeing': 'points'
    };

    return units[metric] || 'index';
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching from OECD API
    return [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching from OECD API
    return [
      'Australia', 'Austria', 'Belgium', 'Canada', 'Chile', 'Colombia', 'Costa Rica',
      'Czech Republic', 'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece',
      'Hungary', 'Iceland', 'Ireland', 'Israel', 'Italy', 'Japan', 'Korea', 'Latvia',
      'Lithuania', 'Luxembourg', 'Mexico', 'Netherlands', 'New Zealand', 'Norway',
      'Poland', 'Portugal', 'Slovak Republic', 'Slovenia', 'Spain', 'Sweden',
      'Switzerland', 'Turkey', 'United Kingdom', 'United States'
    ];
  }

  public async getAvailableMetrics(): Promise<string[]> {
    return Object.keys(this.metrics);
  }
} 