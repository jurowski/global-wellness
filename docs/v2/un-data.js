// utils/dataFetching/unData.js
import axios from 'axios';
import Papa from 'papaparse';

// UN HDI data is typically available via their website or API
const UN_HDI_DATA_URL = 'https://hdr.undp.org/sites/default/files/2021-22_HDR/HDR21-22_Statistical_Annex_HDI_Table.xlsx';

/**
 * Fetches education and development data from UN sources
 * @param {Object} options - Configuration options
 * @returns {Promise<Array>} - Processed UN data by country
 */
export async function fetchUNData(options = {}) {
  try {
    // Fetch Human Development Index data
    const hdiData = await fetchHDIData();
    
    // Fetch education-specific data
    const educationData = await fetchEducationData();
    
    // Fetch gender inequality data
    const genderData = await fetchGenderInequalityData();
    
    // Merge all UN datasets
    const mergedData = mergeUNDatasets(hdiData, educationData, genderData);
    
    return mergedData;
  } catch (error) {
    console.error('Error fetching UN data:', error);
    return [];
  }
}

/**
 * Fetches Human Development Index data
 * @returns {Promise<Array>} - HDI data by country
 */
async function fetchHDIData() {
  try {
    // In a real implementation, you would fetch and parse the HDI data from UN
    
    // For this example, we'll simulate some parsed HDI data
    // based on actual UN HDI indicators
    
    const simulatedData = [
      {
        country: 'Norway',
        countryCode: 'NOR',
        metrics: {
          hdi: 0.961, // Human Development Index
          hdi_rank: 1, // Global rank
          gni_per_capita: 66494, // GNI per capita (PPP $)
          life_expectancy_index: 0.958, // Life expectancy component of HDI
          education_index: 0.930, // Education component of HDI
          income_index: 0.997, // Income component of HDI
        },
        year: 2021
      },
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          hdi: 0.921,
          hdi_rank: 21,
          gni_per_capita: 64765,
          life_expectancy_index: 0.838,
          education_index: 0.903,
          income_index: 0.996,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          hdi: 0.942,
          hdi_rank: 9,
          gni_per_capita: 54534,
          life_expectancy_index: 0.911,
          education_index: 0.943,
          income_index: 0.973,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          hdi: 0.925,
          hdi_rank: 19,
          gni_per_capita: 42274,
          life_expectancy_index: 0.964,
          education_index: 0.858,
          income_index: 0.950,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          hdi: 0.940,
          hdi_rank: 11,
          gni_per_capita: 49452,
          life_expectancy_index: 0.929,
          education_index: 0.927,
          income_index: 0.964,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        hdi: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        },
        hdi_rank: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        },
        gni_per_capita: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        },
        life_expectancy_index: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        },
        education_index: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        },
        income_index: {
          name: 'UN Human Development Index',
          url: 'https://hdr.undp.org/data-center',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching HDI data:', error);
    return [];
  }
}

/**
 * Fetches education-specific data
 * @returns {Promise<Array>} - Education data by country
 */
async function fetchEducationData() {
  try {
    // Simulate education data based on UN sources
    const simulatedData = [
      {
        country: 'Norway',
        countryCode: 'NOR',
        metrics: {
          expected_years_schooling: 18.2, // Expected years of schooling
          mean_years_schooling: 13.0, // Mean years of schooling (adults)
          education_expenditure: 7.6, // Public expenditure on education (% of GDP)
          pupil_teacher_ratio_primary: 9, // Pupil-teacher ratio, primary
          tertiary_enrollment: 82.0, // Gross enrollment ratio, tertiary (%)
        },
        year: 2021
      },
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          expected_years_schooling: 16.3,
          mean_years_schooling: 13.4,
          education_expenditure: 5.0,
          pupil_teacher_ratio_primary: 14,
          tertiary_enrollment: 88.2,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          expected_years_schooling: 17.0,
          mean_years_schooling: 14.1,
          education_expenditure: 4.9,
          pupil_teacher_ratio_primary: 12,
          tertiary_enrollment: 70.2,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          expected_years_schooling: 15.2,
          mean_years_schooling: 12.9,
          education_expenditure: 3.5,
          pupil_teacher_ratio_primary: 16,
          tertiary_enrollment: 63.2,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          expected_years_schooling: 19.1,
          mean_years_schooling: 12.8,
          education_expenditure: 6.3,
          pupil_teacher_ratio_primary: 13,
          tertiary_enrollment: 90.4,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        expected_years_schooling: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        },
        mean_years_schooling: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        },
        education_expenditure: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        },
        pupil_teacher_ratio_primary: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        },
        tertiary_enrollment: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching education data:', error);
    return [];
  }
}

/**
 * Fetches gender inequality data
 * @returns {Promise<Array>} - Gender inequality data by country
 */
async function fetchGenderInequalityData() {
  try {
    // Simulate gender inequality data based on UN sources
    const simulatedData = [
      {
        country: 'Norway',
        countryCode: 'NOR',
        metrics: {
          gender_inequality_index: 0.053, // Gender Inequality Index
          female_labor_participation: 60.4, // Female labor force participation rate (%)
          female_seats_parliament: 44.4, // Seats in parliament held by women (%)
          female_secondary_education: 95.4, // Female population with at least secondary education (%)
          maternal_mortality_ratio: 2, // Maternal mortality ratio (per 100,000 live births)
        },
        year: 2021
      },
      {
        country: 'United States',
        countryCode: 'USA',
        metrics: {
          gender_inequality_index: 0.204,
          female_labor_participation: 56.1,
          female_seats_parliament: 27.6,
          female_secondary_education: 95.7,
          maternal_mortality_ratio: 19,
        },
        year: 2021
      },
      {
        country: 'Germany',
        countryCode: 'DEU',
        metrics: {
          gender_inequality_index: 0.073,
          female_labor_participation: 55.3,
          female_seats_parliament: 39.8,
          female_secondary_education: 95.9,
          maternal_mortality_ratio: 7,
        },
        year: 2021
      },
      {
        country: 'Japan',
        countryCode: 'JPN',
        metrics: {
          gender_inequality_index: 0.094,
          female_labor_participation: 53.3,
          female_seats_parliament: 14.2,
          female_secondary_education: 95.5,
          maternal_mortality_ratio: 5,
        },
        year: 2021
      },
      {
        country: 'Finland',
        countryCode: 'FIN',
        metrics: {
          gender_inequality_index: 0.040,
          female_labor_participation: 55.8,
          female_seats_parliament: 46.0,
          female_secondary_education: 100.0,
          maternal_mortality_ratio: 3,
        },
        year: 2021
      },
      // Add more countries...
    ];
    
    return simulatedData.map(country => ({
      ...country,
      source: {
        gender_inequality_index: {
          name: 'UN Gender Inequality Index',
          url: 'https://hdr.undp.org/data-center/thematic-composite-indices/gender-inequality-index',
          year: country.year
        },
        female_labor_participation: {
          name: 'International Labour Organization',
          url: 'https://ilostat.ilo.org/data/',
          year: country.year
        },
        female_seats_parliament: {
          name: 'Inter-Parliamentary Union',
          url: 'https://www.ipu.org/resources/publications/infographics/2020-03/women-in-politics-2020',
          year: country.year
        },
        female_secondary_education: {
          name: 'UNESCO Institute for Statistics',
          url: 'http://data.uis.unesco.org/',
          year: country.year
        },
        maternal_mortality_ratio: {
          name: 'WHO, UNICEF, UNFPA, World Bank Group, and UN Population Division',
          url: 'https://www.who.int/data/gho/data/themes/maternal-and-reproductive-health/maternal-mortality',
          year: country.year
        }
      }
    }));
  } catch (error) {
    console.error('Error fetching gender inequality data:', error);
    return [];
  }
}

/**
 * Merges multiple UN datasets into one unified dataset
 * @param {...Array} datasets - UN datasets to merge
 * @returns {Array} - Merged dataset
 */
function mergeUNDatasets(...datasets) {
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
