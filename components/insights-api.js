// components/WellnessInsights.js
import { useState } from 'react';

export default function WellnessInsights({ data, metrics }) {
  const [expandedCountry, setExpandedCountry] = useState(null);
  
  // Calculate some basic insights
  const getInsights = () => {
    const insights = [];
    
    // Find top performing countries for each metric
    Object.keys(data.metrics).forEach(metricId => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;
      
      const metricData = data.metrics[metricId];
      const entries = Object.entries(metricData);
      
      // Sort entries by value (descending)
      const sorted = [...entries].sort((a, b) => b[1] - a[1]);
      const topCountry = sorted[0];
      
      if (topCountry) {
        insights.push({
          type: 'top',
          metricId,
          metricName: metric.name,
          country: topCountry[0],
          value: topCountry[1],
          description: `${topCountry[0]} leads in ${metric.name.toLowerCase()} with a score of ${topCountry[1].toFixed(1)}`
        });
      }
      
      // Find interesting correlations or clusters
      if (metricId === 'happiness') {
        const happinessCorrelations = [];
        
        // Check correlation with other metrics
        Object.keys(data.metrics).forEach(otherMetricId => {
          if (otherMetricId === metricId) return;
          
          const otherMetric = metrics.find(m => m.id === otherMetricId);
          if (!otherMetric) return;
          
          // Simple correlation - do countries with high happiness also perform well in this metric?
          const highHappinessCountries = sorted.slice(0, Math.ceil(sorted.length / 2))
            .map(entry => entry[0]);
          
          const otherMetricData = data.metrics[otherMetricId];
          const otherMetricSorted = Object.entries(otherMetricData)
            .sort((a, b) => b[1] - a[1]);
          
          const highOtherMetricCountries = otherMetricSorted
            .slice(0, Math.ceil(otherMetricSorted.length / 2))
            .map(entry => entry[0]);
          
          // Find overlap
          const overlap = highHappinessCountries.filter(country => 
            highOtherMetricCountries.includes(country)
          );
          
          if (overlap.length >= Math.ceil(highHappinessCountries.length * 0.75)) {
            happinessCorrelations.push({
              metricId: otherMetricId,
              metricName: otherMetric.name,
              strength: overlap.length / highHappinessCountries.length
            });
          }
        });
        
        if (happinessCorrelations.length > 0) {
          const topCorrelation = happinessCorrelations.sort((a, b) => b.strength - a.strength)[0];
          
          insights.push({
            type: 'correlation',
            metricId: 'happiness',
            relatedMetricId: topCorrelation.metricId,
            relatedMetricName: topCorrelation.metricName,
            description: `Countries with higher happiness tend to also score well in ${topCorrelation.metricName.toLowerCase()}`
          });
        }
      }
    });
    
    // Find outliers - countries that perform very differently across metrics
    data.countries.forEach(country => {
      const countryScores = {};
      
      Object.keys(data.metrics).forEach(metricId => {
        countryScores[metricId] = data.metrics[metricId][country];
      });
      
      const scores = Object.values(countryScores);
      if (scores.length < 2) return;
      
      // Calculate standard deviation
      const mean = scores.reduce((sum, score) => sum + score, 0) / scores.length;
      const squaredDiffs = scores.map(score => Math.pow(score - mean, 2));
      const variance = squaredDiffs.reduce((sum, diff) => sum + diff, 0) / scores.length;
      const stdDev = Math.sqrt(variance);
      
      // If standard deviation is high, this country has very uneven performance
      if (stdDev > 15) {
        // Find the highest and lowest metrics
        const metricEntries = Object.entries(countryScores);
        const highest = metricEntries.reduce((max, entry) => 
          entry[1] > max[1] ? entry : max, metricEntries[0]);
        const lowest = metricEntries.reduce((min, entry) => 
          entry[1] < min[1] ? entry : min, metricEntries[0]);
        
        const highestMetric = metrics.find(m => m.id === highest[0]);
        const lowestMetric = metrics.find(m => m.id === lowest[0]);
        
        if (highestMetric && lowestMetric) {
          insights.push({
            type: 'outlier',
            country,
            highMetricId: highest[0],
            highMetricName: highestMetric.name,
            highValue: highest[1],
            lowMetricId: lowest[0],
            lowMetricName: lowestMetric.name,
            lowValue: lowest[1],
            description: `${country} shows uneven performance: strong in ${highestMetric.name.toLowerCase()} (${highest[1].toFixed(1)}) but weaker in ${lowestMetric.name.toLowerCase()} (${lowest[1].toFixed(1)})`
          });
        }
      }
    });
    
    return insights;
  };
  
  const insights = getInsights();
  
  // Get country-specific insights
  const getCountryInsights = (country) => {
    const countryInsights = [];
    
    // Get all metrics for this country
    const countryData = {};
    Object.keys(data.metrics).forEach(metricId => {
      countryData[metricId] = data.metrics[metricId][country];
    });
    
    // Find this country's strengths and weaknesses
    const metricEntries = Object.entries(countryData);
    const sortedMetrics = [...metricEntries].sort((a, b) => b[1] - a[1]);
    
    const strengths = sortedMetrics.slice(0, 2);
    const weaknesses = sortedMetrics.slice(-2).reverse();
    
    // Format strengths
    strengths.forEach(([metricId, value]) => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;
      
      countryInsights.push({
        type: 'strength',
        metricId,
        metricName: metric.name,
        value,
        description: `Strong performance in ${metric.name} (${value.toFixed(1)})`
      });
    });
    
    // Format weaknesses
    weaknesses.forEach(([metricId, value]) => {
      const metric = metrics.find(m => m.id === metricId);
      if (!metric) return;
      
      countryInsights.push({
        type: 'weakness',
        metricId,
        metricName: metric.name,
        value,
        description: `Room for improvement in ${metric.name} (${value.toFixed(1)})`
      });
    });
    
    // Find similar countries (based on overall pattern)
    const otherCountries = data.countries.filter(c => c !== country);
    const similarities = otherCountries.map(otherCountry => {
      let sumSquaredDiff = 0;
      let validComparisons = 0;
      
      Object.keys(data.metrics).forEach(metricId => {
        const thisValue = data.metrics[metricId][country];
        const otherValue = data.metrics[metricId][otherCountry];
        
        if (thisValue !== undefined && otherValue !== undefined) {
          sumSquaredDiff += Math.pow(thisValue - otherValue, 2);
          validComparisons++;
        }
      });
      
      if (validComparisons === 0) return { country: otherCountry, similarity: 0 };
      
      // Lower distance = higher similarity
      const distance = Math.sqrt(sumSquaredDiff / validComparisons);
      const similarity = 100 / (1 + distance);
      
      return { country: otherCountry, similarity };
    });
    
    const mostSimilar = similarities.sort((a, b) => b.similarity - a.similarity)[0];
    
    if (mostSimilar && mostSimilar.similarity > 70) {
      countryInsights.push({
        type: 'similar',
        similarCountry: mostSimilar.country,
        similarity: mostSimilar.similarity,
        description: `Shows a similar wellness profile to ${mostSimilar.country} (${mostSimilar.similarity.toFixed(0)}% similarity)`
      });
    }
    
    return countryInsights;
  };
  
  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Wellness Insights</h2>
      
      <div className="space-y-6">
        {/* General insights */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Key Observations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {insights.map((insight, index) => (
              <div 
                key={index} 
                className="border border-gray-200 rounded-lg p-4 hover:bg-blue-50 transition-colors"
              >
                <div className="flex items-start">
                  <div className={`
                    p-2 rounded-full mr-3 flex-shrink-0
                    ${insight.type === 'top' ? 'bg-green-100 text-green-600' : 
                      insight.type === 'correlation' ? 'bg-blue-100 text-blue-600' : 
                      'bg-purple-100 text-purple-600'}
                  `}>
                    {insight.type === 'top' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    ) : insight.type === 'correlation' ? (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M3 6a3 3 0 013-3h10a1 1 0 011 1v10a3 3 0 01-3 3H3a1 1 0 01-1-1V6zm3-1a1 1 0 00-1 1v10a1 1 0 001 1h10a1 1 0 001-1V3a1 1 0 00-1-1H6z" clipRule="evenodd" />
                      </svg>
                    ) : (
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M11 3a1 1 0 10-2 0v1a1 1 0 102 0V3zM15.657 5.757a1 1 0 00-1.414-1.414l-.707.707a1 1 0 001.414 1.414l.707-.707zM18 10a1 1 0 01-1 1h-1a1 1 0 110-2h1a1 1 0 011 1zM5.05 6.464A1 1 0 106.464 5.05l-.707-.707a1 1 0 00-1.414 1.414l.707.707zM5 10a1 1 0 01-1 1H3a1 1 0 110-2h1a1 1 0 011 1zM8 16v-1h4v1a2 2 0 11-4 0zM12 14c.015-.34.208-.646.477-.859a4 4 0 10-4.954 0c.27.213.462.519.476.859h4.002z" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        {/* Country-specific insights */}
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-3">Country Spotlight</h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
            {data.countries.map(country => (
              <button
                key={country}
                className={`p-3 border rounded-lg text-center hover:bg-gray-50 transition-colors ${
                  expandedCountry === country ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                }`}
                onClick={() => setExpandedCountry(expandedCountry === country ? null : country)}
              >
                <span className="font-medium text-gray-900">{country}</span>
              </button>
            ))}
          </div>
          
          {expandedCountry && (
            <div className="mt-4 p-4 border border-blue-200 rounded-lg bg-blue-50">
              <h4 className="text-lg font-medium text-gray-900 mb-3">{expandedCountry} Insights</h4>
              <div className="space-y-3">
                {getCountryInsights(expandedCountry).map((insight, index) => (
                  <div key={index} className="flex items-start">
                    <div className={`
                      p-1.5 rounded-full mr-3 flex-shrink-0
                      ${insight.type === 'strength' ? 'bg-green-100 text-green-600' : 
                        insight.type === 'weakness' ? 'bg-orange-100 text-orange-600' : 
                        'bg-blue-100 text-blue-600'}
                    `}>
                      {insight.type === 'strength' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586l3.293-3.293A1 1 0 0112 7z" clipRule="evenodd" />
                        </svg>
                      ) : insight.type === 'weakness' ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586l-4.293-4.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414l3.293 3.293A1 1 0 0012 13z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                        </svg>
                      )}
                    </div>
                    <p className="text-sm text-gray-700">{insight.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// pages/api/wellness-data.js
export default function handler(req, res) {
  const { countries, metrics } = req.query;
  
  const selectedCountries = countries.split(',');
  const selectedMetrics = metrics.split(',');
  
  // In a real application, this would fetch data from a database or external API
  // For this example, we'll generate some realistic-looking sample data
  
  // Each country will have a base profile that influences all its metrics
  const countryProfiles = {
    'USA': { base: 70, healthcare: -10, education: 0, safety: -15, work_life: -20, income_inequality: -15 },
    'Finland': { base: 90, happiness: +5, healthcare: +8, education: +5, work_life: +10, social_support: +8 },
    'Sweden': { base: 88, happiness: +4, healthcare: +7, education: +6, work_life: +8, social_support: +7 },
    'Norway': { base: 89, happiness: +5, healthcare: +8, education: +5, work_life: +9, income_inequality: +8 },
    'Denmark': { base: 87, happiness: +8, healthcare: +6, education: +4, work_life: +10, social_support: +9 },
    'Germany': { base: 82, healthcare: +5, education: +3, safety: +2, income_inequality: -3 },
    'France': { base: 79, healthcare: +8, work_life: +5, income_inequality: -2 },
    'United Kingdom': { base: 77, healthcare: +3, education: +2, safety: -3 },
    'Switzerland': { base: 86, happiness: +3, healthcare: +7, education: +4, income_inequality: -5 },
    'Japan': { base: 83, healthcare: +6, education: +5, safety: +10, work_life: -15, social_support: -5 },
    'South Korea': { base: 78, education: +12, healthcare: +3, safety: +5, work_life: -18 },
    'Australia': { base: 84, happiness: +2, healthcare: +5, work_life: +4, environmental: +5 },
    'New Zealand': { base: 85, happiness: +3, healthcare: +4, environmental: +8, social_support: +5 },
    'Costa Rica': { base: 77, happiness: +10, environmental: +12, social_support: +6, healthcare: -8, income_inequality: -10 },
    'Uruguay': { base: 73, social_support: +8, happiness: +5, income_inequality: -7 },
    'Chile': { base: 72, education: +3, income_inequality: -12 },
    'Singapore': { base: 85, safety: +10, education: +8, healthcare: +6, work_life: -10, income_inequality: -5 },
    'Estonia': { base: 75, education: +5, healthcare: +2, work_life: +3 },
    'United Arab Emirates': { base: 76, safety: +8, healthcare: +5, income_inequality: -8 },
    'Canada': { base: 82, healthcare: +5, education: +3, social_support: +4, safety: +5 },
  };
  
  // Calculate the metric values for each country
  const result = {
    countries: selectedCountries,
    metrics: {}
  };
  
  // Generate data for each requested metric
  selectedMetrics.forEach(metricId => {
    result.metrics[metricId] = {};
    
    selectedCountries.forEach(country => {
      if (!countryProfiles[country]) {
        // If country not found, use average values
        result.metrics[metricId][country] = 65 + Math.random() * 10;
        return;
      }
      
      const profile = countryProfiles[country];
      
      // Base value + specific adjustment for this metric + small random variation
      let value = profile.base;
      
      // Add metric-specific adjustment if available
      if (profile[metricId]) {
        value += profile[metricId];
      }
      
      // Add a small random variation (-3 to +3)
      value += (Math.random() * 6) - 3;
      
      // Ensure value is within 0-100 range
      value = Math.max(0, Math.min(100, value));
      
      result.metrics[metricId][country] = parseFloat(value.toFixed(1));
    });
  });
  
  // Add some time delay to simulate real API call
  setTimeout(() => {
    res.status(200).json(result);
  }, 500);
}
