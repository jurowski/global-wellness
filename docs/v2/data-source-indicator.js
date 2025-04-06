// utils/dataFetching/dataSourceMarker.js

/**
 * Enumeration of data source types
 */
export const DATA_SOURCE_TYPE = {
  REAL: 'real',      // Real data from authenticated source
  ESTIMATED: 'estimated', // Estimated based on real data with modifications
  MOCK: 'mock'       // Completely simulated mock data
};

/**
 * Marks data sources with their validity status
 * @param {Object} data - The merged data from all sources
 * @returns {Object} - Same data with source validity indicators
 */
export function markDataSources(data) {
  const { metrics, sources } = data;
  const markedSources = { ...sources };
  
  // Mark mock/simulated data sources based on URL patterns
  Object.keys(markedSources).forEach(country => {
    Object.keys(markedSources[country]).forEach(metricKey => {
      const source = markedSources[country][metricKey];
      
      // Add source_type field to each source object
      if (!source.url || source.url.includes('example.com')) {
        // No URL or example URL indicates mock data
        markedSources[country][metricKey].source_type = DATA_SOURCE_TYPE.MOCK;
      } else if (source.url && source.simulated) {
        // Explicitly marked as simulated
        markedSources[country][metricKey].source_type = DATA_SOURCE_TYPE.ESTIMATED;
      } else {
        // Has a valid URL, assumed to be real data
        markedSources[country][metricKey].source_type = DATA_SOURCE_TYPE.REAL;
      }
      
      // Update for simulated data files
      if (source.name && source.name.includes('Simulated')) {
        markedSources[country][metricKey].source_type = DATA_SOURCE_TYPE.MOCK;
      }
    });
  });
  
  // Add source validity indicators to metrics themselves
  const markedMetrics = {};
  Object.keys(metrics).forEach(metricKey => {
    markedMetrics[metricKey] = {};
    
    Object.keys(metrics[metricKey]).forEach(country => {
      // Copy the original value
      markedMetrics[metricKey][country] = {
        value: metrics[metricKey][country]
      };
      
      // Add source type if available
      if (markedSources[country] && 
          markedSources[country][metricKey] && 
          markedSources[country][metricKey].source_type) {
        markedMetrics[metricKey][country].source_type = 
          markedSources[country][metricKey].source_type;
      } else {
        // Default to mock if no source information
        markedMetrics[metricKey][country].source_type = DATA_SOURCE_TYPE.MOCK;
      }
    });
  });
  
  return {
    ...data,
    metrics: markedMetrics,
    sources: markedSources
  };
}
