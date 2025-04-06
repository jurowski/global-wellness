import { NextResponse } from 'next/server';

interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
}

interface CountryData {
  happiness: WellnessMetric;
  healthcare: WellnessMetric;
  education: WellnessMetric;
  work_life: WellnessMetric;
  social_support: WellnessMetric;
}

const generateHistoricalData = (baseValue: number, startYear: number = 2010): WellnessMetric[] => {
  const currentYear = new Date().getFullYear();
  return Array.from({ length: currentYear - startYear + 1 }, (_, index) => {
    const year = startYear + index;
    const trend = Math.sin((year - startYear) * 0.5) * 5; // Creates a wave pattern
    const randomVariation = (Math.random() - 0.5) * 3; // Adds some randomness
    const value = Math.min(100, Math.max(0, baseValue + trend + randomVariation));
    
    return {
      value,
      year,
      source: 'Global Wellness Database',
      confidenceInterval: '±2.5',
    };
  });
};

const countryProfiles: Record<string, CountryData> = {
  USA: {
    happiness: {
      value: 75,
      year: 2023,
      source: 'World Happiness Report',
      confidenceInterval: '±2.1',
    },
    healthcare: {
      value: 82,
      year: 2023,
      source: 'WHO Global Health Observatory',
      confidenceInterval: '±1.8',
    },
    education: {
      value: 88,
      year: 2023,
      source: 'UNESCO Institute for Statistics',
      confidenceInterval: '±1.5',
    },
    work_life: {
      value: 70,
      year: 2023,
      source: 'OECD Better Life Index',
      confidenceInterval: '±2.3',
    },
    social_support: {
      value: 78,
      year: 2023,
      source: 'Gallup World Poll',
      confidenceInterval: '±2.0',
    },
  },
  FIN: {
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
  // Add more countries with their data...
};

// Generate historical data for each country and metric
Object.keys(countryProfiles).forEach(country => {
  Object.keys(countryProfiles[country]).forEach(metric => {
    const baseValue = countryProfiles[country][metric as keyof CountryData].value;
    const historicalData = generateHistoricalData(baseValue);
    countryProfiles[country][metric as keyof CountryData] = historicalData[historicalData.length - 1];
  });
});

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const countries = searchParams.get('countries')?.split(',') || Object.keys(countryProfiles);
  const metrics = searchParams.get('metrics')?.split(',') || ['happiness', 'healthcare', 'education', 'work_life', 'social_support'];
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString());

  const filteredData = countries
    .filter(country => countryProfiles[country])
    .map(country => {
      const countryMetrics = metrics.reduce((acc, metric) => {
        if (countryProfiles[country][metric as keyof CountryData]) {
          acc[metric] = countryProfiles[country][metric as keyof CountryData].value;
        }
        return acc;
      }, {} as Record<string, number>);

      return {
        country,
        metrics: countryMetrics,
        year,
      };
    });

  return NextResponse.json(filteredData);
} 