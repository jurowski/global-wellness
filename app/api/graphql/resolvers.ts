import { wellnessData, CountryData, countryProfiles } from '../../api/wellness-data/route';

const calculateTrend = (values: number[], years: number = 5): number[] => {
  if (values.length < years) return values;
  return values.slice(-years);
};

const calculateDifference = (value1: number, value2: number) => {
  const difference = value1 - value2;
  const percentageDifference = (difference / value2) * 100;
  return {
    difference,
    percentageDifference,
    significance: Math.abs(percentageDifference) > 10 ? 'significant' : 'insignificant'
  };
};

type MetricKey = 'happiness' | 'healthcare' | 'education' | 'work_life' | 'social_support';

interface RegionalData {
  sum: number;
  count: number;
}

export const resolvers = {
  Query: {
    countries: () => Object.keys(countryProfiles),
    metrics: () => ['happiness', 'healthcare', 'education', 'work_life', 'social_support'],
    wellnessData: (_: any, { countries, metrics }: { countries: string[], metrics: string[] }) => {
      if (!countries || !metrics) {
        return Object.values(countryProfiles);
      }
      
      return countries.map(country => {
        const countryData = countryProfiles[country];
        if (!countryData) return null;
        
        const result: any = {};
        metrics.forEach(metric => {
          if (countryData[metric as keyof typeof countryData]) {
            result[metric] = countryData[metric as keyof typeof countryData];
          }
        });
        return result;
      }).filter(Boolean);
    },
    compareCountries: async (_: any, { country1, country2, metrics }: { country1: string; country2: string; metrics: string[] }) => {
      const country1Data = countryProfiles[country1];
      const country2Data = countryProfiles[country2];

      if (!country1Data || !country2Data) {
        throw new Error('One or both countries not found');
      }

      return metrics.map(metric => {
        const country1Value = country1Data[metric as MetricKey]?.value || 0;
        const country2Value = country2Data[metric as MetricKey]?.value || 0;
        const difference = country1Value - country2Value;
        const percentageDifference = (difference / country2Value) * 100;

        return {
          metric,
          country1Value,
          country2Value,
          difference,
          percentageDifference,
          isSignificant: Math.abs(percentageDifference) > 10
        };
      });
    },
    getTrends: async (_: any, { country, metric, years }: { country: string; metric: string; years: number }) => {
      const data = await wellnessData();
      const countryData = data.find((d: CountryData) => d.countryCode === country);

      if (!countryData) {
        throw new Error('Country not found');
      }

      const metricData = countryData[metric as MetricKey];
      if (!metricData) {
        throw new Error('Metric not found');
      }

      return Array.from({ length: years }, (_, i) => ({
        year: new Date().getFullYear() - i,
        value: metricData.value * (1 - (i * 0.05)) // Simulated trend
      })).reverse();
    },
    getRegionalAverages: async (_: any, { metric }: { metric: string }) => {
      const data = await wellnessData();
      const regionalData = data.reduce((acc: Record<string, RegionalData>, country: CountryData) => {
        if (!acc[country.region]) {
          acc[country.region] = { sum: 0, count: 0 };
        }
        const value = country[metric as MetricKey]?.value;
        if (value) {
          acc[country.region].sum += value;
          acc[country.region].count += 1;
        }
        return acc;
      }, {});

      return Object.entries(regionalData).map(([region, { sum, count }]) => ({
        region,
        average: sum / count,
        sampleSize: count
      }));
    },
    searchCountries: async (_: any, { query }: { query: string }) => {
      const data = await wellnessData();
      const searchTerm = query.toLowerCase();
      return data.filter((country: CountryData) => 
        country.countryCode.toLowerCase().includes(searchTerm) ||
        country.region.toLowerCase().includes(searchTerm)
      );
    }
  },
  Mutation: {
    updateMetric: async (_: any, { country, metric, value, year, source, confidenceInterval }: 
      { country: string; metric: string; value: number; year: number; source: string; confidenceInterval: string }) => {
      const data = await wellnessData();
      const countryData = data.find((d: CountryData) => d.countryCode === country);
      
      if (!countryData) {
        throw new Error('Country not found');
      }

      const updatedMetric = {
        value,
        year,
        source,
        confidenceInterval,
        isRealData: true,
        category: metric
      };

      countryData[metric as MetricKey] = updatedMetric;
      return updatedMetric;
    },
    addCountry: async (_: any, { name, code, region, population }: 
      { name: string; code: string; region: string; population: number }) => {
      const data = await wellnessData();
      if (data.find((d: CountryData) => d.countryCode === code)) {
        throw new Error('Country already exists');
      }

      const newCountry: CountryData = {
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
    }
  }
}; 