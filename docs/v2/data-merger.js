// utils/dataFetching/dataMerger.js
import { markDataSources } from './dataSourceMarker';

// Country name standardization mapping
const COUNTRY_NAME_MAPPING = {
  'United States of America': 'United States',
  'USA': 'United States',
  'US': 'United States',
  'UK': 'United Kingdom',
  'Great Britain': 'United Kingdom',
  'Republic of Korea': 'South Korea',
  'Korea, Republic of': 'South Korea',
  'Russian Federation': 'Russia',
  'UAE': 'United Arab Emirates',
  'Czechia': 'Czech Republic',
  // Add more as needed
};

/**
 * Merges data from multiple sources into a unified dataset
 * @param {Object} sources - Object containing arrays of data from different sources
 * @returns {Object} - Merged data organized by country and metrics
 */
export function mergeDataSources(sources) {
  const { 
    happinessData = [], 
    oecdData = [], 
    whoData = [], 
    unData = [], 
    worldBankData = [] 
  } = sources;
  
  // Step 1: Standardize country names across all datasets
  const standardizedData = {
    happinessData: standardizeCountryNames(happinessData),
    oecdData: standardizeCountryNames(oecdData),
    whoData: standardizeCountryNames(whoData),
    unData: standardizeCountryNames(unData),
    worldBankData: standardizeCountryNames(worldBankData)
  };
  
  // Step 2: Create a master list of all countries from all datasets
  const allCountries = new Set();
  Object.values(standardizedData).forEach(dataset => {
    dataset.forEach(countryData => {
      allCountries.add(countryData.country);
    });
  });
  
  // Step 3: Build the merged dataset
  const countriesData = {};
  const countriesList = Array.from(allCountries);
  
  // Initialize the data structure for each country
  countriesList.forEach(country => {
    countriesData[country] = {
      country,
      countryCode: null, // Will be populated from any dataset that has it
      metrics: {},
      sources: {}
    };
  });
  
  // Merge data from each source
  Object.entries(standardizedData).forEach(([sourceKey, dataset]) => {
    dataset.forEach(countryData => {
      const country = countryData.country;
      
      // Skip if country isn't in our master list (shouldn't happen after standardization)
      if (!countriesData[country]) return;
      
      // Set country code if available
      if (countryData.countryCode && !countriesData[country].countryCode) {
        countriesData[country].countryCode = countryData.countryCode;
      }
      
      // Merge metrics
      if (countryData.metrics) {
        Object.entries(countryData.metrics).forEach(([metricKey, value]) => {
          countriesData[country].metrics[metricKey] = value;
        });
      }
      
      // Merge sources
      if (countryData.source) {
        Object.entries(countryData.source).forEach(([metricKey, source]) => {
          countriesData[country].sources[metricKey] = source;
        });
      }
    });
  });
  
  // Step 4: Normalize and format the data for the frontend
  const result = formatDataForFrontend(countriesData);
  
  return result;
}

/**
 * Standardizes country names across datasets
 * @param {Array} dataset - Array of country data objects
 * @returns {Array} - Dataset with standardized country names
 */
function standardizeCountryNames(dataset) {
  return dataset.map(countryData => {
    const standardizedName = COUNTRY_NAME_MAPPING[countryData.country] || countryData.country;
    return {
      ...countryData,
      country: standardizedName
    };
  });
}

/**
 * Formats the merged data for frontend consumption
 * @param {Object} countriesData - Raw merged data by country
 * @returns {Object} - Formatted data for the frontend
 */
function formatDataForFrontend(countriesData) {
  // Get all unique metric keys
  const allMetrics = new Set();
  Object.values(countriesData).forEach(countryData => {
    Object.keys(countryData.metrics).forEach(metric => {
      allMetrics.add(metric);
    });
  });
  
  // Create a list of countries with complete data
  const countries = Object.keys(countriesData);
  
  // Format metric data into the structure expected by the frontend
  const metrics = {};
  Array.from(allMetrics).forEach(metricKey => {
    metrics[metricKey] = {};
    
    countries.forEach(country => {
      if (countriesData[country].metrics[metricKey] !== undefined) {
        metrics[metricKey][country] = countriesData[country].metrics[metricKey];
      }
    });
  });
  
  // Include source information for traceability
  const sources = {};
  countries.forEach(country => {
    sources[country] = countriesData[country].sources || {};
  });
  
  // Create the final formatted object
  return {
    countries,
    metrics,
    sources,
    countryCodes: countries.reduce((acc, country) => {
      acc[country] = countriesData[country].countryCode;
      return acc;
    }, {})
  };
}

/**
 * Groups metrics by category for better organization
 * @param {Object} mergedData - The merged data from all sources
 * @returns {Object} - Data with metrics grouped by category
 */
export function groupMetricsByCategory(mergedData) {
  const categories = {
    happiness: [
      'happiness', 
      'life_satisfaction'
    ],
    health: [
      'healthy_life_expectancy', 
      'life_expectancy', 
      'uhc_index', 
      'health_expenditure_pct_gdp',
      'health_expenditure_per_capita',
      'govt_health_expenditure',
      'out_of_pocket',
      'physicians_per_1000',
      'nurses_per_1000',
      'hospital_beds_per_1000'
    ],
    education: [
      'education_index',
      'expected_years_schooling',
      'mean_years_schooling',
      'education_expenditure',
      'pupil_teacher_ratio_primary',
      'tertiary_enrollment'
    ],
    work_life: [
      'work_life_balance',
      'working_hours',
      'time_off',
      'leisure_time',
      'unemployment',
      'youth_unemployment',
      'labor_force_participation',
      'long_term_unemployment'
    ],
    economy: [
      'gdp_per_capita',
      'gdp_growth',
      'inflation',
      'tax_revenue_pct_gdp',
      'current_account_balance',
      'gni_per_capita'
    ],
    inequality: [
      'gini_index',
      'income_share_top_10',
      'income_share_bottom_40',
      'poverty_ratio',
      'wealth_inequality',
      'gender_inequality_index',
      'female_labor_participation',
      'female_seats_parliament'
    ],
    social: [
      'social_support',
      'community',
      'freedom',
      'generosity',
      'corruption',
      'safety',
      'civic_engagement'
    ],
    innovation: [
      'research_expenditure',
      'researchers_per_million',
      'scientific_articles',
      'patent_applications',
      'internet_users'
    ],
    environment: [
      'environmental'
    ]
  };
  
  // Create the categorized structure
  const categorizedMetrics = {};
  
  Object.entries(categories).forEach(([category, metricKeys]) => {
    categorizedMetrics[category] = {};
    
    metricKeys.forEach(metricKey => {
      if (mergedData.metrics[metricKey]) {
        categorizedMetrics[category][metricKey] = mergedData.metrics[metricKey];
      }
    });
  });
  
  return {
    ...mergedData,
    categorizedMetrics
  };
}

/**
 * Calculates derived metrics based on existing metrics
 * @param {Object} mergedData - The merged data from all sources
 * @returns {Object} - Data with additional derived metrics
 */
export function calculateDerivedMetrics(mergedData) {
  const { metrics, countries } = mergedData;
  const derivedMetrics = {};
  
  // Example: Calculate a "healthcare efficiency" metric
  // based on life expectancy relative to health expenditure
  if (metrics.life_expectancy && metrics.health_expenditure_pct_gdp) {
    derivedMetrics.healthcare_efficiency = {};
    
    countries.forEach(country => {
      if (metrics.life_expectancy[country] && metrics.health_expenditure_pct_gdp[country]) {
        // Simple formula: life expectancy / health expenditure percentage
        // Higher values indicate more life expectancy per unit of spending
        derivedMetrics.healthcare_efficiency[country] = 
          metrics.life_expectancy[country] / metrics.health_expenditure_pct_gdp[country];
      }
    });
  }
  
  // Example: Calculate a "work-life balance score"
  if (metrics.working_hours && metrics.leisure_time) {
    derivedMetrics.work_life_balance_score = {};
    
    countries.forEach(country => {
      if (metrics.working_hours[country] && metrics.leisure_time[country]) {
        // Invert working hours (less is better) and normalize to 0-100 scale
        const workingHoursComponent = 100 - ((metrics.working_hours[country] / 3000) * 100);
        // Normalize leisure time to 0-100 scale (assuming 120 min is max)
        const leisureTimeComponent = (metrics.leisure_time[country] / 120) * 100;
        
        // Average the two components
        derivedMetrics.work_life_balance_score[country] = 
          (workingHoursComponent + leisureTimeComponent) / 2;
      }
    });
  }
  
  // Format the merged data for frontend consumption
  return {
    ...mergedData,
    metrics: {
      ...metrics,
      ...derivedMetrics
    }
  };
}

/**
 * Explicitly marks data sources that are simulated
 * @param {Object} data - The complete data object
 * @returns {Object} - Data with source simulation indicators
 */
export function markSimulatedData(data) {
  // Mark all our simulated data sources
  return markDataSources(data);
}
