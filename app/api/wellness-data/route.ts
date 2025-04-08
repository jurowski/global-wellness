import { NextRequest, NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';
export const revalidate = 3600; // Revalidate every hour

export interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData: boolean;
  category: string;
}

export interface CountryData {
  name?: string;
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
    name: 'United States',
    countryCode: 'US',
    region: 'North America',
    population: 331002651,
    happiness: {
      value: 75.5,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 85,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 80,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 70,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 75,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Finland': {
    name: 'Finland',
    countryCode: 'FI',
    region: 'Europe',
    population: 5530719,
    happiness: {
      value: 75.9,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 90,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 85,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 78,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 83,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Denmark': {
    countryCode: 'DK',
    region: 'Europe',
    population: 5857000,
    happiness: {
      value: 75.8,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 90,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 83,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 76,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 82,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Iceland': {
    countryCode: 'IS',
    region: 'Europe',
    population: 364134,
    happiness: {
      value: 75.2,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 89,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 82,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 75,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 81,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Israel': {
    countryCode: 'IL',
    region: 'Middle East',
    population: 9291000,
    happiness: {
      value: 73.4,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 86,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 80,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 72,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 78,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Netherlands': {
    countryCode: 'NL',
    region: 'Europe',
    population: 17441139,
    happiness: {
      value: 73.2,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 88,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 81,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 74,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 79,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Sweden': {
    countryCode: 'SE',
    region: 'Europe',
    population: 10402070,
    happiness: {
      value: 73.4,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 87,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 82,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 75,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 80,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Norway': {
    countryCode: 'NO',
    region: 'Europe',
    population: 5408320,
    happiness: {
      value: 73.0,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 89,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 83,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 76,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 81,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Switzerland': {
    countryCode: 'CH',
    region: 'Europe',
    population: 8703000,
    happiness: {
      value: 72.9,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 91,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 84,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 77,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 82,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Luxembourg': {
    countryCode: 'LU',
    region: 'Europe',
    population: 632000,
    happiness: {
      value: 72.6,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 88,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 81,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 73,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 78,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'New Zealand': {
    countryCode: 'NZ',
    region: 'Oceania',
    population: 5122600,
    happiness: {
      value: 72.4,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 87,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 82,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 74,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 79,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Austria': {
    countryCode: 'AT',
    region: 'Europe',
    population: 9027999,
    happiness: {
      value: 72.3,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 86,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 80,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 73,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 78,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Australia': {
    countryCode: 'AU',
    region: 'Oceania',
    population: 25690000,
    happiness: {
      value: 72.2,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 88,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 83,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 75,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 80,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Canada': {
    countryCode: 'CA',
    region: 'North America',
    population: 38250000,
    happiness: {
      value: 72.1,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 87,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 82,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 74,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 79,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'social_support'
    }
  },
  'Ireland': {
    countryCode: 'IE',
    region: 'Europe',
    population: 5033000,
    happiness: {
      value: 72.0,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'happiness'
    },
    healthcare: {
      value: 85,
      year: 2023,
      source: 'WHO',
      confidenceInterval: '±2.0',
      isRealData: true,
      category: 'healthcare'
    },
    education: {
      value: 80,
      year: 2023,
      source: 'UNESCO',
      confidenceInterval: '±1.5',
      isRealData: true,
      category: 'education'
    },
    work_life: {
      value: 72,
      year: 2023,
      source: 'OECD',
      confidenceInterval: '±1.0',
      isRealData: true,
      category: 'work_life'
    },
    social_support: {
      value: 77,
      year: 2023,
      source: 'Gallup',
      confidenceInterval: '±1.0',
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

function normalizeValue(value: number): number {
  // If value is already in 0-10 scale (approximately)
  if (value <= 10) {
    return value;
  }
  // Convert from 0-100 scale to 0-10 scale
  return value / 10;
}

export async function wellnessData(): Promise<CountryData[]> {
  try {
    console.log('Fetching wellness data...');
    
    // Convert the countryProfiles object into an array of country data
    const countries = Object.entries(countryProfiles).map(([name, profile]) => ({
      ...profile,
      name: profile.name || name // Ensure name is set from the key if not already present
    }));
    
    if (!countries || countries.length === 0) {
      console.error('No country data found');
      throw new Error('No country data available');
    }
    
    console.log(`Found ${countries.length} countries`);
    
    // Validate the data structure
    countries.forEach(country => {
      if (!country.countryCode) {
        console.error('Invalid country data: missing countryCode', country);
        throw new Error('Invalid country data structure');
      }
      
      // Ensure all metrics are properly structured
      ['happiness', 'healthcare', 'education', 'work_life', 'social_support'].forEach(metric => {
        const metricData = country[metric as keyof CountryData];
        if (metricData && typeof metricData === 'object') {
          if (!('value' in metricData) || !('year' in metricData)) {
            console.error(`Invalid metric data for ${metric} in ${country.countryCode}:`, metricData);
            throw new Error(`Invalid metric data structure for ${metric}`);
          }
        }
      });
    });
    
    return countries;
  } catch (error) {
    console.error('Error in wellnessData:', error);
    throw new Error('Failed to fetch wellness data');
  }
}

export async function GET(request: NextRequest) {
  try {
    const data = await wellnessData();
    return NextResponse.json(data);
  } catch (error) {
    console.error('Error in wellness data API:', error);
    return NextResponse.json(
      { error: 'Failed to load wellness data' },
      { status: 500 }
    );
  }
} 