import { DataSource, DataValidity } from './types';

export class DataSourceMarker {
  private static instance: DataSourceMarker;
  private sourceConfig: Record<DataSource, {
    minYear: number;
    maxYear: number;
    confidenceThreshold: number;
  }>;

  private constructor() {
    this.sourceConfig = {
      WHO: { minYear: 2000, maxYear: 2023, confidenceThreshold: 0.8 },
      OECD: { minYear: 2010, maxYear: 2023, confidenceThreshold: 0.9 },
      UN: { minYear: 1990, maxYear: 2023, confidenceThreshold: 0.85 },
      WorldBank: { minYear: 1960, maxYear: 2023, confidenceThreshold: 0.75 },
      WorldHappiness: { minYear: 2012, maxYear: 2023, confidenceThreshold: 0.7 },
      IMF: { minYear: 1980, maxYear: 2024, confidenceThreshold: 0.85 },
      WEF: { minYear: 2000, maxYear: 2024, confidenceThreshold: 0.85 },
      Gallup: { minYear: 2005, maxYear: 2024, confidenceThreshold: 0.8 },
      WVS: { minYear: 1981, maxYear: 2024, confidenceThreshold: 0.8 },
      Eurostat: { minYear: 1990, maxYear: 2024, confidenceThreshold: 0.9 },
      ESS: { minYear: 2002, maxYear: 2024, confidenceThreshold: 0.9 },
      EQLS: { minYear: 2003, maxYear: 2024, confidenceThreshold: 0.85 },
      WVS7: { minYear: 2017, maxYear: 2022, confidenceThreshold: 0.9 },
      ESS10: { minYear: 2020, maxYear: 2022, confidenceThreshold: 0.9 },
      WVS8: { minYear: 2018, maxYear: 2023, confidenceThreshold: 0.9 },
      ESS11: { minYear: 2021, maxYear: 2023, confidenceThreshold: 0.9 },
      WVS9: { minYear: 2019, maxYear: 2024, confidenceThreshold: 0.9 },
      ESS12: { minYear: 2022, maxYear: 2024, confidenceThreshold: 0.9 },
      WVS10: { minYear: 2020, maxYear: 2025, confidenceThreshold: 0.9 },
      ESS13: { minYear: 2023, maxYear: 2025, confidenceThreshold: 0.9 },
      WVS11: { minYear: 2021, maxYear: 2026, confidenceThreshold: 0.9 },
      ESS14: { minYear: 2024, maxYear: 2026, confidenceThreshold: 0.9 },
      WVS12: { minYear: 2022, maxYear: 2027, confidenceThreshold: 0.9 },
      ESS15: { minYear: 2025, maxYear: 2027, confidenceThreshold: 0.9 },
      WVS13: { minYear: 2023, maxYear: 2028, confidenceThreshold: 0.9 },
      ESS16: { minYear: 2026, maxYear: 2028, confidenceThreshold: 0.9 },
      WVS14: { minYear: 2024, maxYear: 2029, confidenceThreshold: 0.9 },
      ESS17: { minYear: 2027, maxYear: 2029, confidenceThreshold: 0.9 },
      WVS15: { minYear: 2025, maxYear: 2030, confidenceThreshold: 0.9 },
      ESS18: { minYear: 2028, maxYear: 2030, confidenceThreshold: 0.9 },
      WVS16: { minYear: 2026, maxYear: 2031, confidenceThreshold: 0.9 },
      ESS19: { minYear: 2029, maxYear: 2031, confidenceThreshold: 0.9 },
      WVS17: { minYear: 2027, maxYear: 2032, confidenceThreshold: 0.9 }
    };
  }

  public static getInstance(): DataSourceMarker {
    if (!DataSourceMarker.instance) {
      DataSourceMarker.instance = new DataSourceMarker();
    }
    return DataSourceMarker.instance;
  }

  public markData(source: DataSource, year: number, value: number): DataValidity {
    const config = this.sourceConfig[source];
    const isVerified = year >= config.minYear && year <= config.maxYear;
    const confidence = this.calculateConfidence(source, year, value);

    return {
      source,
      year,
      isVerified,
      confidence,
      notes: !isVerified ? `Data outside verified range (${config.minYear}-${config.maxYear})` : undefined
    };
  }

  private calculateConfidence(source: DataSource, year: number, value: number): number {
    const config = this.sourceConfig[source];
    const yearFactor = (year - config.minYear) / (config.maxYear - config.minYear);
    const baseConfidence = config.confidenceThreshold;
    
    // Adjust confidence based on year (more recent = higher confidence)
    return Math.min(1, baseConfidence + (yearFactor * 0.2));
  }
} 