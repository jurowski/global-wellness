'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';
import { useQuery, gql } from '@apollo/client';

interface MetricAvailability {
  metric: string;
  isAvailable: boolean;
  source: string;
  lastUpdated?: string;
}

interface MetricCategory {
  id: string;
  name: string;
  icon: string;
  metrics: string[];
}

const GET_AVAILABLE_METRICS = gql`
  query GetAvailableMetrics($countries: [String!]!) {
    availableMetrics(countries: $countries) {
      metric
      isAvailable
      source
      lastUpdated
    }
  }
`;

const METRIC_CATEGORIES: MetricCategory[] = [
  {
    id: 'personal',
    name: 'Personal Well-being',
    icon: '😊',
    metrics: ['happiness']
  },
  {
    id: 'health',
    name: 'Health & Healthcare',
    icon: '🏥',
    metrics: ['healthcare']
  },
  {
    id: 'education',
    name: 'Education & Learning',
    icon: '📚',
    metrics: ['education']
  },
  {
    id: 'work',
    name: 'Work & Economic Well-being',
    icon: '💼',
    metrics: ['work_life']
  },
  {
    id: 'social',
    name: 'Social Connections & Community',
    icon: '👥',
    metrics: ['social_support']
  }
];

interface MetricSelectorProps {
  selectedMetrics: string[];
  onMetricSelect: (metric: string) => void;
  selectedCountries: string[];
}

export default function MetricSelector({ selectedMetrics, onMetricSelect, selectedCountries }: MetricSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['personal', 'health', 'education', 'work']));

  const { data: availabilityData } = useQuery(GET_AVAILABLE_METRICS, {
    variables: { countries: selectedCountries },
    skip: !selectedCountries.length
  });

  const metricAvailability = new Map<string, MetricAvailability>();
  availabilityData?.availableMetrics.forEach((metric: MetricAvailability) => {
    metricAvailability.set(metric.metric, metric);
  });

  const getMetricStatus = (metric: string) => {
    const availability = metricAvailability.get(metric);
    if (!availability) return { color: 'text-gray-500', text: 'Unknown' };
    
    switch (availability.source) {
      case 'real':
        return { color: 'text-green-500', text: 'Available (Real)' };
      case 'mock':
        return { color: 'text-yellow-500', text: 'Available (Mock)' };
      default:
        return { color: 'text-red-500', text: 'Unavailable' };
    }
  };

  const toggleCategory = (categoryId: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  };

  const filteredCategories = METRIC_CATEGORIES.filter(category =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    category.metrics.some(metric => metric.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="space-y-4">
      <div className="relative">
        <input
          type="text"
          placeholder="Search metrics..."
          className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="space-y-2">
        {filteredCategories.map((category) => (
          <div key={category.id} className="rounded-lg bg-gray-800/50 overflow-hidden">
            <button
              onClick={() => toggleCategory(category.id)}
              className="w-full px-4 py-3 flex items-center justify-between text-left hover:bg-gray-700/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <span className="text-xl">{category.icon}</span>
                <span className="font-medium">{category.name}</span>
                <span className="text-sm text-gray-400">
                  {category.metrics.filter(m => selectedMetrics.includes(m)).length} selected
                </span>
              </div>
              <ChevronDownIcon
                className={`w-5 h-5 transition-transform ${
                  expandedCategories.has(category.id) ? 'transform rotate-180' : ''
                }`}
              />
            </button>
            
            {expandedCategories.has(category.id) && (
              <div className="px-4 py-2 space-y-2">
                {category.metrics.map((metric) => {
                  const status = getMetricStatus(metric);
                  const isDisabled = status.text === 'Unavailable';
                  
                  return (
                    <label
                      key={metric}
                      className={`flex items-center justify-between py-1 ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
                      }`}
                    >
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={selectedMetrics.includes(metric)}
                          onChange={() => !isDisabled && onMetricSelect(metric)}
                          disabled={isDisabled}
                          className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700 disabled:opacity-50"
                        />
                        <span className="text-sm">
                          {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                      <span className={`text-xs ${status.color}`}>
                        {status.text}
                      </span>
                    </label>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 