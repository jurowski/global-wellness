'use client';

import React from 'react';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  BarChart,
  Bar,
} from 'recharts';

interface WellnessMetric {
  id: string;
  name: string;
  category: string;
  description: string;
  source: string;
  dataQuality?: {
    reliability: number;
    sampleSize: string;
    updateFrequency: string;
    confidenceInterval: string;
    methodology: string;
  };
}

interface GlobalData {
  countries: string[];
  metrics: Record<string, Record<string, number>>;
  sources: string[];
}

interface TrendData {
  name: string;
  [key: string]: number | string;
}

interface ComparisonData {
  country: string;
  [key: string]: number | string;
}

type ChartData = TrendData | ComparisonData;

interface WellnessInsightsProps {
  data: GlobalData;
  metrics: WellnessMetric[];
}

const CHART_COLORS = [
  '#2563eb', // blue-600
  '#dc2626', // red-600
  '#16a34a', // green-600
  '#9333ea', // purple-600
  '#ea580c', // orange-600
  '#0891b2', // cyan-600
  '#4f46e5', // indigo-600
  '#c026d3', // fuchsia-600
  '#65a30d', // lime-600
  '#0d9488', // teal-600
];

export default function WellnessInsights({ data, metrics }: WellnessInsightsProps) {
  const [selectedView, setSelectedView] = React.useState('trends');
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(null);

  // Group metrics by category
  const metricsByCategory = React.useMemo(() => {
    const groups: Record<string, WellnessMetric[]> = {};
    metrics.forEach(metric => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, [metrics]);

  const formatData = (): ChartData[] => {
    if (!data || !data.metrics || Object.keys(data.metrics).length === 0) {
      return [];
    }

    const selectedCountries = data.countries;
    const selectedMetrics = selectedCategory 
      ? metrics.filter(m => m.category === selectedCategory)
      : metrics;

    if (selectedView === 'trends') {
      return Object.entries(data.metrics)
        .filter(([metricId]) => selectedMetrics.some(m => m.id === metricId))
        .map(([metricId, countryValues]): TrendData => {
          const metric = metrics.find(m => m.id === metricId);
          const filteredData: Record<string, number | string> = {
            name: metric?.name || metricId,
            category: metric?.category || 'Uncategorized'
          };
          
          selectedCountries.forEach(country => {
            if (countryValues[country] !== undefined) {
              filteredData[country] = countryValues[country];
            }
          });
          
          return filteredData as TrendData;
        })
        .filter(data => {
          const hasData = selectedCountries.some(country => data[country] !== undefined);
          return hasData;
        });
    } else {
      return selectedCountries.map((country): ComparisonData => ({
        country,
        ...Object.entries(data.metrics)
          .filter(([metricId]) => selectedMetrics.some(m => m.id === metricId))
          .reduce((acc, [metricId, countryValues]) => ({
            ...acc,
            [metrics.find(m => m.id === metricId)?.name || metricId]: countryValues[country] || 0
          }), {})
      }));
    }
  };

  const renderChart = () => {
    const formattedData = formatData();

    if (!formattedData || formattedData.length === 0) {
      return (
        <div className="flex items-center justify-center h-[300px] bg-background-light rounded-lg">
          <p className="text-text-secondary">No data available</p>
        </div>
      );
    }

    if (selectedView === 'trends') {
      const trendData = formattedData as TrendData[];
      const countriesWithData = Object.keys(trendData[0] || {}).filter(key => !['name', 'category'].includes(key));
      
      return (
        <div style={{ width: '100%', height: 300 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="name"
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              />
              <YAxis
                stroke="var(--text-secondary)"
                tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'var(--background-light)',
                  border: '1px solid var(--border-color)',
                  borderRadius: '0.5rem',
                  fontSize: '12px'
                }}
                formatter={(value: number, name: string) => [
                  value.toFixed(2),
                  `${name} (${trendData.find(d => d[name] === value)?.category || 'Uncategorized'})`
                ]}
              />
              <Legend wrapperStyle={{ fontSize: '12px' }} />
              {countriesWithData.map((country, index) => (
                <Line
                  key={country}
                  type="monotone"
                  dataKey={country}
                  stroke={CHART_COLORS[index % CHART_COLORS.length]}
                  strokeWidth={2}
                  dot={{ fill: CHART_COLORS[index % CHART_COLORS.length], r: 4 }}
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={formattedData}>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              dataKey="country"
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)' }}
            />
            <YAxis
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)' }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
              }}
            />
            <Legend />
            {metrics
              .filter(m => !selectedCategory || m.category === selectedCategory)
              .map((metric, index) => (
                <Bar
                  key={metric.id}
                  dataKey={metric.name}
                  name={`${metric.name} (${metric.category})`}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-card-bg rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <h3 className="text-sm font-medium text-text-primary">
          Wellness Insights
        </h3>
        <div className="flex space-x-1">
          <button
            onClick={() => setSelectedView('trends')}
            className={`
              px-2 py-1 rounded-md text-xs font-medium
              transition-colors duration-200 ease-in-out
              ${
                selectedView === 'trends'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
              }
            `}
          >
            Trends
          </button>
          <button
            onClick={() => setSelectedView('comparison')}
            className={`
              px-2 py-1 rounded-md text-xs font-medium
              transition-colors duration-200 ease-in-out
              ${
                selectedView === 'comparison'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
              }
            `}
          >
            Comparison
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div className="mb-4">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`
              px-2 py-1 rounded-md text-xs font-medium
              transition-colors duration-200 ease-in-out
              ${
                selectedCategory === null
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
              }
            `}
          >
            All Categories
          </button>
          {Object.keys(metricsByCategory).map(category => (
            <button
              key={category}
              onClick={() => setSelectedCategory(category)}
              className={`
                px-2 py-1 rounded-md text-xs font-medium
                transition-colors duration-200 ease-in-out
                ${
                  selectedCategory === category
                    ? 'bg-accent-primary text-white'
                    : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
                }
              `}
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {renderChart()}
    </div>
  );
} 