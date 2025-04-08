"use client";

import { useState } from 'react';
import { useQuery, gql } from '@apollo/client';
import MetricLineChart from './MetricLineChart';
import MetricBarChart from './MetricBarChart';
import { State, StateData, WellnessMetric } from '../types/state';

// Pre-defined list of all US states
const ALL_STATES: State[] = [
  { name: 'Alabama', stateCode: 'AL', region: 'South', population: 5024279 },
  { name: 'Alaska', stateCode: 'AK', region: 'West', population: 733391 },
  { name: 'Arizona', stateCode: 'AZ', region: 'West', population: 7151502 },
  { name: 'Arkansas', stateCode: 'AR', region: 'South', population: 3011524 },
  { name: 'California', stateCode: 'CA', region: 'West', population: 39538223 },
  { name: 'Colorado', stateCode: 'CO', region: 'West', population: 5773714 },
  { name: 'Connecticut', stateCode: 'CT', region: 'Northeast', population: 3605944 },
  { name: 'Delaware', stateCode: 'DE', region: 'Northeast', population: 989948 },
  { name: 'Florida', stateCode: 'FL', region: 'South', population: 21538187 },
  { name: 'Georgia', stateCode: 'GA', region: 'South', population: 10711908 },
  { name: 'Hawaii', stateCode: 'HI', region: 'West', population: 1455271 },
  { name: 'Idaho', stateCode: 'ID', region: 'West', population: 1839106 },
  { name: 'Illinois', stateCode: 'IL', region: 'Midwest', population: 12812508 },
  { name: 'Indiana', stateCode: 'IN', region: 'Midwest', population: 6785528 },
  { name: 'Iowa', stateCode: 'IA', region: 'Midwest', population: 3190369 },
  { name: 'Kansas', stateCode: 'KS', region: 'Midwest', population: 2937880 },
  { name: 'Kentucky', stateCode: 'KY', region: 'South', population: 4509394 },
  { name: 'Louisiana', stateCode: 'LA', region: 'South', population: 4657757 },
  { name: 'Maine', stateCode: 'ME', region: 'Northeast', population: 1362359 },
  { name: 'Maryland', stateCode: 'MD', region: 'Northeast', population: 6177224 },
  { name: 'Massachusetts', stateCode: 'MA', region: 'Northeast', population: 7029917 },
  { name: 'Michigan', stateCode: 'MI', region: 'Midwest', population: 10077331 },
  { name: 'Minnesota', stateCode: 'MN', region: 'Midwest', population: 5706494 },
  { name: 'Mississippi', stateCode: 'MS', region: 'South', population: 2961279 },
  { name: 'Missouri', stateCode: 'MO', region: 'Midwest', population: 6154913 },
  { name: 'Montana', stateCode: 'MT', region: 'West', population: 1084225 },
  { name: 'Nebraska', stateCode: 'NE', region: 'Midwest', population: 1961504 },
  { name: 'Nevada', stateCode: 'NV', region: 'West', population: 3104614 },
  { name: 'New Hampshire', stateCode: 'NH', region: 'Northeast', population: 1377529 },
  { name: 'New Jersey', stateCode: 'NJ', region: 'Northeast', population: 9288994 },
  { name: 'New Mexico', stateCode: 'NM', region: 'West', population: 2117522 },
  { name: 'New York', stateCode: 'NY', region: 'Northeast', population: 20201249 },
  { name: 'North Carolina', stateCode: 'NC', region: 'South', population: 10439388 },
  { name: 'North Dakota', stateCode: 'ND', region: 'Midwest', population: 779094 },
  { name: 'Ohio', stateCode: 'OH', region: 'Midwest', population: 11799448 },
  { name: 'Oklahoma', stateCode: 'OK', region: 'South', population: 3959353 },
  { name: 'Oregon', stateCode: 'OR', region: 'West', population: 4237256 },
  { name: 'Pennsylvania', stateCode: 'PA', region: 'Northeast', population: 13002700 },
  { name: 'Rhode Island', stateCode: 'RI', region: 'Northeast', population: 1097379 },
  { name: 'South Carolina', stateCode: 'SC', region: 'South', population: 5118425 },
  { name: 'South Dakota', stateCode: 'SD', region: 'Midwest', population: 886667 },
  { name: 'Tennessee', stateCode: 'TN', region: 'South', population: 6910840 },
  { name: 'Texas', stateCode: 'TX', region: 'South', population: 29145505 },
  { name: 'Utah', stateCode: 'UT', region: 'West', population: 3271616 },
  { name: 'Vermont', stateCode: 'VT', region: 'Northeast', population: 643077 },
  { name: 'Virginia', stateCode: 'VA', region: 'South', population: 8631393 },
  { name: 'Washington', stateCode: 'WA', region: 'West', population: 7705281 },
  { name: 'West Virginia', stateCode: 'WV', region: 'South', population: 1793716 },
  { name: 'Wisconsin', stateCode: 'WI', region: 'Midwest', population: 5893718 },
  { name: 'Wyoming', stateCode: 'WY', region: 'West', population: 576851 }
];

const METRICS = [
  { id: 'happiness', label: 'Happiness', color: '#FF6384' },
  { id: 'healthcare', label: 'Healthcare', color: '#36A2EB' },
  { id: 'education', label: 'Education', color: '#FFCE56' },
  { id: 'work_life', label: 'Work-Life Balance', color: '#4BC0C0' },
  { id: 'social_support', label: 'Social Support', color: '#9966FF' }
];

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

type ViewMode = 'line' | 'bar';

export default function StateComparison() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [statesWithErrors, setStatesWithErrors] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['happiness']);

  const { loading: comparisonLoading, error: comparisonError, data: comparisonData } = useQuery<{ compareStates: StateData[] }>(
    COMPARE_STATES,
    {
      variables: { stateCodes: selectedStates },
      skip: selectedStates.length === 0,
      onError: (error) => {
        console.error('Error fetching state data:', error);
        setStatesWithErrors(selectedStates);
      },
      onCompleted: (data) => {
        // Check which states have complete data
        const statesWithMissingData = selectedStates.filter(stateCode => {
          const stateData = data.compareStates.find(s => s.stateCode === stateCode);
          if (!stateData) return true;
          
          // Check if all metrics have real data
          const metrics = ['happiness', 'healthcare', 'education', 'work_life', 'social_support'];
          return !metrics.every(metric => {
            const metricData = stateData[metric as keyof StateData];
            return (
              metricData &&
              typeof metricData === 'object' &&
              'isRealData' in metricData &&
              (metricData as WellnessMetric).isRealData
            );
          });
        });
        setStatesWithErrors(statesWithMissingData);
      }
    }
  );

  const handleStateSelect = (stateCode: string) => {
    if (selectedStates.includes(stateCode)) {
      setSelectedStates(selectedStates.filter(code => code !== stateCode));
      setStatesWithErrors(statesWithErrors.filter(code => code !== stateCode));
    } else if (selectedStates.length < 5) {
      setSelectedStates([...selectedStates, stateCode]);
    }
  };

  const getStateStatus = (stateCode: string) => {
    if (statesWithErrors.includes(stateCode)) {
      return 'error';
    }
    if (selectedStates.includes(stateCode)) {
      return 'selected';
    }
    return 'default';
  };

  const toggleMetric = (metricId: string) => {
    setSelectedMetrics(current => {
      if (current.includes(metricId)) {
        // Don't allow deselecting if it's the last metric
        if (current.length === 1) return current;
        return current.filter(id => id !== metricId);
      }
      return [...current, metricId];
    });
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">State Wellness Comparison</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {ALL_STATES.map((state) => {
            const status = getStateStatus(state.stateCode);
            return (
              <div
                key={state.stateCode}
                className={`p-4 rounded-lg cursor-pointer transition-colors ${
                  status === 'selected'
                    ? 'bg-blue-600 text-white'
                    : status === 'error'
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => handleStateSelect(state.stateCode)}
              >
                <h3 className="font-semibold">{state.name}</h3>
                <p className="text-sm opacity-75">{state.region}</p>
              </div>
            );
          })}
        </div>
        {statesWithErrors.length > 0 && (
          <div className="mt-4 text-sm text-yellow-500">
            <p>⚠️ States with incomplete or missing data:</p>
            <ul className="list-disc list-inside">
              {statesWithErrors.map(stateCode => {
                const state = ALL_STATES.find(s => s.stateCode === stateCode);
                return <li key={stateCode}>{state?.name}</li>;
              })}
            </ul>
          </div>
        )}
      </div>

      {selectedStates.length > 0 && (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">View Mode</h2>
            <div className="flex gap-4">
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === 'bar'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setViewMode('bar')}
              >
                Bar Chart
              </button>
              <button
                className={`px-4 py-2 rounded ${
                  viewMode === 'line'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-800 hover:bg-gray-700'
                }`}
                onClick={() => setViewMode('line')}
              >
                Line Chart
              </button>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Select Metrics</h2>
            <div className="flex flex-wrap gap-3">
              {METRICS.map((metric) => (
                <button
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`px-4 py-2 rounded flex items-center gap-2 ${
                    selectedMetrics.includes(metric.id)
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  style={{
                    borderLeft: `4px solid ${metric.color}`
                  }}
                >
                  <span className="w-4 h-4">
                    {selectedMetrics.includes(metric.id) && (
                      <svg viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </span>
                  {metric.label}
                </button>
              ))}
            </div>
          </div>

          {comparisonLoading ? (
            <div className="flex flex-col items-center justify-center h-96">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mb-4"></div>
              <div className="text-gray-400">Loading comparison data...</div>
            </div>
          ) : comparisonError ? (
            <div className="text-red-500">Error loading comparison: {comparisonError.message}</div>
          ) : comparisonData?.compareStates && comparisonData.compareStates.length > 0 ? (
            <div className="mt-8">
              {viewMode === 'bar' && (
                <MetricBarChart 
                  data={comparisonData.compareStates} 
                  metrics={METRICS.filter(m => selectedMetrics.includes(m.id))}
                />
              )}
              {viewMode === 'line' && (
                <MetricLineChart 
                  data={comparisonData.compareStates} 
                  metrics={METRICS.filter(m => selectedMetrics.includes(m.id))}
                />
              )}
            </div>
          ) : (
            <div className="text-center text-gray-400 h-96 flex items-center justify-center">
              Select at least one state to compare
            </div>
          )}
        </>
      )}
    </div>
  );
} 