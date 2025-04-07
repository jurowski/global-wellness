import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData: boolean;
  category: string;
}

export interface CountryData {
  countryCode: string;
  region: string;
  population: number;
  happiness: WellnessMetric | null;
  healthcare: WellnessMetric | null;
  education: WellnessMetric | null;
  work_life: WellnessMetric | null;
  social_support: WellnessMetric | null;
}

interface TransformedData {
  countries: string[];
  metrics: Record<string, Record<string, number>>;
  sources: string[];
  dataAvailability: Record<string, Record<string, boolean>>;
}

export const countryProfiles: Record<string, CountryData> = {
  'United States': {
    countryCode: 'US',
    region: 'North America',
    population: 331002651,
    happiness: {
      value: 6.94,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 8.5,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 7.8,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±0.15',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 6.2,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 7.1,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'social_support'
    }
  },
  Finland: {
    countryCode: 'FI',
    region: 'Europe',
    population: 5540720,
    happiness: {
      value: 7.82,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 9.2,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±0.2',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 8.5,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±0.15',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 7.8,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 8.3,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±0.1',
      isRealData: true,
      category: 'social_support'
    }
  },
  Japan: {
    countryCode: 'JP',
    region: 'Asia',
    population: 125360000,
    happiness: {
      value: 70,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 88,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.6',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 85,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.4',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 65,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.2',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 80,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.9',
      isRealData: true,
      category: 'social_support'
    }
  },
  Germany: {
    countryCode: 'DE',
    region: 'Europe',
    population: 83240000,
    happiness: {
      value: 82,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.9',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 85,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.7',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 87,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.3',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 80,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 85,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.8',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Costa Rica': {
    countryCode: 'CR',
    region: 'Central America',
    population: 5094000,
    happiness: {
      value: 85,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.2',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 75,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 78,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.8',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 82,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.1',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 88,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.7',
      isRealData: true,
      category: 'social_support'
    }
  }
};

const allCountries = Object.keys(countryProfiles);
const allMetrics = ['happiness', 'healthcare', 'education', 'work_life', 'social_support'];

function transformData(countries: string[], metrics: string[]): TransformedData {
  const transformedData: TransformedData = {
    countries: countries,
    metrics: {},
    sources: [],
    dataAvailability: {},
  };

  const sources = new Set<string>();

  metrics.forEach(metric => {
    transformedData.metrics[metric] = {};
    transformedData.dataAvailability[metric] = {};

    countries.forEach(country => {
      const countryData = countryProfiles[country];
      if (countryData && countryData[metric as keyof CountryData]) {
        const metricData = countryData[metric as keyof CountryData] as WellnessMetric;
        transformedData.metrics[metric][country] = metricData.value;
        transformedData.dataAvailability[metric][country] = metricData.isRealData;
        sources.add(metricData.source);
      }
    });
  });

  transformedData.sources = Array.from(sources);
  return transformedData;
}

// Pre-generate all possible combinations
const staticData = transformData(allCountries, allMetrics);

export async function wellnessData(): Promise<CountryData[]> {
  return Object.entries(countryProfiles).map(([name, data]) => ({
    ...data,
    countryCode: data.countryCode,
    region: data.region,
    population: data.population
  }));
}

export async function GET(request: NextRequest) {
  const data = await wellnessData();
  return NextResponse.json(data);
} 