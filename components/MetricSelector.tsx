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
  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-text-secondary mb-1">Select Metrics</h3>
      <div className="max-h-[200px] overflow-y-auto bg-background-dark rounded-lg text-xs">
        <div className="p-2">
          {metrics.map(metric => (
            <div key={metric.id} className="mb-1 last:mb-0">
              <button
                onClick={() => {
                  if (selectedMetrics.includes(metric.id)) {
                    setSelectedMetrics(selectedMetrics.filter(id => id !== metric.id));
                  } else {
                    setSelectedMetrics([...selectedMetrics, metric.id]);
                  }
                }}
                className={`w-full text-left px-2 py-0.5 rounded group ${
                  selectedMetrics.includes(metric.id)
                    ? 'bg-accent-primary text-white'
                    : 'hover:bg-accent-secondary/20'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span>{metric.name}</span>
                  <div className="flex items-center space-x-1">
                    <span className="text-[10px] opacity-60">
                      {metric.dataQuality.confidenceInterval}
                    </span>
                    <div className="flex items-center">
                      <span className="text-[10px] opacity-60 mr-1">Reliability:</span>
                      <div className="w-12 bg-background-light rounded-full h-1.5">
                        <div 
                          className="bg-green-500 h-1.5 rounded-full" 
                          style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                        ></div>
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-[10px] opacity-60 mt-0.5">{metric.description}</p>
              </button>
            </div>
          ))}
        </div>
      </div>
      <div className="text-xs text-text-secondary mt-1">
        Selected: {selectedMetrics.length} / {metrics.length}
      </div>
    </div>
  );
} 