// utils/dataFetching/index.js
import { fetchWorldHappinessData } from './worldHappinessData';
import { fetchOECDData } from './oecdData';
import { fetchWHOData } from './whoData';
import { fetchUNData } from './unData';
import { fetchWorldBankData } from './worldBankData';
import { mergeDataSources } from './dataMerger';

/**
 * Fetches data from all sources and merges them by country
 * @param {Object} options - Configuration options for data fetching
 * @returns {Promise<Object>} - Combined dataset organized by country
 */
export async function fetchCombinedWellnessData(options = {}) {
  try {
    // Initialize fetching from all data sources in parallel
    const [
      happinessData,
      oecdData,
      whoData,
      unData,
      worldBankData
    ] = await Promise.all([
      fetchWorldHappinessData(options),
      fetchOECDData(options),
      fetchWHOData(options),
      fetchUNData(options),
      fetchWorldBankData(options)
    ]);
    
    // Merge all datasets by country
    const combinedData = mergeDataSources({
      happinessData,
      oecdData,
      whoData,
      unData,
      worldBankData
    });
    
    return combinedData;
  } catch (error) {
    console.error('Error fetching combined wellness data:', error);
    throw new Error('Failed to fetch combined wellness data');
  }
}

// Export individual fetching functions for targeted use
export {
  fetchWorldHappinessData,
  fetchOECDData,
  fetchWHOData,
  fetchUNData,
  fetchWorldBankData
};
