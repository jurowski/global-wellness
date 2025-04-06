import { NextRequest, NextResponse } from 'next/server';

interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData?: boolean;
}

interface CountryData {
  happiness: WellnessMetric;
  healthcare: WellnessMetric;
  education: WellnessMetric;
  work_life: WellnessMetric;
  social_support: WellnessMetric;
}

interface TransformedData {
  countries: string[];
  metrics: Record<string, Record<string, number>>;
  sources: string[];
  dataAvailability: Record<string, Record<string, boolean>>;
}

const countryProfiles: Record<string, CountryData> = {
  'United States': {
    happiness: {
      value: 75,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.1',
      isRealData: true
    },
    healthcare: {
      value: 82,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.8',
      isRealData: true
    },
    education: {
      value: 88,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.5',
      isRealData: true
    },
    work_life: {
      value: 70,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.3',
      isRealData: true
    },
    social_support: {
      value: 78,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±2.0',
      isRealData: false
    },
  },
  Finland: {
    happiness: {
      value: 92,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.8',
    },
    healthcare: {
      value: 90,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.5',
    },
    education: {
      value: 95,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.2',
    },
    work_life: {
      value: 88,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±1.7',
    },
    social_support: {
      value: 94,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.4',
    },
  },
  Japan: {
    happiness: {
      value: 70,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.0',
    },
    healthcare: {
      value: 88,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.6',
    },
    education: {
      value: 85,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.4',
    },
    work_life: {
      value: 65,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.2',
    },
    social_support: {
      value: 80,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.9',
    },
  },
  Germany: {
    happiness: {
      value: 82,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±1.9',
    },
    healthcare: {
      value: 85,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.7',
    },
    education: {
      value: 87,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.3',
    },
    work_life: {
      value: 80,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.0',
    },
    social_support: {
      value: 85,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.8',
    },
  },
  'Costa Rica': {
    happiness: {
      value: 85,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.2',
    },
    healthcare: {
      value: 75,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±2.0',
    },
    education: {
      value: 78,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.8',
    },
    work_life: {
      value: 82,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.1',
    },
    social_support: {
      value: 88,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±1.7',
    },
  },
};

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const requestedCountries = searchParams.get('countries')?.split(',').map(country => {
      return country === 'USA' ? 'United States' : country;
    }) || [];
    const requestedMetrics = searchParams.get('metrics')?.split(',') || [];

    // Filter countries based on request
    const countries = requestedCountries.length > 0 
      ? requestedCountries.filter(c => countryProfiles[c])
      : Object.keys(countryProfiles);

    // Transform the data structure to match what the components expect
    const transformedData: TransformedData = {
      countries: countries,
      metrics: {},
      sources: ['World Happiness Report', 'WHO', 'UNESCO', 'OECD', 'Gallup'],
      dataAvailability: {}
    };

    // Initialize metrics structure
    const allMetrics = ['happiness', 'healthcare', 'education', 'work_life', 'social_support'];
    const metrics = requestedMetrics.length > 0
      ? requestedMetrics.filter(m => allMetrics.includes(m))
      : allMetrics;

    // Populate metrics data and data availability
    metrics.forEach(metric => {
      transformedData.metrics[metric] = {};
      transformedData.dataAvailability[metric] = {};
      
      countries.forEach(country => {
        if (countryProfiles[country] && countryProfiles[country][metric as keyof CountryData]) {
          const metricData = countryProfiles[country][metric as keyof CountryData];
          transformedData.metrics[metric][country] = metricData.value;
          transformedData.dataAvailability[metric][country] = metricData.isRealData || false;
        }
      });
    });

    return NextResponse.json(transformedData);
  } catch (error) {
    console.error('Error fetching wellness data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wellness data' },
      { status: 500 }
    );
  }
} 