'use client';

import * as React from 'react';
import { useState, useEffect } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LabelList
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

// Update the country code mapping to include all necessary mappings
const COUNTRY_CODE_MAPPING: { [key: string]: string } = {
  'United States': 'US',
  'Finland': 'FI',
  'Japan': 'JP',
  'Germany': 'DE',
  'Costa Rica': 'CR',
  'Canada': 'CA',
  'Denmark': 'DK',
  'Norway': 'NO',
  'Sweden': 'SE',
  'United Kingdom': 'GB',
  'Netherlands': 'NL',
  'Switzerland': 'CH',
  'New Zealand': 'NZ'
};

// Add reverse mapping for country codes to names
const COUNTRY_NAME_MAPPING: { [key: string]: string } = Object.entries(COUNTRY_CODE_MAPPING).reduce((acc, [name, code]) => {
  acc[code] = name;
  return acc;
}, {} as { [key: string]: string });

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
  const [country1, setCountry1] = useState<string>('');
  const [country2, setCountry2] = useState<string>('');
  const [year, setYear] = useState(2023);

  const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(GET_COUNTRIES);
  
  // Set initial countries once data is loaded
  useEffect(() => {
    if (!country1 && !country2 && countriesData?.countries?.length > 0) {
      const usCountry = countriesData.countries.find((c: any) => c.countryCode === 'US');
      const fiCountry = countriesData.countries.find((c: any) => c.countryCode === 'FI');
      
      if (usCountry && fiCountry) {
        console.log('Setting initial countries:', usCountry.name, fiCountry.name);
        setCountry1(usCountry.name);
        setCountry2(fiCountry.name);
      } else {
        console.warn('Could not find US or FI in country data');
      }
    }
  }, [countriesData, country1, country2]);

  const { data: comparisonData, loading: comparisonLoading, error: comparisonError } = useQuery(COMPARE_COUNTRIES, {
    variables: {
      countryCodes: [
        COUNTRY_CODE_MAPPING[country1] || country1,
        COUNTRY_CODE_MAPPING[country2] || country2
      ].filter(Boolean)
    },
    skip: !country1 || !country2 || countriesLoading,
    onError: (error) => {
      console.error('GraphQL Error:', error);
      console.log('Request variables:', {
        country1,
        country2,
        codes: [
          COUNTRY_CODE_MAPPING[country1] || country1,
          COUNTRY_CODE_MAPPING[country2] || country2
        ]
      });
    }
  });

  // Log available country options for debugging
  useEffect(() => {
    if (countriesData?.countries) {
      console.log('Available country options:', countriesData.countries);
    }
  }, [countriesData]);

  const standardizeCountryName = (name: string) => {
    return COUNTRY_NAME_MAPPING[name] || name;
  };

  const handleCountry1Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry1(newCountry);
    onCountryChange?.(newCountry, country2);
  };

  const handleCountry2Change = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCountry = e.target.value;
    setCountry2(newCountry);
    onCountryChange?.(country1, newCountry);
  };

  const chartData = comparisonData?.compareCountries?.map((country: any) => {
    const data: any = {};
    selectedMetrics.forEach(metric => {
      const metricData = country[metric];
      if (metricData) {
        // Values are now normalized to 0-10 scale, multiply by 10 for better visualization
        data[metric] = metricData.value * 10;
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
          {countriesLoading ? (
            <div className="w-full p-2 rounded bg-gray-800 border border-gray-700">Loading countries...</div>
          ) : (
            <select
              value={country1}
              onChange={handleCountry1Change}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            >
              {countriesData?.countries?.map((country: any) => (
                <option key={country.countryCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Second Country</label>
          {countriesLoading ? (
            <div className="w-full p-2 rounded bg-gray-800 border border-gray-700">Loading countries...</div>
          ) : (
            <select
              value={country2}
              onChange={handleCountry2Change}
              className="w-full p-2 rounded bg-gray-800 border border-gray-700"
            >
              {countriesData?.countries?.map((country: any) => (
                <option key={country.countryCode} value={country.name}>
                  {country.name}
                </option>
              ))}
            </select>
          )}
        </div>
      </div>

      {comparisonError && (
        <div className="text-red-500">
          Error: {comparisonError.message}
        </div>
      )}

      {comparisonData && chartData.length > 0 && (
        <div className="space-y-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis domain={[0, 100]} />
                <Tooltip 
                  formatter={(value: number) => (value / 10).toFixed(1)} 
                  labelFormatter={(label: string) => `Country: ${label}`}
                />
                <Legend />
                {selectedMetrics.map(metric => (
                  <Bar
                    key={metric}
                    dataKey={metric}
                    fill={getMetricColor(metric)}
                    name={METRICS.find(m => m.id === metric)?.label || metric}
                    radius={[4, 4, 0, 0]}
                    label={{
                      position: 'top',
                      content: (props: any) => {
                        const { x, y, width, height, value } = props;
                        const valueText = (value / 10).toFixed(1);
                        const availableWidth = width - 4;
                        const characterCount = valueText.length;
                        const baseFontSize = 44;
                        const calculatedFontSize = Math.min(
                          baseFontSize,
                          availableWidth / (characterCount * 0.6)
                        );
                        return (
                          <text
                            x={x + width / 2}
                            y={y - 17}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.5)"
                            fontWeight="bold"
                            fontSize={calculatedFontSize}
                            stroke="rgba(0, 0, 0, 0.5)"
                            strokeWidth="0.75"
                          >
                            {valueText}
                          </text>
                        );
                      }
                    }}
                  >
                    <LabelList
                      dataKey={metric}
                      position="center"
                      content={(props: any) => {
                        const { x, y, width, height, value } = props;
                        if (height < 50) return null;
                        const baseFontSize = 120;
                        const metricsScaleFactor = Math.max(1.5, 3 - (selectedMetrics.length * 0.2));
                        const stateCount = chartData.length; 
                        const stateScaleFactor = stateCount <= 2 ? 1.0 : 
                                                stateCount <= 4 ? 1.5 : 1.0;
                        const multiMetricScaleFactor = (selectedMetrics.length >= 3 && selectedMetrics.length <= 5) ? 3.0 : 1.0;
                        const scaledBaseFontSize = baseFontSize * metricsScaleFactor * stateScaleFactor * multiMetricScaleFactor;
                        const availableWidth = width * 0.85;
                        const labelLength = METRICS.find(m => m.id === metric)?.label.length || 0;
                        const calculatedFontSize = Math.min(
                          scaledBaseFontSize,
                          availableWidth / (labelLength * 0.45),
                          height / (labelLength * 0.6)
                        );
                        const padding = selectedMetrics.length === 1 ? 10 : 2;
                        const adjustedWidth = width - (2 * padding);
                        const adjustedFontSize = Math.min(
                          calculatedFontSize,
                          adjustedWidth / (labelLength * 0.45)
                        );
                        return (
                          <text
                            x={x + width / 2}
                            y={y + height / 2}
                            textAnchor="middle"
                            dominantBaseline="middle"
                            fill="rgba(255, 255, 255, 0.9)"
                            fontSize={adjustedFontSize}
                            fontWeight="bold"
                            transform={`rotate(-90, ${x + width / 2}, ${y + height / 2})`}
                          >
                            {METRICS.find(m => m.id === metric)?.label}
                          </text>
                        );
                      }}
                    />
                  </Bar>
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
                      <span className="text-sm">
                        {(item[metric] / 10).toFixed(1)}
                      </span>
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