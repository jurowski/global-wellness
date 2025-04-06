// utils/dataFetching/worldHappinessData.js
import axios from 'axios';
import Papa from 'papaparse';

const WORLD_HAPPINESS_DATA_URL = 'https://happiness-report.s3.amazonaws.com/2023/DataForFigure2.1.csv';
// Backup URL in case the main one is unavailable or changes
const BACKUP_DATA_URL = 'https://raw.githubusercontent.com/owid/happiness-and-life-satisfaction/main/happiness_and_life_satisfaction.csv';

/**
 * Fetches and processes data from the World Happiness Report
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} - Processed happiness data by country
 */
export async function fetchWorldHappinessData(options = {}) {
  try {
    // Try to fetch from primary source first
    let response;
    try {
      response = await axios.get(WORLD_HAPPINESS_DATA_URL, {
        responseType: 'text'
      });
    } catch (primaryError) {
      console.warn('Primary World Happiness data source unavailable, trying backup:', primaryError);
      response = await axios.get(BACKUP_DATA_URL, {
        responseType: 'text'
      });
    }
    
    // Parse CSV data
    const parsedData = Papa.parse(response.data, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true
    });
    
    // Transform the data into standardized format
    const transformedData = transformHappinessData(parsedData.data);
    
    return transformedData;
  } catch (error) {
    console.error('Error fetching World Happiness Report data:', error);
    // Return empty array instead of null to make merging easier
    return [];
  }
}

/**
 * Transforms raw World Happiness Report data into standardized format
 * @param {Array} rawData - Raw data from CSV parsing
 * @returns {Array} - Transformed data array
 */
function transformHappinessData(rawData) {
  // Get most recent data by country (using the latest year available)
  const countryData = {};
  
  rawData.forEach(row => {
    // Skip rows without country names
    if (!row.Country && !row.country) return;
    
    const countryName = row.Country || row.country;
    const year = row.Year || row.year;
    
    // Process each country, keeping the most recent data
    if (!countryData[countryName] || 
        (year && countryData[countryName].year && year > countryData[countryName].year)) {
      
      countryData[countryName] = {
        country: countryName,
        countryCode: row['Country code'] || row.countryCode || null,
        region: row.Region || row.region || null,
        metrics: {
          happiness: row['Life Ladder'] || row['Happiness score'] || null,
          gdp_per_capita: row['Log GDP per capita'] || row.gdp_per_capita || null,
          social_support: row['Social support'] || row.social_support || null,
          healthy_life_expectancy: row['Healthy life expectancy at birth'] || row.healthy_life_expectancy || null,
          freedom: row['Freedom to make life choices'] || row.freedom || null,
          generosity: row.Generosity || row.generosity || null,
          corruption: row['Perceptions of corruption'] || row.corruption || null
        },
        year: year
      };
    }
  });
  
  // Convert to array and add source attribution
  return Object.values(countryData).map(country => ({
    ...country,
    source: {
      happiness: {
        name: 'World Happiness Report',
        url: 'https://worldhappiness.report',
        year: country.year
      },
      social_support: {
        name: 'World Happiness Report',
        url: 'https://worldhappiness.report',
        year: country.year
      },
      freedom: {
        name: 'World Happiness Report',
        url: 'https://worldhappiness.report',
        year: country.year
      },
      generosity: {
        name: 'World Happiness Report',
        url: 'https://worldhappiness.report',
        year: country.year
      },
      corruption: {
        name: 'World Happiness Report',
        url: 'https://worldhappiness.report',
        year: country.year
      }
    }
  }));
}
