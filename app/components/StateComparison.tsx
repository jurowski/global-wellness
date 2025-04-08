"use client";

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import MetricRadarChart from './MetricRadarChart';
import MetricHeatmap from './MetricHeatmap';
import { State, StateData } from '../types/state';

const GET_STATES = gql`
  query GetStates {
    states {
      name
      stateCode
      region
      population
    }
  }
`;

const COMPARE_STATES = gql`
  query CompareStates($stateCodes: [String!]!) {
    compareStates(stateCodes: $stateCodes) {
      name
      stateCode
      region
      population
      happiness {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      healthcare {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      education {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      work_life {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      social_support {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
    }
  }
`;

export default function StateComparison() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<'radar' | 'heatmap'>('radar');

  const { loading: statesLoading, error: statesError, data: statesData } = useQuery<{ states: State[] }>(GET_STATES);
  const { loading: comparisonLoading, error: comparisonError, data: comparisonData } = useQuery<{ compareStates: StateData[] }>(
    COMPARE_STATES,
    {
      variables: { stateCodes: selectedStates },
      skip: selectedStates.length === 0
    }
  );

  const handleStateSelect = (stateCode: string) => {
    if (selectedStates.includes(stateCode)) {
      setSelectedStates(selectedStates.filter(code => code !== stateCode));
    } else if (selectedStates.length < 5) {
      setSelectedStates([...selectedStates, stateCode]);
    }
  };

  if (statesLoading) return <div>Loading states...</div>;
  if (statesError) return <div>Error loading states: {statesError.message}</div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Compare US States</h2>
        <div className="flex space-x-4">
          <button
            onClick={() => setViewMode('radar')}
            className={`px-4 py-2 rounded ${
              viewMode === 'radar' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Radar Chart
          </button>
          <button
            onClick={() => setViewMode('heatmap')}
            className={`px-4 py-2 rounded ${
              viewMode === 'heatmap' ? 'bg-blue-600 text-white' : 'bg-gray-200'
            }`}
          >
            Heatmap
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-gray-800 p-6 rounded-lg">
          <h3 className="text-xl font-semibold mb-4">Select States (max 5)</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
            {statesData?.states.map((state) => (
              <button
                key={state.stateCode}
                onClick={() => handleStateSelect(state.stateCode)}
                className={`p-2 rounded ${
                  selectedStates.includes(state.stateCode)
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-700 hover:bg-gray-600'
                }`}
              >
                {state.name}
              </button>
            ))}
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg">
          {comparisonLoading ? (
            <div>Loading comparison data...</div>
          ) : comparisonError ? (
            <div>Error loading comparison: {comparisonError.message}</div>
          ) : comparisonData?.compareStates.length > 0 ? (
            viewMode === 'radar' ? (
              <MetricRadarChart data={comparisonData.compareStates} />
            ) : (
              <MetricHeatmap data={comparisonData.compareStates} />
            )
          ) : (
            <div className="text-center text-gray-400">
              Select at least one state to compare
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 