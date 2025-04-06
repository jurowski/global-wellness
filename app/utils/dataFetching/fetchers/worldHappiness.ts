import { DataSource, DataValidity, WellnessMetric } from '../types';
import { DataSourceMarker } from '../sourceMarker';

export class WorldHappinessFetcher {
  private static instance: WorldHappinessFetcher;
  private marker: DataSourceMarker;

  private constructor() {
    this.marker = DataSourceMarker.getInstance();
  }

  public static getInstance(): WorldHappinessFetcher {
    if (!WorldHappinessFetcher.instance) {
      WorldHappinessFetcher.instance = new WorldHappinessFetcher();
    }
    return WorldHappinessFetcher.instance;
  }

  public async fetchData(countries: string[], year: number): Promise<Record<string, WellnessMetric>> {
    // TODO: Implement actual API call to World Happiness Report
    // For now, return mock data
    const mockData: Record<string, WellnessMetric> = {};
    
    countries.forEach(country => {
      mockData[country] = {
        name: 'happiness_score',
        value: Math.random() * 10, // Random score between 0-10
        validity: this.marker.markData('WorldHappiness', year, 0),
        unit: 'points'
      };
    });

    return mockData;
  }

  public async getAvailableYears(): Promise<number[]> {
    // TODO: Implement actual year fetching
    return [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023];
  }

  public async getAvailableCountries(): Promise<string[]> {
    // TODO: Implement actual country list fetching
    return ['Finland', 'Denmark', 'Iceland', 'Israel', 'Netherlands'];
  }
} 