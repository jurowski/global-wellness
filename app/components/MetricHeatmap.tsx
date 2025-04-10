'use client';

import { ResponsiveContainer } from 'recharts';
import { StateData } from '../types/state';

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff8042'];

const METRICS = [
  { id: 'happiness', label: 'Happiness' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'work_life', label: 'Work Life' },
  { id: 'social_support', label: 'Social Support' }
];

function calculateCorrelation(x: number[], y: number[]): number {
  const n = x.length;
  const sum_x = x.reduce((a, b) => a + b, 0);
  const sum_y = y.reduce((a, b) => a + b, 0);
  const sum_xy = x.reduce((a, b, i) => a + b * y[i], 0);
  const sum_x2 = x.reduce((a, b) => a + b * b, 0);
  const sum_y2 = y.reduce((a, b) => a + b * b, 0);

  const correlation = (n * sum_xy - sum_x * sum_y) /
    Math.sqrt((n * sum_x2 - sum_x * sum_x) * (n * sum_y2 - sum_y * sum_y));

  return isNaN(correlation) ? 0 : correlation;
}

interface MetricHeatmapProps {
  data: StateData[];
}

export default function MetricHeatmap({ data }: MetricHeatmapProps) {
  const getMetricValues = (metricId: string) => {
    if (!data) return [];
    return data.map(state => {
      const metricData = state[metricId as keyof StateData];
      if (metricData && typeof metricData === 'object' && 'value' in metricData) {
        return metricData.value;
      }
      return 0;
    });
  };

  const correlations = METRICS.map(metric1 => {
    const values1 = getMetricValues(metric1.id);
    return METRICS.map(metric2 => {
      const values2 = getMetricValues(metric2.id);
      return calculateCorrelation(values1, values2);
    });
  });

  const getColor = (value: number, isCountryCode: boolean = false) => {
    const hue = ((value + 1) / 2) * 240; // Maps -1 to 1 to 0 to 240 (blue to red)
    return `hsl(${hue}, 70%, 50%)`;
  };

  const year = data?.[0]?.happiness?.year || new Date().getFullYear();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Metric Correlations</h3>
      <div className="text-sm text-gray-400 mb-4">
        Data from {year}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full">
          <thead>
            <tr>
              <th className="p-2"></th>
              {METRICS.map(metric => (
                <th key={metric.id} className="p-2 text-sm font-medium">
                  {metric.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {METRICS.map((metric1, i) => (
              <tr key={metric1.id}>
                <td className="p-2 text-sm font-medium">{metric1.label}</td>
                {METRICS.map((metric2, j) => (
                  <td
                    key={metric2.id}
                    className="p-2"
                    style={{
                      backgroundColor: getColor(correlations[i]?.[j] || 0, true),
                      width: '80px',
                      height: '80px',
                      textAlign: 'center'
                    }}
                  >
                    {correlations[i]?.[j]?.toFixed(2) || '0.00'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 