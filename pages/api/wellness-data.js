export default function handler(req, res) {
  const { countries, metrics, year } = req.query;
  
  const selectedCountries = countries ? countries.split(',') : ["USA", "Finland", "Japan", "Germany", "Costa Rica"];
  const selectedMetrics = metrics ? metrics.split(',') : ["happiness", "healthcare", "education", "work_life"];
  const selectedYear = year ? parseInt(year) : new Date().getFullYear();
  
  // Historical data ranges from 2010 to current year
  const startYear = 2010;
  const currentYear = new Date().getFullYear();
  
  // Expanded country profiles with historical data
  const countryProfiles = {
    'USA': { 
      base: 70,
      historicalTrend: {
        2010: { base: 68, happiness: -4, healthcare: -8, education: 0, work_life: -18 },
        2015: { base: 69, happiness: -4, healthcare: -9, education: 0, work_life: -19 },
        2020: { base: 70, happiness: -5, healthcare: -10, education: 0, work_life: -20 }
      },
      current: {
        happiness: -5, healthcare: -10, education: 0, safety: -15, work_life: -20, 
        income_inequality: -15, social_support: -8, environmental: -12, life_expectancy: 0,
        gdp_per_capita: 15, mental_health: -10, gender_equality: -5, political_stability: -8,
        corruption_perception: -10, press_freedom: -5, digital_access: 10, innovation: 12
      }
    },
    'Finland': { 
      base: 90,
      historicalTrend: {
        2010: { base: 88, happiness: 4, healthcare: 7, education: 4, work_life: 9 },
        2015: { base: 89, happiness: 4, healthcare: 8, education: 5, work_life: 9 },
        2020: { base: 90, happiness: 5, healthcare: 8, education: 5, work_life: 10 }
      },
      current: {
        happiness: +5, healthcare: +8, education: +5, work_life: +10, social_support: +8,
        income_inequality: +12, environmental: +8, life_expectancy: +8, gdp_per_capita: +5,
        mental_health: +10, gender_equality: +12, political_stability: +10, corruption_perception: +15,
        press_freedom: +15, digital_access: +12, innovation: +10
      }
    },
    'Sweden': { 
      base: 88,
      historicalTrend: {
        2010: { base: 86, happiness: 3, healthcare: 6, education: 5, work_life: 7 },
        2015: { base: 87, happiness: 3, healthcare: 7, education: 6, work_life: 7 },
        2020: { base: 88, happiness: 4, healthcare: 7, education: 6, work_life: 8 }
      },
      current: {
        happiness: +4, healthcare: +7, education: +6, work_life: +8, social_support: +7,
        income_inequality: +10, environmental: +10, life_expectancy: +7, gdp_per_capita: +6,
        mental_health: +8, gender_equality: +15, political_stability: +12, corruption_perception: +12,
        press_freedom: +12, digital_access: +10, innovation: +8
      }
    },
    'Norway': { 
      base: 89,
      historicalTrend: {
        2010: { base: 87, happiness: 4, healthcare: 7, education: 4, work_life: 8 },
        2015: { base: 88, happiness: 4, healthcare: 8, education: 5, work_life: 8 },
        2020: { base: 89, happiness: 5, healthcare: 8, education: 5, work_life: 9 }
      },
      current: {
        happiness: +5, healthcare: +8, education: +5, work_life: +9, income_inequality: +8,
        social_support: +7, environmental: +12, life_expectancy: +8, gdp_per_capita: +15,
        mental_health: +9, gender_equality: +10, political_stability: +15, corruption_perception: +12,
        press_freedom: +10, digital_access: +8, innovation: +6
      }
    },
    'Denmark': { 
      base: 87,
      historicalTrend: {
        2010: { base: 85, happiness: 7, healthcare: 5, education: 3, work_life: 9 },
        2015: { base: 86, happiness: 7, healthcare: 6, education: 4, work_life: 9 },
        2020: { base: 87, happiness: 8, healthcare: 6, education: 4, work_life: 10 }
      },
      current: {
        happiness: +8, healthcare: +6, education: +4, work_life: +10, social_support: +9,
        income_inequality: +8, environmental: +6, life_expectancy: +6, gdp_per_capita: +8,
        mental_health: +12, gender_equality: +12, political_stability: +12, corruption_perception: +15,
        press_freedom: +12, digital_access: +10, innovation: +8
      }
    },
    'Germany': { 
      base: 82,
      historicalTrend: {
        2010: { base: 80, healthcare: 4, education: 2, safety: 1, work_life: 4 },
        2015: { base: 81, healthcare: 4, education: 3, safety: 2, work_life: 4 },
        2020: { base: 82, healthcare: 5, education: 3, safety: 2, work_life: 5 }
      },
      current: {
        healthcare: +5, education: +3, safety: +2, income_inequality: -3, work_life: +5,
        social_support: +4, environmental: +4, life_expectancy: +5, gdp_per_capita: +6,
        mental_health: +4, gender_equality: +6, political_stability: +8, corruption_perception: +8,
        press_freedom: +8, digital_access: +6, innovation: +10
      }
    },
    'Japan': { 
      base: 83,
      historicalTrend: {
        2010: { base: 81, healthcare: 5, education: 4, safety: 9, work_life: -14 },
        2015: { base: 82, healthcare: 5, education: 5, safety: 9, work_life: -14 },
        2020: { base: 83, healthcare: 6, education: 5, safety: 10, work_life: -15 }
      },
      current: {
        healthcare: +6, education: +5, safety: +10, work_life: -15, social_support: -5,
        income_inequality: -5, environmental: +4, life_expectancy: +15, gdp_per_capita: +8,
        mental_health: -8, gender_equality: -10, political_stability: +8, corruption_perception: +8,
        press_freedom: -5, digital_access: +12, innovation: +12
      }
    },
    'Costa Rica': { 
      base: 77,
      historicalTrend: {
        2010: { base: 75, happiness: 9, environmental: 11, social_support: 5, healthcare: -7 },
        2015: { base: 76, happiness: 9, environmental: 11, social_support: 6, healthcare: -7 },
        2020: { base: 77, happiness: 10, environmental: 12, social_support: 6, healthcare: -8 }
      },
      current: {
        happiness: +10, environmental: +12, social_support: +6, healthcare: -8, income_inequality: -10,
        education: -5, work_life: +8, life_expectancy: +5, gdp_per_capita: -8,
        mental_health: +6, gender_equality: +4, political_stability: +6, corruption_perception: +4,
        press_freedom: +6, digital_access: -5, innovation: -5
      }
    },
    'Canada': { 
      base: 82,
      historicalTrend: {
        2010: { base: 80, healthcare: 4, education: 2, social_support: 3, safety: 4 },
        2015: { base: 81, healthcare: 4, education: 3, social_support: 4, safety: 4 },
        2020: { base: 82, healthcare: 5, education: 3, social_support: 4, safety: 5 }
      },
      current: {
        healthcare: +5, education: +3, social_support: +4, safety: +5, work_life: +6,
        income_inequality: -5, environmental: +6, life_expectancy: +6, gdp_per_capita: +8,
        mental_health: +4, gender_equality: +8, political_stability: +10, corruption_perception: +10,
        press_freedom: +10, digital_access: +8, innovation: +6
      }
    },
    'New Zealand': {
      base: 85,
      historicalTrend: {
        2010: { base: 83, happiness: 7, healthcare: 5, education: 4, work_life: 9 },
        2015: { base: 84, happiness: 7, healthcare: 6, education: 5, work_life: 9 },
        2020: { base: 85, happiness: 8, healthcare: 6, education: 5, work_life: 10 }
      },
      current: {
        happiness: +8, healthcare: +6, education: +5, work_life: +10, social_support: +10,
        income_inequality: +4, environmental: +12, life_expectancy: +6, gdp_per_capita: +6,
        mental_health: +8, gender_equality: +10, political_stability: +12, corruption_perception: +12,
        press_freedom: +12, digital_access: +8, innovation: +6
      }
    },
    'Iceland': {
      base: 86,
      historicalTrend: {
        2010: { base: 84, happiness: 9, healthcare: 7, education: 5, work_life: 7 },
        2015: { base: 85, happiness: 9, healthcare: 8, education: 6, work_life: 7 },
        2020: { base: 86, happiness: 10, healthcare: 8, education: 6, work_life: 8 }
      },
      current: {
        happiness: +10, healthcare: +8, education: +6, work_life: +8, social_support: +12,
        income_inequality: +10, environmental: +10, life_expectancy: +8, gdp_per_capita: +8,
        mental_health: +10, gender_equality: +15, political_stability: +10, corruption_perception: +12,
        press_freedom: +12, digital_access: +10, innovation: +6
      }
    },
    'Netherlands': {
      base: 84,
      historicalTrend: {
        2010: { base: 82, happiness: 7, healthcare: 6, education: 5, work_life: 8 },
        2015: { base: 83, happiness: 7, healthcare: 7, education: 6, work_life: 8 },
        2020: { base: 84, happiness: 8, healthcare: 7, education: 6, work_life: 9 }
      },
      current: {
        happiness: +8, healthcare: +7, education: +6, work_life: +9, social_support: +9,
        income_inequality: +6, environmental: +8, life_expectancy: +7, gdp_per_capita: +7,
        mental_health: +9, gender_equality: +10, political_stability: +12, corruption_perception: +12,
        press_freedom: +12, digital_access: +10, innovation: +8
      }
    },
    'Switzerland': {
      base: 85,
      historicalTrend: {
        2010: { base: 83, happiness: 7, healthcare: 8, education: 6, work_life: 8 },
        2015: { base: 84, happiness: 7, healthcare: 9, education: 7, work_life: 8 },
        2020: { base: 85, happiness: 8, healthcare: 9, education: 7, work_life: 9 }
      },
      current: {
        happiness: +8, healthcare: +9, education: +7, work_life: +9, social_support: +8,
        income_inequality: +4, environmental: +8, life_expectancy: +8, gdp_per_capita: +12,
        mental_health: +8, gender_equality: +8, political_stability: +15, corruption_perception: +12,
        press_freedom: +10, digital_access: +8, innovation: +10
      }
    },
    'Australia': {
      base: 83,
      historicalTrend: {
        2010: { base: 81, happiness: 7, healthcare: 6, education: 5, work_life: 8 },
        2015: { base: 82, happiness: 7, healthcare: 7, education: 6, work_life: 8 },
        2020: { base: 83, happiness: 8, healthcare: 7, education: 6, work_life: 9 }
      },
      current: {
        happiness: +8, healthcare: +7, education: +6, work_life: +9, social_support: +8,
        income_inequality: -4, environmental: +8, life_expectancy: +7, gdp_per_capita: +8,
        mental_health: +7, gender_equality: +8, political_stability: +12, corruption_perception: +10,
        press_freedom: +10, digital_access: +8, innovation: +8
      }
    },
    'Singapore': {
      base: 84,
      historicalTrend: {
        2010: { base: 82, healthcare: 8, education: 7, safety: 12, work_life: 6 },
        2015: { base: 83, healthcare: 9, education: 8, safety: 12, work_life: 6 },
        2020: { base: 84, healthcare: 9, education: 8, safety: 12, work_life: 7 }
      },
      current: {
        healthcare: +9, education: +8, safety: +12, work_life: +7, social_support: +6,
        income_inequality: -6, environmental: +6, life_expectancy: +10, gdp_per_capita: +15,
        mental_health: +6, gender_equality: +6, political_stability: +15, corruption_perception: +15,
        press_freedom: -8, digital_access: +15, innovation: +12
      }
    }
  };
  
  // Calculate the metric values for each country
  const result = {
    countries: selectedCountries,
    metrics: {},
    historicalData: {}
  };
  
  // Generate data for each requested metric
  selectedMetrics.forEach(metricId => {
    result.metrics[metricId] = {};
    result.historicalData[metricId] = {};
    
    selectedCountries.forEach(country => {
      if (!countryProfiles[country]) {
        // If country not found, use average values
        result.metrics[metricId][country] = 65 + Math.random() * 10;
        return;
      }
      
      const profile = countryProfiles[country];
      const historicalYears = [2010, 2015, 2020];
      
      // Calculate historical values
      result.historicalData[metricId][country] = {};
      historicalYears.forEach(year => {
        if (profile.historicalTrend[year]) {
          let value = profile.historicalTrend[year].base;
          if (profile.historicalTrend[year][metricId]) {
            value += profile.historicalTrend[year][metricId];
          }
          value += (Math.random() * 6) - 3;
          value = Math.max(0, Math.min(100, value));
          result.historicalData[metricId][country][year] = parseFloat(value.toFixed(1));
        }
      });
      
      // Calculate current value
      let value = profile.base;
      if (profile.current[metricId]) {
        value += profile.current[metricId];
      }
      value += (Math.random() * 6) - 3;
      value = Math.max(0, Math.min(100, value));
      result.metrics[metricId][country] = parseFloat(value.toFixed(1));
    });
  });
  
  res.status(200).json(result);
} 