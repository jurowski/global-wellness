"use client";

import { useState, useEffect } from 'react';
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

type ViewMode = 'bar' | 'line';
type SelectorMode = 'normal' | 'tiles' | 'mini' | 'dropdown';

export default function StateComparison() {
  const [selectedStates, setSelectedStates] = useState<string[]>([]);
  const [viewMode, setViewMode] = useState<ViewMode>('bar');
  const [statesWithErrors, setStatesWithErrors] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['happiness', 'healthcare', 'education']);
  const [selectorMode, setSelectorMode] = useState<SelectorMode>('normal');
  const [state1, setState1] = useState<string>('');
  const [state2, setState2] = useState<string>('');
  const [dropdownValues, setDropdownValues] = useState<string[]>(Array(5).fill(''));
  const [sortMode, setSortMode] = useState<'alphabetical' | 'region'>('alphabetical');

  // Sync selected states with dropdown values when selectedStates changes
  useEffect(() => {
    // Create a new array with the current dropdown values
    const newDropdownValues = [...dropdownValues];
    
    // First, clear any dropdown values that are no longer in selectedStates
    for (let i = 0; i < newDropdownValues.length; i++) {
      if (newDropdownValues[i] && !selectedStates.includes(newDropdownValues[i])) {
        newDropdownValues[i] = '';
      }
    }
    
    // Then, make sure each selected state is represented in a dropdown
    selectedStates.forEach((stateCode, index) => {
      // If this state isn't already in a dropdown, find an empty slot
      if (!newDropdownValues.includes(stateCode)) {
        // Find the first empty slot
        const emptySlot = newDropdownValues.findIndex(val => val === '');
        if (emptySlot !== -1) {
          newDropdownValues[emptySlot] = stateCode;
        }
      }
    });
    
    setDropdownValues(newDropdownValues);
  }, [selectedStates]);

  // Set initial states for Simple view based on geolocation
  useEffect(() => {
    // Only attempt to set default states if in 'normal' mode and no states are selected yet
    if (selectorMode === 'normal' && !state1 && !state2) {
      // Default to NY and CA if geolocation fails
      let defaultState1 = 'NY';
      let defaultState2 = 'CA';
      
      // Try to get user's location using browser geolocation
      if (typeof navigator !== 'undefined' && navigator.geolocation) {
        // First set some reasonable defaults
        setState1(defaultState1);
        setState2(defaultState2);
        setSelectedStates([defaultState1, defaultState2]);
        
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              // Use reverse geocoding to get the state from coordinates
              const { latitude, longitude } = position.coords;
              
              // Simplified state detection based on rough geographical boundaries
              // This is a basic approximation and not accurate for all locations
              let detectedStateCode = '';
              
              // Very rough approximation - better to use a proper geocoding service in production
              if (latitude > 45) {
                if (longitude < -90) detectedStateCode = 'WA';
                else detectedStateCode = 'ME';
              } else if (latitude > 40) {
                if (longitude < -100) detectedStateCode = 'OR';
                else if (longitude < -85) detectedStateCode = 'IL';
                else detectedStateCode = 'NJ';
              } else if (latitude > 35) {
                if (longitude < -110) detectedStateCode = 'CA';
                else if (longitude < -90) detectedStateCode = 'OK';
                else detectedStateCode = 'VA';
              } else {
                if (longitude < -110) detectedStateCode = 'AZ';
                else if (longitude < -90) detectedStateCode = 'TX';
                else detectedStateCode = 'FL';
              }
              
              // If we detected a state
              if (detectedStateCode) {
                // Find the state details
                const detectedState = ALL_STATES.find(s => s.stateCode === detectedStateCode);
                
                if (detectedState) {
                  // Find another state in the same region
                  const sameRegionStates = ALL_STATES.filter(s => 
                    s.region === detectedState.region && s.stateCode !== detectedStateCode
                  );
                  
                  // Pick a random state from the same region
                  const randomState = sameRegionStates[Math.floor(Math.random() * sameRegionStates.length)];
                  
                  if (randomState) {
                    setState1(detectedStateCode);
                    setState2(randomState.stateCode);
                    setSelectedStates([detectedStateCode, randomState.stateCode]);
                  }
                }
              }
            } catch (error) {
              console.error('Error detecting state from location:', error);
              // Fallback to defaults if there's an error
            }
          },
          (error) => {
            console.log('Geolocation error or permission denied:', error);
            // User denied geolocation or another error occurred
            // We'll use the default states already set
          }
        );
      }
    }
  }, [selectorMode, state1, state2]);

  // Sync state1 and state2 with selectedStates
  useEffect(() => {
    // Only update state1 and state2 if we have selected states and are in normal mode
    if (selectorMode === 'normal' && selectedStates.length) {
      // First state is first in selectedStates array
      if (selectedStates[0] && selectedStates[0] !== state1) {
        setState1(selectedStates[0]);
      }
      
      // Second state is second in selectedStates array
      if (selectedStates[1] && selectedStates[1] !== state2) {
        setState2(selectedStates[1]);
      }
      
      // If there's only one state selected, clear the second state
      if (selectedStates.length === 1 && state2) {
        setState2('');
      }
    }
  }, [selectedStates, selectorMode]);
  
  // When changing selector modes, ensure consistency
  useEffect(() => {
    if (selectorMode === 'normal') {
      // If we have selected states, use them for state1 and state2
      if (selectedStates.length >= 1 && !state1) {
        setState1(selectedStates[0]);
      }
      if (selectedStates.length >= 2 && !state2) {
        setState2(selectedStates[1]);
      }
    }
  }, [selectorMode]);

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

  const handleDropdownChange = (index: number, stateCode: string) => {
    // If selecting an empty option
    if (stateCode === '') {
      // If there was a previous value, remove it from selected states
      if (dropdownValues[index] !== '') {
        setSelectedStates(selectedStates.filter(code => code !== dropdownValues[index]));
        setStatesWithErrors(statesWithErrors.filter(code => code !== dropdownValues[index]));
      }
      
      // Update dropdown value
      const newDropdownValues = [...dropdownValues];
      newDropdownValues[index] = '';
      setDropdownValues(newDropdownValues);
      return;
    }
    
    // If selecting a state that's already selected in another dropdown
    if (selectedStates.includes(stateCode)) {
      // Find which dropdown has this state
      const existingIndex = dropdownValues.findIndex(val => val === stateCode);
      if (existingIndex !== -1 && existingIndex !== index) {
        // Clear the other dropdown
        const newDropdownValues = [...dropdownValues];
        newDropdownValues[existingIndex] = '';
        newDropdownValues[index] = stateCode;
        setDropdownValues(newDropdownValues);
      }
      return;
    }
    
    // If there was a previous selection in this dropdown, remove it
    if (dropdownValues[index] !== '') {
      setSelectedStates(selectedStates.filter(code => code !== dropdownValues[index]));
      setStatesWithErrors(statesWithErrors.filter(code => code !== dropdownValues[index]));
    }
    
    // Add the new state
    if (selectedStates.length < 5) {
      setSelectedStates([...selectedStates, stateCode]);
      
      // Update dropdown value
      const newDropdownValues = [...dropdownValues];
      newDropdownValues[index] = stateCode;
      setDropdownValues(newDropdownValues);
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

  const regionColors = {
    'Northeast': 'border-blue-400',
    'Midwest': 'border-green-400',
    'South': 'border-orange-400',
    'West': 'border-purple-400'
  };

  // Function to sort states based on the selected sort mode
  const getSortedStates = () => {
    if (sortMode === 'alphabetical') {
      return [...ALL_STATES].sort((a, b) => a.name.localeCompare(b.name));
    } else {
      // Sort by region first, then by state name within each region
      return [...ALL_STATES].sort((a, b) => {
        const regionCompare = a.region.localeCompare(b.region);
        return regionCompare !== 0 ? regionCompare : a.name.localeCompare(b.name);
      });
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Tab Navigation - Moved above the header text */}
      <div className="flex border-b border-gray-700 mb-6">
        <button 
          className={`py-2 px-4 ${selectorMode === 'normal' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('normal')}
        >
          Simple
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'tiles' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('tiles')}
        >
          Grid View
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'mini' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('mini')}
        >
          Mini Buttons
        </button>
        <button 
          className={`py-2 px-4 ${selectorMode === 'dropdown' ? 'border-b-2 border-blue-500 font-medium' : 'text-gray-400 hover:text-white'}`}
          onClick={() => setSelectorMode('dropdown')}
        >
          Dropdowns
        </button>
      </div>
      
      <h1 className="text-3xl font-bold mb-8">Discover how diverse state policies and environments shape wellness across the United States.</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Select States</h2>
        
        {/* Normal (Simple) selector */}
        {selectorMode === 'normal' && (
          <>
            <div className="grid grid-cols-2 gap-4 mb-8">
              <div>
                <label className="block text-sm font-medium mb-2">First State</label>
                <select
                  value={state1}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState1(newState);
                    
                    // Update selectedStates
                    const otherState = selectedStates.find(s => s !== state1) || state2;
                    setSelectedStates(newState && otherState ? [newState, otherState].filter(Boolean) : []);
                  }}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="">Select a state</option>
                  {ALL_STATES.map((state) => (
                    <option key={state.stateCode} value={state.stateCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Second State</label>
                <select
                  value={state2}
                  onChange={(e) => {
                    const newState = e.target.value;
                    setState2(newState);
                    
                    // Update selectedStates
                    const otherState = selectedStates.find(s => s !== state2) || state1;
                    setSelectedStates(newState && otherState ? [otherState, newState].filter(Boolean) : []);
                  }}
                  className="w-full p-2 rounded bg-gray-800 border border-gray-700"
                >
                  <option value="">Select a state</option>
                  {ALL_STATES.map((state) => (
                    <option key={state.stateCode} value={state.stateCode}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            
            {/* Simple View Bar Chart (Displayed immediately after the simple selectors) */}
            {selectedStates.length > 0 && !comparisonLoading && comparisonData?.compareStates && (
              <div className="mt-4 mb-8">
                {/* Quick metric selectors for Simple view */}
                <div className="mb-4">
                  <div className="flex flex-wrap gap-2">
                    {METRICS.map((metric) => (
                      <button
                        key={metric.id}
                        onClick={() => toggleMetric(metric.id)}
                        className={`px-3 py-1 text-sm rounded flex items-center gap-1 ${
                          selectedMetrics.includes(metric.id)
                            ? 'bg-blue-600 text-white'
                            : 'bg-gray-800 hover:bg-gray-700'
                        }`}
                        style={{
                          borderLeft: `3px solid ${metric.color}`
                        }}
                      >
                        <span className="w-3 h-3">
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
                
                <MetricBarChart 
                  data={comparisonData.compareStates} 
                  metrics={METRICS.filter(m => selectedMetrics.includes(m.id))}
                />
              </div>
            )}
            
            {comparisonLoading && (
              <div className="flex flex-col items-center justify-center h-48 mt-4 mb-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500 mb-2"></div>
                <div className="text-gray-400 text-sm">Loading comparison data...</div>
              </div>
            )}
          </>
        )}
        
        {/* Tile Selector */}
        {selectorMode === 'tiles' && (
          <>
            {/* Sort Mode Tabs for Grid View */}
            <div className="flex mb-4">
              <button 
                className={`py-1 px-4 rounded-l-md ${sortMode === 'alphabetical' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => setSortMode('alphabetical')}
              >
                Alphabetical
              </button>
              <button 
                className={`py-1 px-4 rounded-r-md ${sortMode === 'region' ? 'bg-blue-600 text-white' : 'bg-gray-700 text-gray-200 hover:bg-gray-600'}`}
                onClick={() => setSortMode('region')}
              >
                By Region
              </button>
            </div>

            {sortMode === 'alphabetical' ? (
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                {getSortedStates().map((state) => {
                  const status = getStateStatus(state.stateCode);
                  
                  return (
                    <div
                      key={state.stateCode}
                      className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                        status === 'selected'
                          ? 'bg-blue-600 text-white'
                          : status === 'error'
                          ? 'bg-red-600 text-white'
                          : 'bg-gray-800 hover:bg-gray-700'
                      }`}
                      onClick={() => handleStateSelect(state.stateCode)}
                    >
                      <h3 className="font-semibold text-sm">{state.name}</h3>
                      <p className="text-xs opacity-75">{state.region}</p>
                    </div>
                  );
                })}
              </div>
            ) : (
              // Regional map-like layout in a 3-column structure - rectangle layout
              <div className="relative w-full bg-gray-900 rounded-lg p-4 border border-gray-800 grid grid-cols-3 gap-4 h-[650px]">
                {/* West Region - Entire Left Column */}
                <div className="col-span-1 h-full flex flex-col">
                  <div className="h-full p-2 rounded-lg bg-purple-900/30 border-l-4 border-purple-400">
                    <h3 className="text-lg font-medium text-purple-400 mb-3 sticky top-0 bg-gray-900/80 py-2 backdrop-blur-sm">West</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[570px] overflow-y-auto pr-1">
                      {ALL_STATES.filter(state => state.region === 'West').sort((a, b) => a.name.localeCompare(b.name)).map(state => {
                        const status = getStateStatus(state.stateCode);
                        return (
                          <div
                            key={state.stateCode}
                            className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                              status === 'selected'
                                ? 'bg-blue-600 text-white'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            } border-l-2 border-purple-400`}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            <h3 className="font-semibold text-sm">{state.name}</h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Midwest Region - Middle Column */}
                <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
                  {/* Midwest Region - Full Middle Column */}
                  <div className="row-span-1 p-2 rounded-lg bg-green-900/30 border-l-4 border-green-400">
                    <h3 className="text-lg font-medium text-green-400 mb-3 sticky top-0 bg-gray-900/80 py-2 backdrop-blur-sm">Midwest</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {ALL_STATES.filter(state => state.region === 'Midwest').sort((a, b) => a.name.localeCompare(b.name)).map(state => {
                        const status = getStateStatus(state.stateCode);
                        return (
                          <div
                            key={state.stateCode}
                            className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                              status === 'selected'
                                ? 'bg-blue-600 text-white'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            } border-l-2 border-green-400`}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            <h3 className="font-semibold text-sm">{state.name}</h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* South Region - Bottom Half of Middle Column */}
                  <div className="row-span-1 p-2 rounded-lg bg-orange-900/30 border-l-4 border-orange-400">
                    <h3 className="text-lg font-medium text-orange-400 mb-3 sticky top-0 bg-gray-900/80 py-2 backdrop-blur-sm">South (Western)</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {ALL_STATES.filter(state => 
                        state.region === 'South' && 
                        ['TX', 'OK', 'AR', 'LA', 'MS', 'TN', 'KY'].includes(state.stateCode)
                      ).sort((a, b) => a.name.localeCompare(b.name)).map(state => {
                        const status = getStateStatus(state.stateCode);
                        return (
                          <div
                            key={state.stateCode}
                            className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                              status === 'selected'
                                ? 'bg-blue-600 text-white'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            } border-l-2 border-orange-400`}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            <h3 className="font-semibold text-sm">{state.name}</h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
                
                {/* Northeast and South Eastern Regions - Right Column */}
                <div className="col-span-1 grid grid-rows-2 gap-4 h-full">
                  {/* Northeast Region - Top Half of Right Column */}
                  <div className="row-span-1 p-2 rounded-lg bg-blue-900/30 border-l-4 border-blue-400">
                    <h3 className="text-lg font-medium text-blue-400 mb-3 sticky top-0 bg-gray-900/80 py-2 backdrop-blur-sm">Northeast</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {ALL_STATES.filter(state => state.region === 'Northeast').sort((a, b) => a.name.localeCompare(b.name)).map(state => {
                        const status = getStateStatus(state.stateCode);
                        return (
                          <div
                            key={state.stateCode}
                            className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                              status === 'selected'
                                ? 'bg-blue-600 text-white'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            } border-l-2 border-blue-400`}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            <h3 className="font-semibold text-sm">{state.name}</h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                  
                  {/* South Region - Bottom Half of Right Column */}
                  <div className="row-span-1 p-2 rounded-lg bg-orange-900/30 border-l-4 border-orange-400">
                    <h3 className="text-lg font-medium text-orange-400 mb-3 sticky top-0 bg-gray-900/80 py-2 backdrop-blur-sm">South (Eastern)</h3>
                    <div className="grid grid-cols-1 gap-2 max-h-[220px] overflow-y-auto pr-1">
                      {ALL_STATES.filter(state => 
                        state.region === 'South' && 
                        !['TX', 'OK', 'AR', 'LA', 'MS', 'TN', 'KY'].includes(state.stateCode)
                      ).sort((a, b) => a.name.localeCompare(b.name)).map(state => {
                        const status = getStateStatus(state.stateCode);
                        return (
                          <div
                            key={state.stateCode}
                            className={`p-2 rounded-lg cursor-pointer transition-colors text-center ${
                              status === 'selected'
                                ? 'bg-blue-600 text-white'
                                : status === 'error'
                                ? 'bg-red-600 text-white'
                                : 'bg-gray-800 hover:bg-gray-700'
                            } border-l-2 border-orange-400`}
                            onClick={() => handleStateSelect(state.stateCode)}
                          >
                            <h3 className="font-semibold text-sm">{state.name}</h3>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
        
        {/* Mini Button Selector */}
        {selectorMode === 'mini' && (
          <div className="flex flex-wrap gap-2">
            {ALL_STATES.map((state) => {
              const status = getStateStatus(state.stateCode);
              const regionColor = regionColors[state.region as keyof typeof regionColors];
              
              return (
                <button
                  key={state.stateCode}
                  className={`py-1 px-3 text-sm rounded border ${regionColor} ${
                    status === 'selected'
                      ? 'bg-blue-600 text-white'
                      : status === 'error'
                      ? 'bg-red-600 text-white'
                      : 'bg-gray-800 hover:bg-gray-700'
                  }`}
                  onClick={() => handleStateSelect(state.stateCode)}
                  title={`${state.name} (${state.region})`}
                >
                  {state.stateCode}
                </button>
              );
            })}
          </div>
        )}
        
        {/* Dropdown Selector */}
        {selectorMode === 'dropdown' && (
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4">
                <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                  {index + 1}
                </div>
                <select
                  className="bg-gray-800 text-white py-2 px-4 rounded-md w-64"
                  value={dropdownValues[index]}
                  onChange={(e) => handleDropdownChange(index, e.target.value)}
                >
                  <option value="">Select a state</option>
                  {ALL_STATES.map((state) => (
                    <option 
                      key={state.stateCode} 
                      value={state.stateCode}
                      disabled={selectedStates.includes(state.stateCode) && !dropdownValues[index].includes(state.stateCode)}
                    >
                      {state.name} ({state.stateCode})
                    </option>
                  ))}
                </select>
                {dropdownValues[index] && (
                  <button 
                    onClick={() => handleDropdownChange(index, '')}
                    className="bg-red-600 hover:bg-red-700 text-white p-2 rounded"
                    aria-label="Remove state"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                    </svg>
                  </button>
                )}
              </div>
            ))}
            <div className="mt-4 text-sm text-gray-400">
              <p>Select up to 5 states to compare. Each dropdown represents one selection slot.</p>
            </div>
          </div>
        )}
        
        {/* Error Messages */}
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
        
        {/* Selected States Summary */}
        {selectedStates.length > 0 && selectorMode !== 'normal' && (
          <div className="mt-6 py-3 px-4 bg-gray-800 rounded-lg">
            <h3 className="font-medium mb-2">Selected States ({selectedStates.length}/5)</h3>
            <div className="flex flex-wrap gap-2">
              {selectedStates.map(stateCode => {
                const state = ALL_STATES.find(s => s.stateCode === stateCode);
                const isError = statesWithErrors.includes(stateCode);
                
                return (
                  <div key={stateCode} className={`flex items-center space-x-1 py-1 px-3 rounded ${isError ? 'bg-red-900' : 'bg-blue-900'}`}>
                    <span>{state?.name}</span>
                    <button 
                      onClick={() => handleStateSelect(stateCode)}
                      className="text-sm opacity-70 hover:opacity-100"
                      aria-label="Remove state"
                    >
                      ✕
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {selectedStates.length > 0 && (
        <>
          {selectorMode !== 'normal' && (
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
        </>
      )}
    </div>
  );
} 