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
      happiness {
        value
      }
      healthcare {
        value
      }
      education {
        value
      }
      work_life {
        value
      }
      social_support {
        value
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

export default function MetricRadarChart() {
  const { data } = useQuery(GET_WELLNESS_DATA, {
    variables: {
      countries: ['US', 'FI', 'JP'],
      metrics: METRICS.map(m => m.id)
    }
  });

  const chartData = METRICS.map(metric => {
    const entry: any = {
      metric: metric.label
    };
    
    if (data?.wellnessData) {
      data.wellnessData.forEach((country: any, index: number) => {
        entry[`Country ${index + 1}`] = country[metric.id]?.value || 0;
      });
    }
    
    return entry;
  });

  return (
    <div className="bg-gray-800 rounded-lg p-6">
      <h3 className="text-xl font-semibold mb-4">Metric Comparison Radar</h3>
      <div className="h-96">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={chartData}>
            <PolarGrid />
            <PolarAngleAxis dataKey="metric" />
            <PolarRadiusAxis angle={30} domain={[0, 10]} />
            <Radar
              name="Country 1"
              dataKey="Country 1"
              stroke="#8884d8"
              fill="#8884d8"
              fillOpacity={0.6}
            />
            <Radar
              name="Country 2"
              dataKey="Country 2"
              stroke="#82ca9d"
              fill="#82ca9d"
              fillOpacity={0.6}
            />
            <Radar
              name="Country 3"
              dataKey="Country 3"
              stroke="#ffc658"
              fill="#ffc658"
              fillOpacity={0.6}
            />
            <Legend />
          </RadarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
} 