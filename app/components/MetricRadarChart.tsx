'use client';

import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';
import { StateData } from '../types/state';

const METRICS = [
  { id: 'happiness', label: 'Happiness' },
  { id: 'healthcare', label: 'Healthcare' },
  { id: 'education', label: 'Education' },
  { id: 'work_life', label: 'Work Life' },
  { id: 'social_support', label: 'Social Support' }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff8042'];

interface MetricRadarChartProps {
  data: StateData[];
}

export default function MetricRadarChart({ data }: MetricRadarChartProps) {
  const chartData = METRICS.map(metric => {
    const entry: any = {
      metric: metric.label
    };
    
    if (data) {
      data.forEach((state) => {
        const metricData = state[metric.id as keyof StateData];
        if (metricData && typeof metricData === 'object' && 'value' in metricData) {
          entry[state.name] = metricData.value;
        } else {
          entry[state.name] = 0;
        }
      });
    }
    
    return entry;
  });

  const year = data?.[0]?.happiness?.year || new Date().getFullYear();

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Metric Comparison Radar</h3>
      <div className="text-sm text-gray-400 mb-4">
        Data from {year}
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {data?.map((state, index) => (
              <Radar
                key={state.stateCode}
                name={state.name}
                dataKey={state.name}
                stroke={COLORS[index % COLORS.length]}
                fill={COLORS[index % COLORS.length]}
                fillOpacity={0.6}
              />
            ))}
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 