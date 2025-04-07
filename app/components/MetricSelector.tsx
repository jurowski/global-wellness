'use client';

import { useState } from 'react';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

interface MetricCategory {
  id: string;
  name: string;
  icon: string;
  metrics: string[];
}

const METRIC_CATEGORIES: MetricCategory[] = [
  {
    id: 'personal',
    name: 'Personal Well-being',
    icon: '😊',
    metrics: ['happiness', 'life_satisfaction', 'mental_health']
  },
  {
    id: 'health',
    name: 'Health & Healthcare',
    icon: '🏥',
    metrics: ['healthcare', 'physical_health', 'healthcare_access']
  },
  {
    id: 'education',
    name: 'Education & Learning',
    icon: '📚',
    metrics: ['education', 'lifelong_learning', 'skill_development']
  },
  {
    id: 'work',
    name: 'Work & Economic Well-being',
    icon: '💼',
    metrics: ['work_life', 'income', 'job_satisfaction']
  },
  {
    id: 'environment',
    name: 'Environment & Sustainability',
    icon: '🌱',
    metrics: ['air_quality', 'green_spaces', 'sustainability']
  },
  {
    id: 'social',
    name: 'Social Connections & Community',
    icon: '👥',
    metrics: ['social_support', 'community_engagement', 'relationships']
  },
  {
    id: 'digital',
    name: 'Digital Well-being & Technology',
    icon: '💻',
    metrics: ['digital_access', 'online_safety', 'tech_literacy']
  },
  {
    id: 'cultural',
    name: 'Cultural & Creative Well-being',
    icon: '🎨',
    metrics: ['cultural_participation', 'creative_expression', 'arts_access']
  },
  {
    id: 'food',
    name: 'Food & Nutrition Well-being',
    icon: '🍎',
    metrics: ['food_security', 'nutrition_quality', 'sustainable_food']
  },
  {
    id: 'urban',
    name: 'Urban & Housing Well-being',
    icon: '🏘️',
    metrics: ['housing_quality', 'urban_planning', 'public_spaces']
  },
  {
    id: 'safety',
    name: 'Safety & Security Well-being',
    icon: '🛡️',
    metrics: ['personal_safety', 'financial_security', 'social_security']
  }
];

interface MetricSelectorProps {
  selectedMetrics: string[];
  onMetricSelect: (metric: string) => void;
}

export default function MetricSelector({ selectedMetrics, onMetricSelect }: MetricSelectorProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['personal', 'health', 'education', 'work']));

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
                {category.metrics.map((metric) => (
                  <label key={metric} className="flex items-center space-x-2 py-1">
                    <input
                      type="checkbox"
                      checked={selectedMetrics.includes(metric)}
                      onChange={() => onMetricSelect(metric)}
                      className="form-checkbox h-5 w-5 text-blue-500 rounded border-gray-600 bg-gray-700"
                    />
                    <span className="text-sm">
                      {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
} 