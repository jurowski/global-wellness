// utils/dataFetching/oecdData.js
import axios from 'axios';

// OECD provides a SDMX REST API for data access: https://data.oecd.org/api/
const OECD_API_BASE = 'https://stats.oecd.org/SDMX-JSON/data';

// Better Life Index dataset
const BETTER_LIFE_INDEX_DATASET = 'BLI';

// Country mappings for standardization
const COUNTRY_MAPPINGS = {
  'United States': 'USA',
  'Russian Federation': 'Russia',
  'Korea': 'South Korea',
  // Add more as needed
};

/**
 * Fetches data from the OECD Better Life Index 
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} - Processed OECD data by country
 */
export async function fetchOECDData(options = {}) {
  try {
    // For Better Life Index data
    const bliResponse = await fetchBetterLifeIndexData();
    
    // For work-life balance specific metrics
    const workLifeResponse = await fetchWorkLifeBalanceData();
    
    // Merge all OECD datasets
    const mergedData = mergeOECDDatasets(bliResponse, workLifeResponse);
    
    return mergedData;
  } catch (error) {
    console.error('Error fetching OECD data:', error);
    return [];
  }
}

/**
 * Fetches Better Life Index data
 * @returns {Promise<Array>} - BLI data
 */
async function fetchBetterLifeIndexData() {
  try {
    // If using the OECD API directly (requires registration for full access)
    // const response = await axios.get(`${OECD_API_BASE}/${BETTER_LIFE_INDEX_DATASET}/all/all/latest`);
    
    // Alternative: Use their static JSON data which is publicly available
    const response = await axios.get('https://stats.oecd.org/Index.aspx?DataSetCode=BLI', {
      responseType: 'text'
    });
    
    // In a real implementation, you would need to parse the HTML to extract the data
    // For this example, we'll simulate some parsed BLI data
    
    // Simulated data based on actual BLI indicators
    const simulatedData = [
      {
        country: 'Australia',
        metrics: {
          work_life_balance: 78.5,
          life_satisfaction: 83.9,
          community: 92.1,
          education: 80.5,
          environment: 75.2,
          civic_engagement: 86.4,
          health: 85.7,
          housing: 64.3,
          income: 71.2,
          jobs: 82.6,
          safety: 89.5
        },
        year: 2023
      },
      {
        country: 'United States',
        metrics: {
          work_life_balance: 62.3,
          life_satisfaction: 76.5,
          community: 82.7,
          education: 78.2,
          environment: 70.1,
          civic_engagement: 71.9,
          health: 79.3,
          housing: 68.7,
          income: 78.9,
          jobs: 80.5,
          safety: 74.2
        },
        year: 2023
      },
      {
        country: 'Finland',
        metrics: {
          work_life_balance: 87.2,
          life_satisfaction: 89.3,
          community: 90.7,
          education: 86.5,
          environment: 88.2,
          civic_engagement: 76.4,
          health: 83.5,
          housing: 77.3,
          income: 74.1,
          jobs: 81.5,
          safety: 92.8
        },
        year: 2023
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      // Standardize country names if needed
      country: COUNTRY_MAPPINGS[country.country] || country.country,
      source: {
        work_life_balance: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        life_satisfaction: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        community: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        education: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        environment: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        civic_engagement: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        health: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        housing: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        income: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        jobs: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        },
        safety: { 
          name: 'OECD Better Life Index',
          url: 'https://www.oecdbetterlifeindex.org',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching Better Life Index data:', error);
    return [];
  }
}

/**
 * Fetches specific work-life balance data
 * @returns {Promise<Array>} - Work-life balance data
 */
async function fetchWorkLifeBalanceData() {
  try {
    // In a real implementation, you would fetch from a specific OECD endpoint
    // For this example, we'll simulate work-life balance specific data
    
    const simulatedData = [
      {
        country: 'Australia',
        metrics: {
          working_hours: 1728, // annual working hours
          time_off: 28, // days of paid leave and holidays
          leisure_time: 62.3, // daily leisure time in minutes
        },
        year: 2023
      },
      {
        country: 'United States',
        metrics: {
          working_hours: 1791,
          time_off: 15,
          leisure_time: 55.1,
        },
        year: 2023
      },
      {
        country: 'Finland',
        metrics: {
          working_hours: 1632,
          time_off: 36,
          leisure_time: 68.7,
        },
        year: 2023
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      // Standardize country names if needed
      country: COUNTRY_MAPPINGS[country.country] || country.country,
      source: {
        working_hours: { 
          name: 'OECD Employment Outlook',
          url: 'https://www.oecd.org/employment/outlook/',
          year: country.year
        },
        time_off: { 
          name: 'OECD Employment Outlook',
          url: 'https://www.oecd.org/employment/outlook/',
          year: country.year
        },
        leisure_time: { 
          name: 'OECD Time Use Database',
          url: 'https://www.oecd.org/social/family/database.htm',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching work-life balance data:', error);
    return [];
  }
}

/**
 * Merges multiple OECD datasets into one unified dataset
 * @param {...Array} datasets - OECD datasets to merge
 * @returns {Array} - Merged dataset
 */
function mergeOECDDatasets(...datasets) {
  const mergedCountries = {};
  
  // Process each dataset
  datasets.forEach(dataset => {
    dataset.forEach(countryData => {
      const countryName = countryData.country;
      
      // Initialize country if not exists
      if (!mergedCountries[countryName]) {
        mergedCountries[countryName] = {
          country: countryName,
          metrics: {},
          source: {}
        };
      }
      
      // Merge metrics
      if (countryData.metrics) {
        mergedCountries[countryName].metrics = {
          ...mergedCountries[countryName].metrics,
          ...countryData.metrics
        };
      }
      
      // Merge sources
      if (countryData.source) {
        mergedCountries[countryName].source = {
          ...mergedCountries[countryName].source,
          ...countryData.source
        };
      }
      
      // Use the most recent year
      if (countryData.year) {
        if (!mergedCountries[countryName].year || countryData.year > mergedCountries[countryName].year) {
          mergedCountries[countryName].year = countryData.year;
        }
      }
    });
  });
  
  return Object.values(mergedCountries);
}
