// components/DataSourcesInfo.js
import { useState } from 'react';
import { DATA_SOURCE_TYPE } from '../utils/dataFetching/dataSourceMarker';

export default function DataSourcesInfo({ wellnessData }) {
  const [showAll, setShowAll] = useState(false);
  
  if (!wellnessData || !wellnessData.sources) {
    return null;
  }
  
  // Collect all unique sources
  const uniqueSources = new Map();
  Object.entries(wellnessData.sources).forEach(([country, countrySources]) => {
    Object.entries(countrySources).forEach(([metric, source]) => {
      const sourceKey = `${source.name}|${source.url}`;
      if (!uniqueSources.has(sourceKey)) {
        uniqueSources.set(sourceKey, {
          name: source.name,
          url: source.url,
          year: source.year,
          source_type: source.source_type,
          metrics: [metric]
        });
      } else {
        // Add metric to existing source if not already included
        const currentSource = uniqueSources.get(sourceKey);
        if (!currentSource.metrics.includes(metric)) {
          currentSource.metrics.push(metric);
        }
      }
    });
  });
  
  // Convert to array and sort alphabetically by source name
  const sourcesList = Array.from(uniqueSources.values())
    .sort((a, b) => a.name.localeCompare(b.name));
  
  // Count metrics by source type
  const sourceCounts = {
    [DATA_SOURCE_TYPE.REAL]: 0,
    [DATA_SOURCE_TYPE.ESTIMATED]: 0,
    [DATA_SOURCE_TYPE.MOCK]: 0
  };
  
  sourcesList.forEach(source => {
    const sourceType = source.source_type || DATA_SOURCE_TYPE.MOCK;
    sourceCounts[sourceType] += 1;
  });

  // Filter list if not showing all
  const displaySources = showAll 
    ? sourcesList 
    : sourcesList.filter(source => source.source_type === DATA_SOURCE_TYPE.REAL);
  
  return (
    <div className="bg-white shadow rounded-lg p-6 mb-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Sources & Attribution</h2>
          <p className="text-gray-600 mt-1">
            This application combines data from multiple international sources to provide comprehensive wellness comparisons.
          </p>
        </div>
        <div className="mt-4 md:mt-0">
          <label className="relative inline-flex items-center cursor-pointer">
            <input 
              type="checkbox" 
              className="sr-only peer" 
              checked={showAll}
              onChange={() => setShowAll(!showAll)}
            />
            <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            <span className="ml-3 text-sm font-medium text-gray-900">Show simulated data sources</span>
          </label>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-green-50 rounded-lg p-4 border border-green-200">
          <div className="text-lg font-medium text-green-700">{sourceCounts[DATA_SOURCE_TYPE.REAL]}</div>
          <div className="text-sm text-green-600">Verified data sources</div>
          <div className="text-xs text-green-500 mt-1">Data from official international organizations</div>
        </div>
        
        <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
          <div className="text-lg font-medium text-yellow-700">{sourceCounts[DATA_SOURCE_TYPE.ESTIMATED]}</div>
          <div className="text-sm text-yellow-600">Estimated data sources</div>
          <div className="text-xs text-yellow-500 mt-1">Based on real data with some interpolation or estimation</div>
        </div>
        
        <div className="bg-red-50 rounded-lg p-4 border border-red-200">
          <div className="text-lg font-medium text-red-700">{sourceCounts[DATA_SOURCE_TYPE.MOCK]}</div>
          <div className="text-sm text-red-600">Simulated data sources</div>
          <div className="text-xs text-red-500 mt-1">Synthetic data used for demonstration purposes only</div>
        </div>
      </div>
      
      <div className="overflow-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Source
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Year
              </th>
              <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Metrics Provided
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {displaySources.map((source, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">
                  {source.url ? (
                    <a 
                      href={source.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {source.name}
                    </a>
                  ) : (
                    <span>{source.name}</span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                    source.source_type === DATA_SOURCE_TYPE.REAL 
                      ? 'bg-green-100 text-green-800' 
                      : source.source_type === DATA_SOURCE_TYPE.ESTIMATED
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-red-100 text-red-800'
                  }`}>
                    {source.source_type === DATA_SOURCE_TYPE.REAL 
                      ? 'Verified' 
                      : source.source_type === DATA_SOURCE_TYPE.ESTIMATED
                        ? 'Estimated'
                        : 'Simulated'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {source.year || 'N/A'}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  <div className="flex flex-wrap gap-1">
                    {source.metrics.slice(0, 3).map((metric, i) => (
                      <span 
                        key={i}
                        className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800"
                      >
                        {metric.replace(/_/g, ' ')}
                      </span>
                    ))}
                    {source.metrics.length > 3 && (
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-800">
                        +{source.metrics.length - 3} more
                      </span>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {!showAll && sourceCounts[DATA_SOURCE_TYPE.MOCK] + sourceCounts[DATA_SOURCE_TYPE.ESTIMATED] > 0 && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <p className="text-sm text-gray-700">
            <span className="font-medium">Note:</span> This application also uses {sourceCounts[DATA_SOURCE_TYPE.ESTIMATED]} estimated and {sourceCounts[DATA_SOURCE_TYPE.MOCK]} simulated data sources for demonstration purposes. 
            Toggle the switch above to view all data sources.
          </p>
        </div>
      )}
      
      <div className="mt-6 text-sm text-gray-500">
        <p>
          All data shown is either from verified international sources, estimated based on official data, 
          or simulated for demonstration purposes. Simulated data points are clearly marked in the visualizations
          and should not be used for research or decision-making purposes.
        </p>
      </div>
    </div>
  );
}
