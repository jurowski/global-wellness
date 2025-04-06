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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';

interface DataQuality {
  reliability: number;
  sampleSize: string;
  updateFrequency: string;
  confidenceInterval: string;
  methodology: string;
}

interface Metric {
  id: string;
  name: string;
  description: string;
  source: string;
  citation: string;
  sourceLink: string;
  dataQuality: DataQuality;
}

interface WellnessData {
  country: string;
  metrics: Record<string, number>;
  year: number;
}

interface WellnessInsightsProps {
  data: WellnessData[];
  metrics: Metric[];
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

  const formatData = () => {
    if (selectedView === 'trends') {
      // Group data by year for line chart
      return data.reduce((acc, entry) => {
        const yearData = acc.find(d => d.year === entry.year);
        if (yearData) {
          yearData[entry.country] = entry.metrics;
        } else {
          acc.push({
            year: entry.year,
            ...Object.fromEntries([[entry.country, entry.metrics]]),
          });
        }
        return acc;
      }, [] as any[]).sort((a, b) => a.year - b.year);
    } else if (selectedView === 'comparison') {
      // Latest year data for bar chart
      const latestYear = Math.max(...data.map(d => d.year));
      return data
        .filter(d => d.year === latestYear)
        .map(d => ({
          country: d.country,
          ...d.metrics,
        }));
    } else {
      // Radar chart data
      const latestYear = Math.max(...data.map(d => d.year));
      return data
        .filter(d => d.year === latestYear)
        .map(d => ({
          ...d.metrics,
          country: d.country,
        }));
    }
  };

  const renderChart = () => {
    const formattedData = formatData();

    if (selectedView === 'trends') {
      return (
        <div style={{ width: '100%', height: 400 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={formattedData}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
              <XAxis
                dataKey="year"
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
              {Object.keys(formattedData[0] || {})
                .filter(key => key !== 'year')
                .map((country, index) => (
                  <Line
                    key={country}
                    type="monotone"
                    dataKey={country}
                    stroke={CHART_COLORS[index % CHART_COLORS.length]}
                    strokeWidth={2}
                    dot={{ fill: CHART_COLORS[index % CHART_COLORS.length] }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      );
    }

    if (selectedView === 'comparison') {
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
              {metrics.map((metric, index) => (
                <Bar
                  key={metric.id}
                  dataKey={metric.id}
                  name={metric.name}
                  fill={CHART_COLORS[index % CHART_COLORS.length]}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      );
    }

    return (
      <div style={{ width: '100%', height: 400 }}>
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={formattedData}>
            <PolarGrid stroke="var(--border-color)" />
            <PolarAngleAxis
              dataKey="country"
              tick={{ fill: 'var(--text-secondary)' }}
            />
            <PolarRadiusAxis stroke="var(--text-secondary)" />
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--background-light)',
                border: '1px solid var(--border-color)',
                borderRadius: '0.5rem',
              }}
            />
            {metrics.map((metric, index) => (
              <Radar
                key={metric.id}
                name={metric.name}
                dataKey={metric.id}
                stroke={CHART_COLORS[index % CHART_COLORS.length]}
                fill={CHART_COLORS[index % CHART_COLORS.length]}
                fillOpacity={0.2}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="bg-card-bg rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-lg font-semibold text-text-primary">
          Wellness Insights
        </h3>
        <div className="flex space-x-2">
          <button
            onClick={() => setSelectedView('trends')}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium
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
              px-3 py-1.5 rounded-md text-sm font-medium
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
          <button
            onClick={() => setSelectedView('radar')}
            className={`
              px-3 py-1.5 rounded-md text-sm font-medium
              transition-colors duration-200 ease-in-out
              ${
                selectedView === 'radar'
                  ? 'bg-accent-primary text-white'
                  : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
              }
            `}
          >
            Radar
          </button>
        </div>
      </div>
      {renderChart()}
    </div>
  );
} 