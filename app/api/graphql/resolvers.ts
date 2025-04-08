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

const normalizeMetricValue = (metric: WellnessMetric | null, metricName: string): WellnessMetric | null => {
  if (!metric) return null;

  const normalizedMetric = { ...metric };
  
  // Check if the value is already in 0-10 scale (approximately)
  const isSmallScale = metric.value <= 10;
  
  // Convert to 0-10 scale if necessary
  if (!isSmallScale) {
    normalizedMetric.value = metric.value / 10;
  }
  
  return normalizedMetric;
};

export const resolvers = {
  Query: {
    countries: async () => {
      console.log('[countries resolver] Entering...');
      try {
        console.log('[countries resolver] Calling wellnessData()...');
        const data = await wellnessData();
        console.log(`[countries resolver] Received ${data?.length || 0} countries from wellnessData.`);
        
        if (!data || data.length === 0) {
          console.warn('[countries resolver] wellnessData returned empty or null data.');
          throw new Error('No country data available');
        }
        
        // Validate the data structure
        const validData = data.filter(country => {
          if (!country.countryCode) {
            console.warn(`[countries resolver] Invalid country data: missing countryCode`, country);
            return false;
          }
          return true;
        });
        
        if (validData.length === 0) {
          throw new Error('No valid country data available');
        }
        
        console.log('[countries resolver] Returning data.');
        return validData;
      } catch (error) {
        console.error('[countries resolver] Error:', error);
        throw new Error('Failed to fetch countries data');
      }
    },

    metrics: async () => {
      return ALL_METRICS;
    },

    wellnessData: async (_: any, { countries, metrics }: { countries?: string[]; metrics?: string[] }) => {
      try {
        const data = await wellnessData();
        let filteredData = data;

        if (countries && countries.length > 0) {
          filteredData = filteredData.filter(c => countries.includes(c.countryCode));
        }

        if (metrics && metrics.length > 0) {
          filteredData = filteredData.map(country => {
            const filteredCountry = { ...country };
            Object.keys(filteredCountry).forEach(key => {
              if (!metrics.includes(key) && key !== 'name' && key !== 'countryCode' && key !== 'region' && key !== 'population') {
                delete (filteredCountry as any)[key];
              }
            });
            return filteredCountry;
          });
        }

        return filteredData;
      } catch (error) {
        console.error('Error in wellnessData resolver:', error);
        throw error;
      }
    },

    compareCountries: async (_: any, { countryCodes }: { countryCodes: string[] }) => {
      try {
        console.log('[compareCountries] Fetching data for countries:', countryCodes);
        
        if (!countryCodes || countryCodes.length === 0) {
          throw new Error('No country codes provided');
        }
        
        // Get all countries from wellnessData
        const allCountries = await wellnessData();
        
        // Find countries by their country code or name (case-insensitive)
        const selectedCountries = countryCodes
          .map(code => {
            const normalizedCode = code.toLowerCase();
            const country = allCountries.find(c => 
              c.countryCode.toLowerCase() === normalizedCode || 
              c.name?.toLowerCase() === normalizedCode
            );
            
            if (!country) {
              console.error(`[compareCountries] Country not found for code: ${code}`);
              throw new Error(`Country not found: ${code}`);
            }
            
            return country;
          });
        
        if (selectedCountries.length === 0) {
          throw new Error('No matching countries found');
        }
        
        console.log('[compareCountries] Found countries:', selectedCountries.map(c => c.name));
        return selectedCountries;
      } catch (error) {
        console.error('[compareCountries] Error:', error);
        throw error;
      }
    },

    getTrends: async (_: any, { country, metric, years }: { country: string; metric: string; years: number }): Promise<WellnessMetric[]> => {
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
        const trendData: WellnessMetric[] = Array.from({ length: years }, (_, i) => ({
          value: metricData.value * (1 - (i * 0.05)), // Simulated trend
          year: metricData.year - i,
          source: metricData.source,
          confidenceInterval: metricData.confidenceInterval,
          isRealData: i === 0, // Only the current year is real data
          category: metric
        })).reverse();

        return trendData;
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
      return checkMetricAvailability(countries);
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