'use client';

import { useState, useEffect } from 'react';
import { countryProfiles } from '../api/wellness-data/route';

interface FetcherStatus {
  name: string;
  lastFetch: string;
  status: 'active' | 'inactive' | 'error';
  isEnabled: boolean;
  coverage: string;
  metrics: string[];
}

// Get unique data sources and their metrics from country profiles
const getDataSources = () => {
  const sources = new Map<string, Set<string>>();
  
  Object.values(countryProfiles).forEach(country => {
    Object.entries(country).forEach(([key, value]) => {
      if (value && typeof value === 'object' && 'source' in value) {
        const metric = value as { source: string; category: string; isRealData: boolean };
        if (!sources.has(metric.source)) {
          sources.set(metric.source, new Set());
        }
        sources.get(metric.source)?.add(metric.category);
      }
    });
  });

  return Array.from(sources.entries()).map(([source, metrics]) => ({
    name: source,
    metrics: Array.from(metrics)
  }));
};

export default function DataFetcherStatus() {
  const [fetcherStatuses, setFetcherStatuses] = useState<FetcherStatus[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize with real data sources
    const dataSources = getDataSources();
    const initialStatuses = dataSources.map(({ name, metrics }) => {
      const countryCount = Object.values(countryProfiles).filter(country => 
        Object.values(country).some(value => 
          value && typeof value === 'object' && 'source' in value && value.source === name
        )
      ).length;
      
      return {
        name,
        lastFetch: new Date().toLocaleDateString(),
        status: 'active' as const,
        isEnabled: true,
        coverage: `${countryCount}/${Object.keys(countryProfiles).length} countries`,
        metrics
      };
    });

    setFetcherStatuses(initialStatuses);
  }, []);

  const toggleFetcher = (name: string) => {
    setFetcherStatuses(prev => 
      prev.map(status => 
        status.name === name 
          ? { ...status, isEnabled: !status.isEnabled }
          : status
      )
    );
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500';
      case 'error':
        return 'bg-red-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Data Fetcher Status</h2>
        <button
          onClick={() => setIsAdmin(!isAdmin)}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          {isAdmin ? 'Exit Admin Mode' : 'Enter Admin Mode'}
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data Source
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Last Update
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Coverage
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metrics
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              {isAdmin && (
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Enabled
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {fetcherStatuses.map((status) => (
              <tr key={status.name} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {status.name}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {status.lastFetch}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {status.coverage}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {status.metrics.join(', ')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(status.status)} text-white`}>
                    {status.status}
                  </span>
                </td>
                {isAdmin && (
                  <td className="px-6 py-4 whitespace-nowrap">
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        className="sr-only peer"
                        checked={status.isEnabled}
                        onChange={() => toggleFetcher(status.name)}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
} 