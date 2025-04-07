'use client';

import { useState } from 'react';
import CountryComparison from './components/CountryComparison';
import WellnessDataExplorer from './components/WellnessDataExplorer';
import MetricRadarChart from './components/MetricRadarChart';
import MetricHeatmap from './components/MetricHeatmap';
import MetricSelector from './components/MetricSelector';

export default function Home() {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['happiness', 'healthcare', 'education', 'work_life']);

  const handleMetricSelect = (metric: string) => {
    setSelectedMetrics(prev =>
      prev.includes(metric)
        ? prev.filter(m => m !== metric)
        : [...prev, metric]
    );
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold text-center mb-8">
          Explore how different societal structures correlate with wellness outcomes around the world.
        </h1>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4">
            <div className="sticky top-8">
              <MetricSelector
                selectedMetrics={selectedMetrics}
                onMetricSelect={handleMetricSelect}
              />
            </div>
          </div>

          <div className="lg:col-span-8">
            <CountryComparison selectedMetrics={selectedMetrics} />
          </div>
        </div>

        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div>
            <MetricRadarChart />
          </div>
          <div>
            <MetricHeatmap />
          </div>
        </section>
      </div>
    </div>
  );
} 