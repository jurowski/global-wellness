// utils/dataFetching/whoData.js
import axios from 'axios';
import Papa from 'papaparse';

// WHO provides various APIs and data downloads
// Global Health Observatory API
const WHO_GHO_API = 'https://ghoapi.azureedge.net/api';

// For downloading CSV data directly
const WHO_UHC_DATA_URL = 'https://ghoapi.azureedge.net/api/UHC_INDEX_REPORTED';

/**
 * Fetches healthcare data from WHO data sources
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} - Processed WHO data by country
 */
export async function fetchWHOData(options = {}) {
  try {
    // Fetch Universal Health Coverage data
    const uhcData = await fetchUniversalHealthCoverageData();
    
    // Fetch health expenditure data
    const healthExpData = await fetchHealthExpenditureData();
    
    // Fetch life expectancy data
    const lifeExpData = await fetchLifeExpectancyData();
    
    // Fetch healthcare workforce data
    const workforceData = await fetchHealthcareWorkforceData();
    
    // Merge all WHO datasets
    const mergedData = mergeWHODatasets(
      uhcData, 
      healthExpData, 
      lifeExpData, 
      workforceData
    );
    
    return mergedData;
  } catch (error) {
    console.error('Error fetching WHO data:', error);
    return [];
  }
}

/**
 * Fetches Universal Health Coverage (UHC) data
 * @returns {Promise<Array>} - UHC data by country
 */
async function fetchUniversalHealthCoverageData() {
  try {
    // In a real implementation, you would fetch this data from WHO
    // Either via API or downloading and parsing CSV/JSON files
    
    // For this example, we'll simulate some parsed UHC data
    // based on actual WHO UHC indicators
    
    const simulatedData = [
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          uhc_index: 82.5, // Universal Health Coverage index 0-100
          financial_protection: 65.4, // Protection from catastrophic health expenditure
          essential_services: 88.9, // Coverage of essential health services
        },
        year: 2021
      },
      {
        country: 'United Kingdom',
        countryCode: 'GBR',
        metrics: {
          uhc_index: 87.6,
          financial_protection: 92.3,
          essential_services: 90.2,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          uhc_index: 91.2,
          financial_protection: 94.5,
          essential_services: 92.8,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          uhc_index: 89.8,
          financial_protection: 90.1,
          essential_services: 91.5,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          uhc_index: 90.3,
          financial_protection: 93.8,
          essential_services: 90.9,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        uhc_index: {
          name: 'WHO Universal Health Coverage Index',
          url: 'https://www.who.int/data/gho/data/themes/universal-health-coverage',
          year: country.year
        },
        financial_protection: {
          name: 'WHO Financial Protection Indicators',
          url: 'https://www.who.int/data/gho/data/themes/financial-protection',
          year: country.year
        },
        essential_services: {
          name: 'WHO Essential Health Services Coverage',
          url: 'https://www.who.int/data/gho/data/themes/universal-health-coverage',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching UHC data:', error);
    return [];
  }
}

/**
 * Fetches health expenditure data
 * @returns {Promise<Array>} - Health expenditure data by country
 */
async function fetchHealthExpenditureData() {
  try {
    // Simulate health expenditure data
    const simulatedData = [
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          health_expenditure_pct_gdp: 18.8, // % of GDP
          health_expenditure_per_capita: 12530, // USD
          govt_health_expenditure: 50.2, // % of total health expenditure from government
          out_of_pocket: 10.8, // % out-of-pocket spending
        },
        year: 2021
      },
      {
        country: 'United Kingdom',
        countryCode: 'GBR',
        metrics: {
          health_expenditure_pct_gdp: 12.1,
          health_expenditure_per_capita: 5387,
          govt_health_expenditure: 78.8,
          out_of_pocket: 16.7,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          health_expenditure_pct_gdp: 10.9,
          health_expenditure_per_capita: 4823,
          govt_health_expenditure: 84.1,
          out_of_pocket: 12.8,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          health_expenditure_pct_gdp: 12.8,
          health_expenditure_per_capita: 6731,
          govt_health_expenditure: 85.3,
          out_of_pocket: 12.3,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          health_expenditure_pct_gdp: 9.5,
          health_expenditure_per_capita: 4578,
          govt_health_expenditure: 77.4,
          out_of_pocket: 19.2,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        health_expenditure_pct_gdp: {
          name: 'WHO Global Health Expenditure Database',
          url: 'https://apps.who.int/nha/database',
          year: country.year
        },
        health_expenditure_per_capita: {
          name: 'WHO Global Health Expenditure Database',
          url: 'https://apps.who.int/nha/database',
          year: country.year
        },
        govt_health_expenditure: {
          name: 'WHO Global Health Expenditure Database',
          url: 'https://apps.who.int/nha/database',
          year: country.year
        },
        out_of_pocket: {
          name: 'WHO Global Health Expenditure Database',
          url: 'https://apps.who.int/nha/database',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching health expenditure data:', error);
    return [];
  }
}

/**
 * Fetches life expectancy data
 * @returns {Promise<Array>} - Life expectancy data by country
 */
async function fetchLifeExpectancyData() {
  try {
    // Simulate life expectancy data
    const simulatedData = [
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          life_expectancy: 76.1, // years
          healthy_life_expectancy: 65.2, // years in good health
          gender_gap_life_exp: 5.7, // years difference between female and male
        },
        year: 2021
      },
      {
        country: 'United Kingdom',
        countryCode: 'GBR',
        metrics: {
          life_expectancy: 80.9,
          healthy_life_expectancy: 69.3,
          gender_gap_life_exp: 3.6,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          life_expectancy: 84.3,
          healthy_life_expectancy: 74.1,
          gender_gap_life_exp: 6.3,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          life_expectancy: 80.6,
          healthy_life_expectancy: 69.5,
          gender_gap_life_exp: 4.8,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          life_expectancy: 81.7,
          healthy_life_expectancy: 71.2,
          gender_gap_life_exp: 5.5,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        life_expectancy: {
          name: 'WHO Global Health Observatory',
          url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/life-expectancy-at-birth-(years)',
          year: country.year
        },
        healthy_life_expectancy: {
          name: 'WHO Global Health Observatory',
          url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/healthy-life-expectancy-(hale)-at-birth-(years)',
          year: country.year
        },
        gender_gap_life_exp: {
          name: 'WHO Global Health Observatory',
          url: 'https://www.who.int/data/gho/data/indicators',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching life expectancy data:', error);
    return [];
  }
}

/**
 * Fetches healthcare workforce data
 * @returns {Promise<Array>} - Healthcare workforce data by country
 */
async function fetchHealthcareWorkforceData() {
  try {
    // Simulate healthcare workforce data
    const simulatedData = [
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          physicians_per_1000: 2.6, // physicians per 1000 population
          nurses_per_1000: 15.7, // nurses and midwives per 1000 population
          hospital_beds_per_1000: 2.9, // hospital beds per 1000 population
        },
        year: 2020
      },
      {
        country: 'United Kingdom',
        countryCode: 'GBR',
        metrics: {
          physicians_per_1000: 2.8,
          nurses_per_1000: 8.2,
          hospital_beds_per_1000: 2.5,
        },
        year: 2020
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          physicians_per_1000: 2.5,
          nurses_per_1000: 12.2,
          hospital_beds_per_1000: 13.1,
        },
        year: 2020
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          physicians_per_1000: 4.3,
          nurses_per_1000: 13.9,
          hospital_beds_per_1000: 8.0,
        },
        year: 2020
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          physicians_per_1000: 3.2,
          nurses_per_1000: 14.3,
          hospital_beds_per_1000: 3.3,
        },
        year: 2020
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        physicians_per_1000: {
          name: 'WHO Global Health Workforce Statistics',
          url: 'https://www.who.int/data/gho/data/themes/topics/health-workforce',
          year: country.year
        },
        nurses_per_1000: {
          name: 'WHO Global Health Workforce Statistics',
          url: 'https://www.who.int/data/gho/data/themes/topics/health-workforce',
          year: country.year
        },
        hospital_beds_per_1000: {
          name: 'WHO Global Health Observatory',
          url: 'https://www.who.int/data/gho/data/indicators/indicator-details/GHO/hospital-beds-(per-10-000-population)',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching healthcare workforce data:', error);
    return [];
  }
}

/**
 * Merges multiple WHO datasets into one unified dataset
 * @param {...Array} datasets - WHO datasets to merge
 * @returns {Array} - Merged dataset
 */
function mergeWHODatasets(...datasets) {
  const mergedCountries = {};
  
  // Process each dataset
  datasets.forEach(dataset => {
    dataset.forEach(countryData => {
      const countryName = countryData.country;
      
      // Initialize country if not exists
      if (!mergedCountries[countryName]) {
        mergedCountries[countryName] = {
          country: countryName,
          countryCode: countryData.countryCode,
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