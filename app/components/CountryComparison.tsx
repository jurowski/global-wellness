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

const COMPARE_COUNTRIES = gql`
  query CompareCountries($country1: String!, $country2: String!, $metrics: [String!]!) {
    compareCountries(country1: $country1, country2: $country2, metrics: $metrics) {
      metric
      country1Value
      country2Value
      difference
      percentageDifference
      isSignificant
    }
  }
`;

const GET_COUNTRIES = gql`
  query GetCountries {
    countries
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
}

export default function CountryComparison({ selectedMetrics = ['happiness', 'healthcare', 'education', 'work_life'] }: CountryComparisonProps) {
  const [country1, setCountry1] = useState('United States');
  const [country2, setCountry2] = useState('Finland');

  const { data: countriesData } = useQuery(GET_COUNTRIES);
  const { data: comparisonData, error } = useQuery(COMPARE_COUNTRIES, {
    variables: {
      country1,
      country2,
      metrics: selectedMetrics
    },
    skip: !selectedMetrics.length
  });

  const standardizeCountryName = (name: string) => {
    return COUNTRY_NAME_MAPPING[name] || name;
  };

  const chartData = comparisonData?.compareCountries?.map((item: any) => ({
    metric: item.metric,
    [country1]: item.country1Value,
    [country2]: item.country2Value,
  })) || [];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-2">First Country</label>
          <select
            value={country1}
            onChange={(e) => setCountry1(standardizeCountryName(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            {countriesData?.countries?.map((country: string) => (
              <option key={country} value={country}>
                {country}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">Second Country</label>
          <select
            value={country2}
            onChange={(e) => setCountry2(standardizeCountryName(e.target.value))}
            className="w-full p-2 rounded bg-gray-800 border border-gray-700"
          >
            {countriesData?.countries?.map((country: string) => (
              <option key={country} value={country}>
                {country}
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
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="metric" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey={country1} fill="#4CAF50" />
              <Bar dataKey={country2} fill="#2196F3" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
} 