// pages/api/wellness-data.js
import { fetchCombinedWellnessData } from '../../utils/dataFetching';
import { groupMetricsByCategory, calculateDerivedMetrics, markSimulatedData } from '../../utils/dataFetching/dataMerger';

// Cache to avoid fetching data repeatedly
let cachedData = null;
let lastFetched = null;
const CACHE_DURATION = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

export default async function handler(req, res) {
  try {
    const { countries, metrics, refresh } = req.query;
    
    // Parse query parameters
    const selectedCountries = countries ? countries.split(',') : null;
    const selectedMetrics = metrics ? metrics.split(',') : null;
    const forceRefresh = refresh === 'true';
    
    // Check if we can use cached data
    const now = new Date();
    if (!forceRefresh && cachedData && lastFetched && (now - lastFetched) < CACHE_DURATION) {
      return sendFilteredResponse(res, cachedData, selectedCountries, selectedMetrics);
    }
    
    // Fetch fresh data
    console.log('Fetching fresh wellness data...');
    const data = await fetchCombinedWellnessData();
    
    // Apply additional transformations
    const categorizedData = groupMetricsByCategory(data);
    const enhancedData = calculateDerivedMetrics(categorizedData);
    const markedData = markSimulatedData(enhancedData);
    
    // Update cache
    cachedData = markedData;
    lastFetched = now;
    
    // Send response
    sendFilteredResponse(res, cachedData, selectedCountries, selectedMetrics);
  } catch (error) {
    console.error('API error:', error);
    res.status(500).json({ 
      error: 'Failed to fetch wellness data',
      message: error.message
    });
  }
}

/**
 * Filters the data based on selected countries and metrics
 * @param {Object} res - Express response object
 * @param {Object} data - Full dataset
 * @param {Array|null} selectedCountries - Countries to include (null = all)
 * @param {Array|null} selectedMetrics - Metrics to include (null = all)
 */
function sendFilteredResponse(res, data, selectedCountries, selectedMetrics) {
  if (!data) {
    return res.status(500).json({ error: 'No data available' });
  }
  
  // Filter by selected countries
  const countries = selectedCountries 
    ? data.countries.filter(country => selectedCountries.includes(country))
    : data.countries;
  
  // If no valid countries after filtering, return all countries
  const finalCountries = countries.length > 0 ? countries : data.countries;
  
  // If specific metrics are requested, filter them
  let filteredMetrics = {};
  if (selectedMetrics) {
    selectedMetrics.forEach(metricKey => {
      if (data.metrics[metricKey]) {
        filteredMetrics[metricKey] = {};
        // Include only selected countries for each metric
        finalCountries.forEach(country => {
          if (data.metrics[metricKey][country] !== undefined) {
            filteredMetrics[metricKey][country] = data.metrics[metricKey][country];
          }
        });
      }
    });
  } else {
    // If no specific metrics requested, include all but filter by country
    Object.entries(data.metrics).forEach(([metricKey, metricData]) => {
      filteredMetrics[metricKey] = {};
      finalCountries.forEach(country => {
        if (metricData[country] !== undefined) {
          filteredMetrics[metricKey][country] = metricData[country];
        }
      });
    });
  }
  
  // Filter sources to only include selected countries
  const filteredSources = {};
  finalCountries.forEach(country => {
    if (data.sources[country]) {
      filteredSources[country] = data.sources[country];
    }
  });
  
  // Filter categorized metrics if available
  let filteredCategorizedMetrics = null;
  if (data.categorizedMetrics) {
    filteredCategorizedMetrics = {};
    
    Object.entries(data.categorizedMetrics).forEach(([category, categoryMetrics]) => {
      filteredCategorizedMetrics[category] = {};
      
      Object.entries(categoryMetrics).forEach(([metricKey, metricData]) => {
        // Skip if specific metrics requested and this one isn't included
        if (selectedMetrics && !selectedMetrics.includes(metricKey)) {
          return;
        }
        
        filteredCategorizedMetrics[category][metricKey] = {};
        finalCountries.forEach(country => {
          if (metricData[country] !== undefined) {
            filteredCategorizedMetrics[category][metricKey][country] = metricData[country];
          }
        });
      });
    });
  }
  
  // Prepare the final response
  const response = {
    countries: finalCountries,
    metrics: filteredMetrics,
    sources: filteredSources
  };
  
  // Include categorized metrics if available
  if (filteredCategorizedMetrics) {
    response.categorizedMetrics = filteredCategorizedMetrics;
  }
  
  // Include country codes if available
  if (data.countryCodes) {
    response.countryCodes = {};
    finalCountries.forEach(country => {
      if (data.countryCodes[country]) {
        response.countryCodes[country] = data.countryCodes[country];
      }
    });
  }
  
  res.status(200).json(response);
}
