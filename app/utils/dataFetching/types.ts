export type DataSource = 'WHO' | 'OECD' | 'UN' | 'WorldBank' | 'WorldHappiness' | 'IMF' | 'WEF' | 'Gallup' | 'WVS' | 'Eurostat' | 'ESS' | 'EQLS' | 'WVS7' | 'ESS10' | 'WVS8' | 'ESS11' | 'WVS9' | 'ESS12' | 'WVS10' | 'ESS13' | 'WVS11' | 'ESS14' | 'WVS12' | 'ESS15' | 'WVS13' | 'ESS16' | 'WVS14' | 'ESS17' | 'WVS15' | 'ESS18' | 'WVS16' | 'ESS19' | 'WVS17';

export type DataValidity = {
  source: DataSource;
  year: number;
  isVerified: boolean;
  confidence: number;
  notes?: string;
};

export type WellnessMetric = {
  name: string;
  value: number;
  validity: DataValidity;
  unit?: string;
};

export type CountryData = {
  country: string;
  metrics: Record<string, WellnessMetric>;
  year: number;
};

export type DataFetchOptions = {
  countries?: string[];
  metrics?: string[];
  year?: number;
  forceRefresh?: boolean;
};

export type DataFetchResult = {
  data: CountryData[];
  metadata: {
    lastUpdated: string;
    sources: DataSource[];
    totalCountries: number;
    totalMetrics: number;
  };
}; 