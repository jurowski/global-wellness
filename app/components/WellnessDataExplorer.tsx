'use client';

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';

const GET_TRENDS = gql`
  query GetTrends($country: String!, $metric: String!, $years: Int!) {
    getTrends(country: $country, metric: $metric, years: $years) {
      year
      value
    }
  }
`;

const GET_REGIONAL_AVERAGES = gql`
  query GetRegionalAverages($metric: String!) {
    getRegionalAverages(metric: $metric) {
      region
      average
      sampleSize
      year
    }
  }
`;

const SEARCH_COUNTRIES = gql`
  query SearchCountries($query: String!) {
    searchCountries(query: $query) {
      countryCode
      region
    }
  }
`;

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff8042'];

const METRICS = [
  { id: 'happiness', label: 'Happiness' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'work_life', label: 'Work Life' },
  { id: 'social_support', label: 'Social Support' }
];

export default function WellnessDataExplorer() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedMetric, setSelectedMetric] = useState('happiness');
  const [years, setYears] = useState(5);

  const { data: trendsData } = useQuery(GET_TRENDS, {
    variables: {
      country: selectedCountry,
      metric: selectedMetric,
      years
    },
    skip: !selectedCountry || !selectedMetric
  });

  const { data: regionalData } = useQuery(GET_REGIONAL_AVERAGES, {
    variables: {
      metric: selectedMetric
    }
  });

  const { data: searchResults } = useQuery(SEARCH_COUNTRIES, {
    variables: {
      query: searchQuery
    },
    skip: !searchQuery
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Search Countries</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search for countries..."
          className="w-full p-2 rounded bg-gray-800 border border-gray-700"
        />
        {searchResults?.searchCountries && (
          <div className="mt-2 space-y-2">
            {searchResults.searchCountries.map((country: any) => (
              <div
                key={country.countryCode}
                className="p-2 bg-gray-800 rounded cursor-pointer hover:bg-gray-700"
                onClick={() => setSelectedCountry(country.countryCode)}
              >
                <p>{country.countryCode}</p>
                <p className="text-sm text-gray-400">{country.region}</p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h3 className="text-xl font-semibold mb-4">Trends Over Time</h3>
          <div className="space-y-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-2">Metric</label>
              <select
                value={selectedMetric}
                onChange={(e) => setSelectedMetric(e.target.value)}
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              >
                {METRICS.map(({ id, label }) => (
                  <option key={id} value={id}>{label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-2">Years</label>
              <input
                type="number"
                value={years}
                onChange={(e) => setYears(parseInt(e.target.value))}
                min="1"
                max="10"
                className="w-full p-2 rounded bg-gray-800 border border-gray-700"
              />
            </div>
          </div>
          {trendsData && (
            <div className="h-80">
              <div className="text-sm text-gray-400 mb-4">
                Historical data from {trendsData.getTrends[0]?.year || 2023} to {trendsData.getTrends[trendsData.getTrends.length - 1]?.year || 2023}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={trendsData.getTrends}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#8884d8"
                    activeDot={{ r: 8 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

        <div>
          <h3 className="text-xl font-semibold mb-4">Regional Averages</h3>
          {regionalData && (
            <div className="h-80">
              <div className="text-sm text-gray-400 mb-4">
                Regional averages from {regionalData.getRegionalAverages[0]?.year || 2023}
              </div>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={regionalData.getRegionalAverages}
                    dataKey="average"
                    nameKey="region"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label
                  >
                    {regionalData.getRegionalAverages.map((entry: any, index: number) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 