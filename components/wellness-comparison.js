// components/WellnessComparison.js
import { useState } from 'react';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar
} from 'recharts';

// Color palette for different countries
const COUNTRY_COLORS = {
  'USA': '#1f77b4',
  'Finland': '#ff7f0e',
  'Japan': '#2ca02c',
  'Germany': '#d62728',
  'Sweden': '#9467bd',
  'Costa Rica': '#8c564b',
  'New Zealand': '#e377c2',
  'Denmark': '#7f7f7f',
  'Switzerland': '#bcbd22',
  'Canada': '#17becf',
};

// Get a lighter version of a color for hover effects
const getLighterColor = (hex) => {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r}, ${g}, ${b}, 0.7)`;
};

export default function WellnessComparison({ data, metrics }) {
  const [chartType, setChartType] = useState('bar'); // 'bar' or 'radar'
  
  // Function to transform data for the selected chart type
  const getTransformedData = () => {
    if (chartType === 'bar') {
      // For bar charts, data should be grouped by metric
      return Object.keys(data.metrics).map(metricId => {
        const metric = metrics.find(m => m.id === metricId);
        const metricData = {
          name: metric?.name || metricId,
          ...data.metrics[metricId]
        };
        return metricData;
      });
    } else {
      // For radar charts, data should be grouped by country
      return data.countries.map(country => {
        const countryData = {
          name: country,
          ...Object.keys(data.metrics).reduce((acc, metricId) => {
            acc[metricId] = data.metrics[metricId][country];
            return acc;
          }, {})
        };
        return countryData;
      });
    }
  };

  const transformedData = getTransformedData();
  
  // Custom tooltip to show metric descriptions
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const metricId = chartType === 'bar' 
        ? metrics.find(m => m.name === label)?.id 
        : payload[0].dataKey;
      
      const metricInfo = metrics.find(m => m.id === metricId);
      
      return (
        <div className="bg-white p-4 shadow-lg rounded-lg border border-gray-200">
          <p className="font-bold">{label}</p>
          {payload.map((entry, index) => (
            <p key={index} style={{ color: entry.color }}>
              {entry.name}: {entry.value.toFixed(2)}
            </p>
          ))}
          {metricInfo && (
            <>
              <div className="mt-2 text-sm text-gray-500">{metricInfo.description}</div>
              <div className="mt-1 text-xs text-gray-400">Source: {metricInfo.source}</div>
            </>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Wellness Metrics Comparison</h2>
        <div className="mt-4 sm:mt-0 flex space-x-4">
          <button
            onClick={() => setChartType('bar')}
            className={`px-4 py-2 rounded-md ${
              chartType === 'bar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Bar Chart
          </button>
          <button
            onClick={() => setChartType('radar')}
            className={`px-4 py-2 rounded-md ${
              chartType === 'radar'
                ? 'bg-blue-600 text-white'
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
          >
            Radar Chart
          </button>
        </div>
      </div>

      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          {chartType === 'bar' ? (
            <BarChart data={transformedData} margin={{ top: 20, right: 30, left: 20, bottom: 70 }}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="name" 
                angle={-45} 
                textAnchor="end" 
                height={70} 
                tick={{ fontSize: 12 }}
              />
              <YAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {data.countries.map((country, index) => (
                <Bar 
                  key={country} 
                  dataKey={country} 
                  fill={COUNTRY_COLORS[country] || `#${Math.floor(Math.random()*16777215).toString(16)}`}
                  activeBar={{ fill: getLighterColor(COUNTRY_COLORS[country] || '#000000') }}
                />
              ))}
            </BarChart>
          ) : (
            <RadarChart outerRadius="80%" data={transformedData}>
              <PolarGrid />
              <PolarAngleAxis dataKey="name" />
              <PolarRadiusAxis />
              <Tooltip content={<CustomTooltip />} />
              <Legend />
              {Object.keys(data.metrics).map((metricId, index) => {
                const metric = metrics.find(m => m.id === metricId);
                return (
                  <Radar 
                    key={metricId} 
                    name={metric?.name || metricId} 
                    dataKey={metricId} 
                    stroke={`#${((1<<24)*Math.random()|0).toString(16)}`} 
                    fill={`#${((1<<24)*Math.random()|0).toString(16)}33`} 
                    fillOpacity={0.6} 
                  />
                );
              })}
            </RadarChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
}
