'use client';

import React, { useState, useMemo } from 'react';

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
  category: string;
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

// Category icons mapping
const CATEGORY_ICONS: Record<string, string> = {
  'Personal Well-being': '😊',
  'Health & Healthcare': '🏥',
  'Education & Learning': '📚',
  'Work & Economic Well-being': '💼',
  'Environment & Sustainability': '🌱',
  'Social Connections & Community': '👥',
  'Digital Well-being & Technology': '💻',
  'Cultural & Creative Well-being': '🎨',
  'Food & Nutrition Well-being': '🍎',
  'Urban & Housing Well-being': '🏠',
  'Safety & Security Well-being': '🛡️',
  'Financial Well-being': '💰',
  'Mobility & Transportation': '🚗',
  'Recreation & Leisure': '🎮'
};

export default function MetricSelector({
  metrics,
  selectedMetrics,
  setSelectedMetrics,
}: MetricSelectorProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<string[]>([]);
  const [selectedMetricDetails, setSelectedMetricDetails] = useState<string | null>(null);
  const [hoveredMetric, setHoveredMetric] = useState<string | null>(null);

  // Group metrics by category
  const groupedMetrics = useMemo(() => {
    const groups: Record<string, Metric[]> = {};
    metrics.forEach(metric => {
      if (!groups[metric.category]) {
        groups[metric.category] = [];
      }
      groups[metric.category].push(metric);
    });
    return groups;
  }, [metrics]);

  // Check if a category has selected metrics
  const hasSelectedMetrics = (category: string) => {
    return metrics.some(metric => 
      metric.category === category && selectedMetrics.includes(metric.id)
    );
  };

  // Filter metrics based on search query
  const filteredMetrics = useMemo(() => {
    if (!searchQuery) return metrics;
    const query = searchQuery.toLowerCase();
    return metrics.filter(metric => 
      metric.name.toLowerCase().includes(query) ||
      metric.description.toLowerCase().includes(query) ||
      metric.category.toLowerCase().includes(query)
    );
  }, [metrics, searchQuery]);

  // Toggle category expansion
  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };

  // Toggle metric selection
  const toggleMetric = (metricId: string) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(id => id !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  // Toggle metric details
  const toggleMetricDetails = (metricId: string) => {
    setSelectedMetricDetails(selectedMetricDetails === metricId ? null : metricId);
  };

  // Get reliability color based on value
  const getReliabilityColor = (reliability: number) => {
    if (reliability >= 0.9) return 'bg-green-500';
    if (reliability >= 0.8) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-xs font-medium text-text-secondary">Select Metrics</h3>
        <div className="text-xs text-text-secondary">
          Selected: {selectedMetrics.length} / {metrics.length}
        </div>
      </div>

      {/* Search input */}
      <input
        type="text"
        placeholder="Search metrics..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full px-2 py-1 mb-2 text-xs bg-background-dark rounded border border-border-color focus:outline-none focus:ring-1 focus:ring-accent-primary"
      />

      <div className="max-h-[400px] overflow-y-auto bg-background-dark rounded-lg text-xs">
        <div className="p-2">
          {Object.entries(groupedMetrics).map(([category, categoryMetrics]) => {
            const isExpanded = expandedCategories.includes(category);
            const filteredCategoryMetrics = filteredMetrics.filter(m => m.category === category);
            const categoryHasSelectedMetrics = hasSelectedMetrics(category);
            
            if (filteredCategoryMetrics.length === 0) return null;

            return (
              <div key={category} className="mb-2 last:mb-0">
                <button
                  onClick={() => toggleCategory(category)}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between ${
                    categoryHasSelectedMetrics
                      ? 'bg-accent-primary/20 text-accent-primary'
                      : 'bg-background-light hover:bg-accent-secondary/10'
                  }`}
                >
                  <div className="flex items-center">
                    <span className="mr-2">{CATEGORY_ICONS[category] || '📊'}</span>
                    <span className="font-medium">{category}</span>
                    {categoryHasSelectedMetrics && (
                      <span className="ml-2 text-[10px] bg-accent-primary/20 px-1.5 py-0.5 rounded">
                        {metrics.filter(m => m.category === category && selectedMetrics.includes(m.id)).length} selected
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] opacity-60">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </button>

                {isExpanded && (
                  <div className="mt-1 pl-2">
                    {filteredCategoryMetrics.map(metric => (
                      <div 
                        key={metric.id} 
                        className="mb-1 last:mb-0"
                        onMouseEnter={() => setHoveredMetric(metric.id)}
                        onMouseLeave={() => setHoveredMetric(null)}
                      >
                        <button
                          onClick={() => toggleMetric(metric.id)}
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
                                    className={`h-1.5 rounded-full ${getReliabilityColor(metric.dataQuality.reliability)}`}
                                    style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                          </div>
                          <p className="text-[10px] opacity-60 mt-0.5">{metric.description}</p>
                        </button>

                        {/* Quick Info Tooltip */}
                        {hoveredMetric === metric.id && (
                          <div className="absolute z-10 mt-1 p-2 bg-background-light rounded shadow-lg text-[10px] max-w-xs">
                            <div className="font-medium mb-1">{metric.name}</div>
                            <div className="opacity-60 mb-1">{metric.description}</div>
                            <div className="flex justify-between text-[10px] opacity-60">
                              <span>Source: {metric.source}</span>
                              <span>Update: {metric.dataQuality.updateFrequency}</span>
                            </div>
                          </div>
                        )}

                        {/* Metric Details Panel */}
                        {selectedMetricDetails === metric.id && (
                          <div className="mt-1 p-2 bg-background-light rounded text-[10px]">
                            <div className="mb-1">
                              <span className="font-medium">Source:</span>{' '}
                              <a 
                                href={metric.sourceLink} 
                                target="_blank" 
                                rel="noopener noreferrer"
                                className="text-accent-primary hover:underline"
                              >
                                {metric.source}
                              </a>
                            </div>
                            <div className="mb-1">
                              <span className="font-medium">Citation:</span>{' '}
                              <span className="opacity-60">{metric.citation}</span>
                            </div>
                            <div className="mb-1">
                              <span className="font-medium">Methodology:</span>{' '}
                              <span className="opacity-60">{metric.dataQuality.methodology}</span>
                            </div>
                            <div className="flex justify-between text-[10px] opacity-60">
                              <span>Sample Size: {metric.dataQuality.sampleSize}</span>
                              <span>Update Frequency: {metric.dataQuality.updateFrequency}</span>
                            </div>
                          </div>
                        )}

                        {/* Toggle Details Button */}
                        <button
                          onClick={() => toggleMetricDetails(metric.id)}
                          className="w-full text-right text-[10px] text-accent-primary hover:underline mt-0.5"
                        >
                          {selectedMetricDetails === metric.id ? 'Hide Details' : 'Show Details'}
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
} 