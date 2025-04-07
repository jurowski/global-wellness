'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface DataSourceStatus {
  source: 'real' | 'mock' | 'unavailable';
  lastUpdated?: string;
}

interface MetricData {
  metric: string;
  country1Value: number;
  country2Value: number;
  difference: number;
  percentageDifference: number;
  isSignificant: boolean;
  dataSource: DataSourceStatus;
  year?: number;
}

const COMPARE_COUNTRIES = gql`
  query CompareCountries($countryCodes: [String!]!) {
    compareCountries(countryCodes: $countryCodes) {
      name
      countryCode
      region
      population
      happiness {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      healthcare {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      education {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      work_life {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      social_support {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
    }
  }
`;

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      countryCode
      region
      population
    }
  }
`;

const METRICS = [
  { id: 'happiness', label: 'Happiness' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'work_life', label: 'Work Life' },
  { id: 'social_support', label: 'Social Support' }
];

// Country name standardization mapping
const COUNTRY_NAME_MAPPING: { [key: string]: string } = {
  'United States of America': 'United States',
  'USA': 'United States',
  'US': 'United States',
  'UK': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'Republic of Korea': 'South Korea',
  'Korea, Republic of': 'South Korea',
  'Russian Federation': 'Russia',
  'UAE': 'United Arab Emirates',
  'Czechia': 'Czech Republic',
};

interface CountryComparisonProps {
  selectedMetrics?: string[];
  onCountryChange?: (country1: string, country2: string) => void;
}

const DataSourceIndicator = ({ metricData }: { metricData: any }) => {
  const getIndicatorColor = () => {
    if (!metricData) return 'text-gray-500';
    return metricData.isRealData ? 'text-green-500' : 'text-yellow-500';
  };

  const getIndicatorText = () => {
    if (!metricData) return 'Unknown';
    return metricData.isRealData ? 'Real Data' : 'Mock Data';
  };

  return (
    <div className="flex items-center gap-1">
      <span className={`text-sm ${getIndicatorColor()}`}>
        {getIndicatorText()}
      </span>
      {metricData?.year && (
        <span className="text-xs text-gray-400">
          (Year: {metricData.year})
        </span>
      )}
    </div>
  );
};

const getMetricColor = (metric: string): string => {
  switch (metric) {
    case 'happiness': return '#4CAF50';
    case 'healthcare': return '#2196F3';
    case 'education': return '#FFC107';
    case 'work_life': return '#9C27B0';
    case 'social_support': return '#FF5722';
    default: return '#607D8B';
  }
};

export default function CountryComparison({ selectedMetrics = ['happiness', 'healthcare', 'education', 'work_life'], onCountryChange }: CountryComparisonProps) {
  const [country1, setCountry1] = useState('US');
  const [country2, setCountry2] = useState('FI');
  const [year, setYear] = useState(2023);

  const { data: countriesData } = useQuery(GET_COUNTRIES);
  const { data: comparisonData, error } = useQuery(COMPARE_COUNTRIES, {
    variables: {
      countryCodes: [country1, country2]
    },
    skip: !country1 || !country2,
    onError: (error) => {
      console.error('GraphQL Error:', error);
      console.error('Request Variables:', {
        country1,
        country2
      });
    },
    onCompleted: (data) => {
      console.log('GraphQL Response:', data);
    }
  });

  const standardizeCountryName = (name: string) => {
    return COUNTRY_NAME_MAPPING[name] || name;
  };

  const handleCountry1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = (e.target as HTMLSelectElement).value;
    setCountry1(newCountry);
    onCountryChange?.(newCountry, country2);
  };

  const handleCountry2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = (e.target as HTMLSelectElement).value;
    setCountry2(newCountry);
    onCountryChange?.(country1, newCountry);
  };

  const chartData = comparisonData?.compareCountries?.map((country: any) => {
    const data: any = {};
    selectedMetrics.forEach(metric => {
      const metricData = country[metric];
      if (metricData) {
        data[metric] = metricData.value;
        data[`${metric}Data`] = metricData;
      }
    });
    return {
      name: country.name,
      ...data
    };
  }) || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Country</label>
          <select
            value={country1}
            onChange={handleCountry1Change}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            {countriesData?.countries?.map((country: any) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Second Country</label>
          <select
            value={country2}
            onChange={handleCountry2Change}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            {countriesData?.countries?.map((country: any) => (
              <option key={country.countryCode} value={country.countryCode}>
                {country.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {error && (
        <div className="text-red-500">
          Error: {error.message}
        </div>
      )}

      {comparisonData && chartData.length > 0 && (
        <div className="space-y-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                {selectedMetrics.map(metric => (
                  <Bar
                    key={metric}
                    dataKey={metric}
                    fill={getMetricColor(metric)}
                    name={METRICS.find(m => m.id === metric)?.label || metric}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {chartData.map((item: any) => (
              <div key={item.name} className="p-4 bg-gray-800 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">{item.name}</h3>
                {selectedMetrics.map(metric => (
                  <div key={metric} className="mb-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium">
                        {METRICS.find(m => m.id === metric)?.label || metric}:
                      </span>
                      <span className="text-sm">{item[metric]}</span>
                    </div>
                    <DataSourceIndicator metricData={item[`${metric}Data`]} />
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 