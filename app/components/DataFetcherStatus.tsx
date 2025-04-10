'use client';

import { useState, useEffect } from 'react';
import { countryProfiles } from '../api/wellness-data/route';
import { stateData } from '../api/state-wellness-data/route';

interface FetcherStatus {
  name: string;
  lastFetch: string;
  status: 'active' | 'inactive' | 'error';
  isEnabled: boolean;
  coverage: string;
  metrics: string[];
  dataType: 'country' | 'state';
}

// Get unique data sources and their metrics from country profiles
const getCountryDataSources = () => {
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
    metrics: Array.from(metrics),
    dataType: 'country' as const
  }));
};

// Get unique data sources and their metrics from state data
const getStateDataSources = () => {
  const sources = new Map<string, Set<string>>();
  
  if (!stateData || !Array.isArray(stateData)) {
    return [];
  }
  
  stateData.forEach((state: any) => {
    Object.entries(state).forEach(([key, value]) => {
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
    metrics: Array.from(metrics),
    dataType: 'state' as const
  }));
};

export default function DataFetcherStatus() {
  const [fetcherStatuses, setFetcherStatuses] = useState<FetcherStatus[]>([]);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Initialize with data sources
    const countryDataSources = getCountryDataSources();
    const stateDataSources = getStateDataSources();
    
    const countryStatuses = countryDataSources.map(({ name, metrics, dataType }) => {
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
        metrics,
        dataType
      };
    });
    
    const stateStatuses = stateDataSources.map(({ name, metrics, dataType }) => {
      const stateCount = stateData.filter((state: any) => 
        Object.values(state).some(value => 
          value && typeof value === 'object' && 'source' in value && value.source === name
        )
      ).length;
      
      return {
        name,
        lastFetch: new Date().toLocaleDateString(),
        status: 'active' as const,
        isEnabled: true,
        coverage: `${stateCount}/${stateData.length} states`,
        metrics,
        dataType
      };
    });

    setFetcherStatuses([...countryStatuses, ...stateStatuses]);
  }, []);

  const toggleFetcher = (name: string, dataType: 'country' | 'state') => {
    setFetcherStatuses(prev => 
      prev.map(status => 
        status.name === name && status.dataType === dataType
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

  const countryFetchers = fetcherStatuses.filter(status => status.dataType === 'country');
  const stateFetchers = fetcherStatuses.filter(status => status.dataType === 'state');

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
      
      <h3 className="text-lg font-semibold mt-6 mb-3">Global Country Data Sources</h3>
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
            {countryFetchers.map((status) => (
              <tr key={`country-${status.name}`} className="hover:bg-gray-50">
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
                        onChange={() => toggleFetcher(status.name, 'country')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                )}
              </tr>
            ))}
            {countryFetchers.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No country data sources available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <h3 className="text-lg font-semibold mt-6 mb-3">US State Data Sources</h3>
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
            {stateFetchers.map((status) => (
              <tr key={`state-${status.name}`} className="hover:bg-gray-50">
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
                        onChange={() => toggleFetcher(status.name, 'state')}
                      />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </td>
                )}
              </tr>
            ))}
            {stateFetchers.length === 0 && (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-4 text-center text-sm text-gray-500">
                  No state data sources available
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
} 