'use client';

import { useState } from 'react';
import SelectorCountryComparison from '../components/SelectorCountryComparison';
import MetricRadarChart from '../components/MetricRadarChart';
import MetricHeatmap from '../components/MetricHeatmap';

const METRICS = [
  { id: 'happiness', label: 'Happiness', color: '#4CAF50' },
  { id: 'healthcare', label: 'Healthcare', color: '#2196F3' },
  { id: 'education', label: 'Education', color: '#FFC107' },
  { id: 'work_life', label: 'Work Life', color: '#9C27B0' },
  { id: 'social_support', label: 'Social Support', color: '#FF5722' }
];

export default function Countries() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['happiness', 'healthcare', 'education', 'work_life']);
  const [selectedCountries, setSelectedCountries] = useState<string[]>(['United States', 'Japan']);

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

  const handleCountryChange = (country1: string, country2: string) => {
    setSelectedCountries([country1, country2]);
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Metric Selectors */}
        <div className="flex flex-wrap gap-2 mb-6">
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
        
        <h1 className="text-3xl font-bold mb-8">Explore how different societal structures correlate with wellness outcomes around the world.</h1>

        <div className="mb-12">
          <SelectorCountryComparison
            selectedMetrics={selectedMetrics}
            onCountryChange={handleCountryChange}
          />
        </div>

        <h2 className="text-2xl font-bold mb-6 text-center">Coming Soon: How Your Values Match Theirs</h2>
        
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MetricRadarChart data={[]} />
          </div>
          <div>
            <MetricHeatmap data={[]} />
          </div>
        </section>
      </div>
    </div>
  );
} 