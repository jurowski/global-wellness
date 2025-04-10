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

type SelectorMode = 'normal' | 'tiles' | 'mini' | 'dropdown';

export default function SelectorCountryComparison({ selectedMetrics = ['happiness', 'healthcare', 'education', 'work_life'], onCountryChange }: CountryComparisonProps) {
  const [country1, setCountry1] = useState<string>('');
  const [country2, setCountry2] = useState<string>('');
  const [year, setYear] = useState(2023);
  const [selectedCountries, setSelectedCountries] = useState<string[]>([]);
  const [selectorMode, setSelectorMode] = useState<SelectorMode>('normal');
  const [countriesWithErrors, setCountriesWithErrors] = useState<string[]>([]);
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(5).fill(''));

  const { data: countriesData, loading: countriesLoading, error: countriesError } = useQuery(GET_COUNTRIES);
  
  // Set initial countries once data is loaded
  useEffect(() => {
    if (!country1 && !country2 && countriesData?.countries?.length > 0) {
      const usCountry = countriesData.countries.find((c: any) => c.countryCode === 'US');
      const fiCountry = countriesData.countries.find((c: any) => c.countryCode === 'FI');
      
      if (usCountry && fiCountry) {
        setCountry1(usCountry.name);
        setCountry2(fiCountry.name);
        setSelectedCountries(['US', 'FI']);
        
        // Initialize dropdown values
        const newDropdownValues = [...dropdownValues];
        newDropdownValues[0] = 'US';
        newDropdownValues[1] = 'FI';
        setDropdownValues(newDropdownValues);
      } else {
        console.warn('Could not find US or FI in country data');
      }
    }
  }, [countriesData, country1, country2, dropdownValues]);

  // Define query variables based on the selector mode
  const countryCodes = selectorMode === 'normal'
    ? [COUNTRY_CODE_MAPPING[country1] || country1, COUNTRY_CODE_MAPPING[country2] || country2].filter(Boolean)
    : selectedCountries;

  const { data: comparisonData, loading: comparisonLoading, error: comparisonError } = useQuery(COMPARE_COUNTRIES, {
    variables: {
      countryCodes: countryCodes
    },
    skip: (selectorMode === 'normal' ? (!country1 || !country2) : selectedCountries.length === 0) || countriesLoading,
    onError: (error) => {
      console.error('GraphQL Error:', error);
    }
  });

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

  // Sync selected countries with dropdown values
  useEffect(() => {
    if (selectorMode !== 'normal') {
      // Create a new array with the current dropdown values
      const newDropdownValues = [...dropdownValues];
      let shouldUpdate = false;
      
      // First, clear any dropdown values that are no longer in selectedCountries
      for (let i = 0; i < newDropdownValues.length; i++) {
        if (newDropdownValues[i] && !selectedCountries.includes(newDropdownValues[i])) {
          newDropdownValues[i] = '';
          shouldUpdate = true;
        }
      }
      
      // Then, make sure each selected country is represented in a dropdown
      for (const countryCode of selectedCountries) {
        // If this country isn't already in a dropdown, find an empty slot
        if (!newDropdownValues.includes(countryCode)) {
          // Find the first empty slot
          const emptySlot = newDropdownValues.findIndex(val => val === '');
          if (emptySlot !== -1) {
            newDropdownValues[emptySlot] = countryCode;
            shouldUpdate = true;
          }
        }
      }
      
      // Only update if changes are needed to prevent infinite loop
      if (shouldUpdate) {
        setDropdownValues(newDropdownValues);
      }
    }
  }, [selectedCountries, selectorMode, dropdownValues]);

  const handleCountrySelect = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(code => code !== countryCode));
      setCountriesWithErrors(countriesWithErrors.filter(code => code !== countryCode));
    } else if (selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const handleDropdownChange = (index: number, countryCode: string) => {
    // If selecting an empty option
    if (countryCode === '') {
      // If there was a previous value, remove it from selected countries
      if (dropdownValues[index] !== '') {
        setSelectedCountries(selectedCountries.filter(code => code !== dropdownValues[index]));
        setCountriesWithErrors(countriesWithErrors.filter(code => code !== dropdownValues[index]));
      }
      
      // Update dropdown value
      const newDropdownValues = [...dropdownValues];
      newDropdownValues[index] = '';
      setDropdownValues(newDropdownValues);
      return;
    }
    
    // If selecting a country that's already selected in another dropdown
    if (selectedCountries.includes(countryCode)) {
      // Find which dropdown has this country
      const existingIndex = dropdownValues.findIndex(val => val === countryCode);
      if (existingIndex !== -1 && existingIndex !== index) {
        // Clear the other dropdown
        const newDropdownValues = [...dropdownValues];
        newDropdownValues[existingIndex] = '';
        newDropdownValues[index] = countryCode;
        setDropdownValues(newDropdownValues);
      }
      return;
    }
    
    // If there was a previous selection in this dropdown, remove it
    if (dropdownValues[index] !== '') {
      setSelectedCountries(selectedCountries.filter(code => code !== dropdownValues[index]));
      setCountriesWithErrors(countriesWithErrors.filter(code => code !== dropdownValues[index]));
    }
    
    // Add the new country
    if (selectedCountries.length < 5) {
      setSelectedCountries([...selectedCountries, countryCode]);
      
      // Update dropdown value
      const newDropdownValues = [...dropdownValues];
      newDropdownValues[index] = countryCode;
      setDropdownValues(newDropdownValues);
    }
  };

  const getCountryStatus = (countryCode: string) => {
    if (countriesWithErrors.includes(countryCode)) {
      return 'error';
    }
    if (selectedCountries.includes(countryCode)) {
      return 'selected';
    }
    return 'default';
  };

  const regionColors = {
    'Europe': 'border-blue-400',
    'Asia': 'border-green-400',
    'North America': 'border-orange-400',
    'South America': 'border-purple-400',
    'Africa': 'border-yellow-400',
    'Oceania': 'border-pink-400'
  };

  return (
    <div className="space-y-8">
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          className={`py-2 px-4 ${selectorMode === 'normal' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('normal')}
        >
          Simple
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'tiles' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('tiles')}
        >
          Grid View
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'mini' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('mini')}
        >
          Mini Buttons
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'dropdown' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('dropdown')}
        >
          Dropdowns
        </button>
      </div>
      
      {/* Normal selector */}
      {selectorMode === 'normal' && (
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
                <option value="">Select a country</option>
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
                <option value="">Select a country</option>
                {countriesData?.countries?.map((country: any) => (
                  <option key={country.countryCode} value={country.name}>
                    {country.name}
                  </option>
                ))}
              </select>
            )}
          </div>
        </div>
      )}
      
      {/* Tile Selector */}
      {selectorMode === 'tiles' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Countries</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {countriesLoading ? (
              <div className="col-span-6 text-center py-4">Loading countries...</div>
            ) : (
              countriesData?.countries?.map((country: any) => {
                const status = getCountryStatus(country.countryCode);
                return (
                  <div
                    key={country.countryCode}
                    className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                      status === 'selected'
                        ? 'bg-blue-600 text-white'
                        : status === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handleCountrySelect(country.countryCode)}
                  >
                    <h3 className="font-semibold text-sm">{country.name}</h3>
                    <p className="text-xs opacity-75">{country.region}</p>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
      
      {/* Mini Button Selector */}
      {selectorMode === 'mini' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Countries</h2>
          <div className="flex flex-wrap gap-2">
            {countriesLoading ? (
              <div className="text-center py-4 w-full">Loading countries...</div>
            ) : (
              countriesData?.countries?.map((country: any) => {
                const status = getCountryStatus(country.countryCode);
                const regionColor = regionColors[country.region as keyof typeof regionColors] || 'border-gray-500';
                
                return (
                  <button
                    key={country.countryCode}
                    className={`py-1 px-3 text-sm rounded border ${regionColor} ${
                      status === 'selected'
                        ? 'bg-blue-600 text-white'
                        : status === 'error'
                        ? 'bg-red-600 text-white'
                        : 'bg-gray-800 hover:bg-gray-700'
                    }`}
                    onClick={() => handleCountrySelect(country.countryCode)}
                    title={`${country.name} (${country.region})`}
                  >
                    {country.countryCode}
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
      
      {/* Dropdown Selector */}
      {selectorMode === 'dropdown' && (
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Select Countries</h2>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {index + 1}
                </div>
                <select
                  className="bg-gray-800 text-white py-2 px-4 rounded-md w-64"
                  value={dropdownValues[index]}
                  onChange={(e) => handleDropdownChange(index, e.target.value)}
                  disabled={countriesLoading}
                >
                  <option value="">Select a country</option>
                  {countriesData?.countries?.map((country: any) => (
                    <option 
                      key={country.countryCode} 
                      value={country.countryCode}
                      disabled={selectedCountries.includes(country.countryCode) && !dropdownValues[index].includes(country.countryCode)}
                    >
                      {country.name} ({country.countryCode})
                    </option>
                  ))}
                </select>
                {dropdownValues[index] && (
                  <button 
                    onClick={() => handleDropdownChange(index, '')}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    aria-label="Remove country"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <div className="mt-4 text-sm text-gray-400">
              <p>Select up to 5 countries to compare. Each dropdown represents one selection slot.</p>
            </div>
          </div>
        </div>
      )}
      
      {/* Selected Countries Summary (for non-normal modes) */}
      {selectorMode !== 'normal' && selectedCountries.length > 0 && (
        <div className="mt-6 py-3 px-4 bg-gray-800 rounded-lg">
          <h3 className="font-medium mb-2">Selected Countries ({selectedCountries.length}/5)</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCountries.map(countryCode => {
              const country = countriesData?.countries?.find((c: any) => c.countryCode === countryCode);
              const isError = countriesWithErrors.includes(countryCode);
              
              return (
                <div key={countryCode} className={`flex items-center space-x-1 py-1 px-3 rounded ${isError ? 'bg-red-900' : 'bg-blue-900'}`}>
                  <span>{country?.name}</span>
                  <button 
                    onClick={() => handleCountrySelect(countryCode)}
                    className="text-sm opacity-70 hover:opacity-100"
                    aria-label="Remove country"
                  >
                    ✕
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {comparisonError && (
        <div className="text-red-500">
          Error: {comparisonError.message}
        </div>
      )}

      {comparisonData && chartData.length > 0 && (
        <div className="space-y-4">
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart 
                data={chartData}
                layout="vertical"
                barCategoryGap={20}
                barGap={8}
                margin={{ top: 30, right: 30, left: 20, bottom: 20 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <YAxis 
                  type="category" 
                  dataKey="name" 
                  width={120}
                  axisLine={false}
                />
                <XAxis 
                  type="number" 
                  domain={[0, 100]}
                  axisLine={true}
                  tickLine={true}
                />
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
                      position: 'insideTopRight',
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
                            x={x + width - 10}
                            y={y + height / 2 + 5}
                            textAnchor="end"
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
                        if (width < 50) return null;
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