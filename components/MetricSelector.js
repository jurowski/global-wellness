import { useState } from 'react';

export default function MetricSelector({ metrics, selectedMetrics, setSelectedMetrics }) {
  const [expandedMetric, setExpandedMetric] = useState(null);

  const toggleMetric = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Select Metrics</h2>
      <div className="grid grid-cols-1 gap-3">
        {metrics.map(metric => (
          <div key={metric.id} className="bg-background-light rounded-lg border border-border-color">
            <button
              className={`w-full text-left p-4 focus:outline-none ${
                selectedMetrics.includes(metric.id) ? 'bg-accent-primary/10' : ''
              }`}
              onClick={() => {
                toggleMetric(metric.id);
                setExpandedMetric(expandedMetric === metric.id ? null : metric.id);
              }}
            >
              <div className="flex justify-between items-center">
                <span className="font-medium text-text-primary">{metric.name}</span>
                <div className="flex items-center space-x-2">
                  <div className="text-sm text-text-secondary">
                    {metric.dataQuality.reliability * 100}% reliable
                  </div>
                  <div className="w-16 bg-background-dark rounded-full h-2">
                    <div 
                      className="bg-green-500 h-2 rounded-full" 
                      style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>
              {expandedMetric === metric.id && (
                <div className="mt-2">
                  <p className="text-sm text-text-secondary mb-2">{metric.description}</p>
                  <div className="text-xs text-text-secondary">
                    Source: <a href={metric.sourceLink} target="_blank" rel="noopener noreferrer" className="text-accent-primary hover:text-accent-secondary">{metric.source}</a>
                  </div>
                </div>
              )}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
} 