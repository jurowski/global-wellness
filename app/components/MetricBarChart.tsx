import React from 'react';
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
import { StateData } from '../types/state';

interface MetricBarChartProps {
  data: StateData[];
  metrics: { id: string; label: string; color: string }[];
}

const MetricBarChart: React.FC<MetricBarChartProps> = ({ data, metrics }) => {
  const chartData = data.map(state => {
    const result: any = { name: state.name };
    
    metrics.forEach(metric => {
      const metricData = state[metric.id as keyof StateData];
      if (typeof metricData === 'object' && metricData !== null) {
        result[metric.id] = (metricData as any).value || 0;
        result[`${metric.id}_isReal`] = (metricData as any).isRealData || false;
        result[`${metric.id}_data`] = metricData;
      }
    });

    return result;
  });

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm">
          <p className="font-semibold text-lg mb-2">{label}</p>
          {payload.map((entry: any, index: number) => {
            const metric = metrics.find(m => m.id === entry.dataKey);
            const value = typeof entry.value === 'number' ? entry.value.toFixed(2) : entry.value;
            const metricData = entry.payload[entry.dataKey + '_data'];
            const isRealData = entry.payload[`${entry.dataKey}_isReal`];

            return (
              <div key={index} className="mb-3 last:mb-0">
                <div style={{ color: entry.color }} className="font-medium">
                  {metric?.label}: {value}
                  {!isRealData && (
                    <span className="ml-2 text-yellow-400 text-sm">(Simulated Data)</span>
                  )}
                </div>
                {metricData && (
                  <div className="text-sm text-gray-300 mt-1">
                    <div>Year: {metricData.year}</div>
                    <div>Source: {metricData.source}</div>
                    {metricData.confidenceInterval && (
                      <div>Confidence Interval: ±{metricData.confidenceInterval}</div>
                    )}
                    {metricData.category && (
                      <div>Category: {metricData.category}</div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      );
    }
    return null;
  };

  return (
    <div className="w-full h-[500px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
        >
          <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
          <XAxis
            dataKey="name"
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
          />
          <YAxis
            stroke="#9CA3AF"
            tick={{ fill: '#9CA3AF' }}
            domain={[0, 10]}
          />
          <Tooltip content={<CustomTooltip />} />
          <Legend />
          {metrics.map((metric) => (
            <Bar
              key={metric.id}
              dataKey={metric.id}
              name={metric.label}
              fill={metric.color}
              radius={[4, 4, 0, 0]}
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MetricBarChart; 