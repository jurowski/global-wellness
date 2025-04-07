'use client';

import { useQuery, gql } from '@apollo/client';
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Legend
} from 'recharts';

const GET_WELLNESS_DATA = gql`
  query GetWellnessData($countries: [String!], $metrics: [String!]) {
    wellnessData(countries: $countries, metrics: $metrics) {
      name
      code
      happiness {
        value
        year
      }
      healthcare {
        value
        year
      }
      education {
        value
        year
      }
      work_life {
        value
        year
      }
      social_support {
        value
        year
      }
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

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#ff8042'];

export default function MetricRadarChart() {
  const { data } = useQuery(GET_WELLNESS_DATA, {
    variables: {
      countries: ['United States', 'Finland', 'Japan'],
      metrics: METRICS.map(m => m.id)
    }
  });

  const chartData = METRICS.map(metric => {
    const entry: any = {
      metric: metric.label
    };
    
    if (data?.wellnessData) {
      data.wellnessData.forEach((country: any) => {
        entry[country.name] = country[metric.id]?.value || 0;
      });
    }
    
    return entry;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Metric Comparison Radar</h3>
      <div className="text-sm text-gray-400 mb-4">
        Data from {data?.wellnessData?.[0]?.happiness?.year || 2023}
      </div>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 100]} />
            {data?.wellnessData?.map((country: any, index: number) => (
              <Radar
                key={country.code}
                name={country.name}
                dataKey={country.name}
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