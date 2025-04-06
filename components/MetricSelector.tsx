'use client';

import React from 'react';

interface DataQuality {
  reliability: number;
  sampleSize: string;
  updateFrequency: string;
  confidenceInterval: string;
  methodology: string;
}

interface Metric {
  id: string;
  name: string;
  description: string;
  source: string;
  citation: string;
  sourceLink: string;
  dataQuality: DataQuality;
}

interface MetricSelectorProps {
  metrics: Metric[];
  selectedMetrics: string[];
  setSelectedMetrics: (metrics: string[]) => void;
}

export default function MetricSelector({
  metrics,
  selectedMetrics,
  setSelectedMetrics,
}: MetricSelectorProps) {
  const handleMetricToggle = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  return (
    <div className="bg-card-bg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Select Metrics
      </h3>
      <div className="space-y-4">
        {metrics.map((metric) => (
          <div key={metric.id} className="relative">
            <button
              onClick={() => handleMetricToggle(metric.id)}
              className={`
                w-full text-left px-4 py-3 rounded-lg
                transition-colors duration-200 ease-in-out
                ${
                  selectedMetrics.includes(metric.id)
                    ? 'bg-accent-primary text-white'
                    : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
                }
              `}
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{metric.name}</h4>
                  <p className="text-sm mt-1 opacity-90">{metric.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="text-right">
                    <div className="flex items-center">
                      <span className="text-xs opacity-75 mr-2">Reliability:</span>
                      <div className="w-16 bg-background-dark rounded-full h-1.5">
                        <div
                          className="bg-green-500 h-1.5 rounded-full"
                          style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs mt-1 opacity-75">
                      CI: {metric.dataQuality.confidenceInterval}
                    </p>
                  </div>
                </div>
              </div>
              <div className="mt-2 text-xs opacity-75">
                <a
                  href={metric.sourceLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline"
                  onClick={(e) => e.stopPropagation()}
                >
                  {metric.source}
                </a>
              </div>
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary">
          Selected: {selectedMetrics.length} / {metrics.length}
        </p>
      </div>
    </div>
  );
} 