import { wellnessData, CountryData as ImportedCountryData, countryProfiles } from '../wellness-data/route';

const calculateTrend = (values: number[], years: number = 5): number[] => {
  if (values.length < years) return values;
  return values.slice(-years);
};

const calculateDifference = (value1: number, value2: number) => {
  // Handle NaN or undefined values
  if (isNaN(value1) || isNaN(value2) || value1 === undefined || value2 === undefined) {
    return {
      difference: 0,
      percentageDifference: 0,
      significance: 'insignificant'
    };
  }

  const difference = value1 - value2;
  // Avoid division by zero
  const percentageDifference = value2 !== 0 ? (difference / value2) * 100 : 0;
  return {
    difference,
    percentageDifference,
    significance: Math.abs(percentageDifference) > 10 ? 'significant' : 'insignificant'
  };
};

const ALL_METRICS = [
  'happiness',
  'healthcare',
  'education',
  'work_life',
  'social_support'
] as const;

type MetricKey = typeof ALL_METRICS[number];

interface RegionalData {
  sum: number;
  count: number;
}

interface MetricAvailability {
  metric: string;
  isAvailable: boolean;
  source: 'real' | 'mock' | 'unavailable';
  lastUpdated?: string;
}

interface WellnessMetric {
  value: number;
  year: number;
  source: string;
  confidenceInterval: string;
  isRealData: boolean;
  category: string;
}

type CountryData = ImportedCountryData;

const getDataSourceStatus = (metric: string, countryData: any): { source: 'real' | 'mock' | 'unavailable', lastUpdated?: string } => {
  const metricData = countryData[metric as MetricKey];
  if (!metricData) {
    return { source: 'unavailable' };
  }
  
  if (metricData.isRealData) {
    return {
      source: 'real',
      lastUpdated: new Date().toISOString()
    };
  }
  
  return { source: 'mock' };
};

const checkMetricAvailability = (countries: string[]): MetricAvailability[] => {
  return ALL_METRICS.map(metric => {
    let isAvailable = false;
    let source: 'real' | 'mock' | 'unavailable' = 'unavailable';
    let lastUpdated: string | undefined;

    // Check each country for the metric
    for (const country of countries) {
      const countryData = countryProfiles[country];
      if (!countryData) continue;

      const metricData = countryData[metric as keyof CountryData];
      if (metricData && typeof metricData === 'object' && 'isRealData' in metricData) {
        isAvailable = true;
        if (metricData.isRealData) {
          source = 'real';
          lastUpdated = new Date().toISOString();
          break; // Found real data, no need to check other countries
        } else {
          source = 'mock';
        }
      }
    }

    return {
      metric,
      isAvailable,
      source,
      lastUpdated
    };
  });
};

const isWellnessMetric = (value: any): value is WellnessMetric => {
  return value && typeof value === 'object' && 'value' in value;
};

export const resolvers = {
  Query: {
    countries: async () => {
      try {
        const data = await wellnessData();
        return data;
      } catch (error) {
        console.error('Error in countries resolver:', error);
        throw new Error('Failed to fetch countries data');
      }
    },

    metrics: async () => {
      return ALL_METRICS;
    },

    wellnessData: async (_: any, { countryCode }: { countryCode: string }) => {
      try {
        const data = await wellnessData();
        const country = data.find(c => c.countryCode === countryCode);
        
        if (!country) {
          throw new Error(`Country with code ${countryCode} not found`);
        }

        return country;
      } catch (error) {
        console.error('Error in wellnessData resolver:', error);
        throw error;
      }
    },

    compareCountries: async (_: any, { countryCodes }: { countryCodes: string[] }) => {
      try {
        const data = await wellnessData();
        const countries = data.filter(c => countryCodes.includes(c.countryCode));
        
        if (countries.length !== countryCodes.length) {
          const foundCodes = countries.map(c => c.countryCode);
          const missingCodes = countryCodes.filter(code => !foundCodes.includes(code));
          throw new Error(`Countries not found: ${missingCodes.join(', ')}`);
        }

        return countries;
      } catch (error) {
        console.error('Error in compareCountries resolver:', error);
        throw error;
      }
    },

    getTrends: async (_: any, { country, metric, years }: { country: string; metric: string; years: number }) => {
      try {
        const data = await wellnessData();
        const countryData = data.find(d => d.countryCode === country);

        if (!countryData) {
          throw new Error('Country not found');
        }

        const metricData = countryData[metric as keyof CountryData];
        if (!isWellnessMetric(metricData)) {
          throw new Error('Metric not found or invalid');
        }

        // Generate trend data based on the current value
        return Array.from({ length: years }, (_, i) => ({
          value: metricData.value * (1 - (i * 0.05)), // Simulated trend
          year: metricData.year - i,
          source: metricData.source,
          confidenceInterval: metricData.confidenceInterval,
          isRealData: i === 0, // Only the current year is real data
          category: metric
        })).reverse();
      } catch (error) {
        console.error('Error in getTrends resolver:', error);
        throw error;
      }
    },

    getRegionalAverages: async (_: any, { metric }: { metric: string }) => {
      try {
        const data = await wellnessData();
        const regions = new Map<string, { sum: number; count: number }>();

        data.forEach(country => {
          const metricData = country[metric as keyof CountryData];
          if (isWellnessMetric(metricData)) {
            const regionData = regions.get(country.region) || { sum: 0, count: 0 };
            regionData.sum += metricData.value;
            regionData.count += 1;
            regions.set(country.region, regionData);
          }
        });

        return Array.from(regions.entries()).map(([region, { sum, count }]) => ({
          region,
          value: sum / count,
          year: new Date().getFullYear(),
          source: 'Aggregated Data',
          confidenceInterval: '±1.0',
          isRealData: true
        }));
      } catch (error) {
        console.error('Error in getRegionalAverages resolver:', error);
        throw error;
      }
    },

    searchCountries: async (_: any, { query }: { query: string }) => {
      try {
        const data = await wellnessData();
        const searchTerm = query.toLowerCase();
        return data.filter(country => 
          (country.name?.toLowerCase().includes(searchTerm) || false) ||
          country.countryCode.toLowerCase().includes(searchTerm) ||
          country.region.toLowerCase().includes(searchTerm)
        );
      } catch (error) {
        console.error('Error in searchCountries resolver:', error);
        throw error;
      }
    },

    availableMetrics: (_: any, { countries }: { countries: string[] }) => {
      return ALL_METRICS;
    }
  },

  Mutation: {
    updateMetric: async (_: any, { country, metric, value, year, source, confidenceInterval }: 
      { country: string; metric: string; value: number; year: number; source: string; confidenceInterval: string }) => {
      try {
        const data = await wellnessData();
        const countryData = data.find(d => d.countryCode === country);
        
        if (!countryData) {
          throw new Error('Country not found');
        }

        if (!ALL_METRICS.includes(metric as MetricKey)) {
          throw new Error('Invalid metric');
        }

        const updatedMetric: WellnessMetric = {
          value,
          year,
          source,
          confidenceInterval,
          isRealData: true,
          category: metric
        };

        (countryData as any)[metric] = updatedMetric;
        return updatedMetric;
      } catch (error) {
        console.error('Error in updateMetric resolver:', error);
        throw error;
      }
    },

    addCountry: async (_: any, { name, code, region, population }: 
      { name: string; code: string; region: string; population: number }) => {
      try {
        const data = await wellnessData();
        if (data.find(d => d.countryCode === code)) {
          throw new Error('Country already exists');
        }

        const newCountry: CountryData = {
          name,
          countryCode: code,
          region,
          population,
          happiness: null,
          healthcare: null,
          education: null,
          work_life: null,
          social_support: null
        };

        countryProfiles[name] = newCountry;
        return newCountry;
      } catch (error) {
        console.error('Error in addCountry resolver:', error);
        throw error;
      }
    }
  }
}; 