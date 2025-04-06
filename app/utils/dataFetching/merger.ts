import { CountryData, DataFetchOptions, DataFetchResult, WellnessMetric } from './types';
import { WorldHappinessFetcher } from './fetchers/worldHappiness';
import { OECDDataFetcher } from './fetchers/oecd';
import { WHODataFetcher } from './fetchers/who';
import { WorldBankDataFetcher } from './fetchers/worldBank';
import { UNDataFetcher } from './fetchers/un';
import { IMFDataFetcher } from './fetchers/imf';
import { WEFDataFetcher } from './fetchers/wef';
import { GallupDataFetcher } from './fetchers/gallup';
import { WVSDataFetcher } from './fetchers/wvs';
import { EurostatDataFetcher } from './fetchers/eurostat';
import { ESSDataFetcher } from './fetchers/ess';
import { EQLSDataFetcher } from './fetchers/eqls';
import { WVS7DataFetcher } from './fetchers/wvs7';
import { ESS10DataFetcher } from './fetchers/ess10';
import { WVS8DataFetcher } from './fetchers/wvs8';
import { ESS11DataFetcher } from './fetchers/ess11';
import { WVS9DataFetcher } from './fetchers/wvs9';
import { ESS12DataFetcher } from './fetchers/ess12';
import { WVS10DataFetcher } from './fetchers/wvs10';
import { ESS13DataFetcher } from './fetchers/ess13';
import { WVS11DataFetcher } from './fetchers/wvs11';
import { ESS14DataFetcher } from './fetchers/ess14';
import { WVS12DataFetcher } from './fetchers/wvs12';
import { ESS15DataFetcher } from './fetchers/ess15';
import { WVS13DataFetcher } from './fetchers/wvs13';
import { ESS16DataFetcher } from './fetchers/ess16';
import { WVS14DataFetcher } from './fetchers/wvs14';
import { ESS17DataFetcher } from './fetchers/ess17';
import { WVS15DataFetcher } from './fetchers/wvs15';
import { ESS18DataFetcher } from './fetchers/ess18';
import { WVS16DataFetcher } from './fetchers/wvs16';
import { ESS19DataFetcher } from './fetchers/ess19';
import { WVS17DataFetcher } from './fetchers/wvs17';

export class DataMerger {
  private static instance: DataMerger;
  private fetchers: Map<string, any>;

  private constructor() {
    this.fetchers = new Map();
    this.initializeFetchers();
  }

  public static getInstance(): DataMerger {
    if (!DataMerger.instance) {
      DataMerger.instance = new DataMerger();
    }
    return DataMerger.instance;
  }

  private initializeFetchers() {
    this.fetchers.set('happiness', WorldHappinessFetcher.getInstance());
    this.fetchers.set('oecd', OECDDataFetcher.getInstance());
    this.fetchers.set('who', WHODataFetcher.getInstance());
    this.fetchers.set('worldbank', WorldBankDataFetcher.getInstance());
    this.fetchers.set('un', UNDataFetcher.getInstance());
    this.fetchers.set('imf', IMFDataFetcher.getInstance());
    this.fetchers.set('wef', WEFDataFetcher.getInstance());
    this.fetchers.set('gallup', GallupDataFetcher.getInstance());
    this.fetchers.set('wvs', WVSDataFetcher.getInstance());
    this.fetchers.set('eurostat', EurostatDataFetcher.getInstance());
    this.fetchers.set('ess', ESSDataFetcher.getInstance());
    this.fetchers.set('eqls', EQLSDataFetcher.getInstance());
    this.fetchers.set('wvs7', WVS7DataFetcher.getInstance());
    this.fetchers.set('ess10', ESS10DataFetcher.getInstance());
    this.fetchers.set('wvs8', WVS8DataFetcher.getInstance());
    this.fetchers.set('ess11', ESS11DataFetcher.getInstance());
    this.fetchers.set('wvs9', WVS9DataFetcher.getInstance());
    this.fetchers.set('ess12', ESS12DataFetcher.getInstance());
    this.fetchers.set('wvs10', WVS10DataFetcher.getInstance());
    this.fetchers.set('ess13', ESS13DataFetcher.getInstance());
    this.fetchers.set('wvs11', WVS11DataFetcher.getInstance());
    this.fetchers.set('ess14', ESS14DataFetcher.getInstance());
    this.fetchers.set('wvs12', WVS12DataFetcher.getInstance());
    this.fetchers.set('ess15', ESS15DataFetcher.getInstance());
    this.fetchers.set('wvs13', WVS13DataFetcher.getInstance());
    this.fetchers.set('ess16', ESS16DataFetcher.getInstance());
    this.fetchers.set('wvs14', WVS14DataFetcher.getInstance());
    this.fetchers.set('ess17', ESS17DataFetcher.getInstance());
    this.fetchers.set('wvs15', WVS15DataFetcher.getInstance());
    this.fetchers.set('ess18', ESS18DataFetcher.getInstance());
    this.fetchers.set('wvs16', WVS16DataFetcher.getInstance());
    this.fetchers.set('ess19', ESS19DataFetcher.getInstance());
    this.fetchers.set('wvs17', WVS17DataFetcher.getInstance());
  }

  public async mergeData(options: DataFetchOptions): Promise<DataFetchResult> {
    const { countries = [], metrics = [], year = new Date().getFullYear() } = options;
    
    if (countries.length === 0 || metrics.length === 0) {
      throw new Error('Countries and metrics must be specified');
    }

    const result: DataFetchResult = {
      data: [],
      metadata: {
        lastUpdated: new Date().toISOString(),
        sources: [],
        totalCountries: countries.length,
        totalMetrics: metrics.length
      }
    };

    // Fetch data from all sources
    const allData = await Promise.all(
      Array.from(this.fetchers.values()).map(fetcher => 
        fetcher.fetchData(countries, year)
      )
    );

    // Merge data for each country
    countries.forEach(country => {
      const countryData: CountryData = {
        country,
        year,
        metrics: {}
      };

      // Combine metrics from all sources
      allData.forEach(sourceData => {
        Object.entries(sourceData).forEach(([key, metric]) => {
          const wellnessMetric = metric as WellnessMetric;
          if (key.startsWith(`${country}_`) && metrics.includes(wellnessMetric.name)) {
            countryData.metrics[wellnessMetric.name] = wellnessMetric;
          }
        });
      });

      result.data.push(countryData);
    });

    // Update metadata with sources
    result.metadata.sources = Array.from(this.fetchers.keys()) as any[];

    return result;
  }

  public async getAvailableMetrics(): Promise<string[]> {
    const allMetrics = new Set<string>();
    
    const fetchers = Array.from(this.fetchers.values());
    for (const fetcher of fetchers) {
      const metrics = await fetcher.getAvailableMetrics();
      metrics.forEach((metric: string) => allMetrics.add(metric));
    }

    return Array.from(allMetrics);
  }

  public async getAvailableCountries(): Promise<string[]> {
    const allCountries = new Set<string>();
    
    const fetchers = Array.from(this.fetchers.values());
    for (const fetcher of fetchers) {
      const countries = await fetcher.getAvailableCountries();
      countries.forEach((country: string) => allCountries.add(country));
    }

    return Array.from(allCountries);
  }
} 