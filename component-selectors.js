// components/CountrySelector.js
import { useState } from 'react';

// List of countries with regions
const COUNTRIES = [
  { code: 'USA', name: 'United States', region: 'North America' },
  { code: 'CAN', name: 'Canada', region: 'North America' },
  { code: 'FIN', name: 'Finland', region: 'Nordic' },
  { code: 'SWE', name: 'Sweden', region: 'Nordic' },
  { code: 'NOR', name: 'Norway', region: 'Nordic' },
  { code: 'DNK', name: 'Denmark', region: 'Nordic' },
  { code: 'DEU', name: 'Germany', region: 'Western Europe' },
  { code: 'FRA', name: 'France', region: 'Western Europe' },
  { code: 'GBR', name: 'United Kingdom', region: 'Western Europe' },
  { code: 'CHE', name: 'Switzerland', region: 'Western Europe' },
  { code: 'JPN', name: 'Japan', region: 'East Asia' },
  { code: 'KOR', name: 'South Korea', region: 'East Asia' },
  { code: 'AUS', name: 'Australia', region: 'Oceania' },
  { code: 'NZL', name: 'New Zealand', region: 'Oceania' },
  { code: 'CRI', name: 'Costa Rica', region: 'Latin America' },
  { code: 'URY', name: 'Uruguay', region: 'Latin America' },
  { code: 'CHL', name: 'Chile', region: 'Latin America' },
  { code: 'SGP', name: 'Singapore', region: 'Southeast Asia' },
  { code: 'EST', name: 'Estonia', region: 'Eastern Europe' },
  { code: 'ARE', name: 'United Arab Emirates', region: 'Middle East' },
];

// Group countries by region
const REGIONS = [...new Set(COUNTRIES.map(country => country.region))].sort();

export default function CountrySelector({ selectedCountries, setSelectedCountries }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegionFilter, setActiveRegionFilter] = useState('All');

  const filteredCountries = COUNTRIES.filter(country => {
    const matchesSearch = country.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRegion = activeRegionFilter === 'All' || country.region === activeRegionFilter;
    return matchesSearch && matchesRegion;
  });

  const handleCountryToggle = (countryName) => {
    if (selectedCountries.includes(countryName)) {
      setSelectedCountries(selectedCountries.filter(c => c !== countryName));
    } else {
      if (selectedCountries.length < 7) {
        setSelectedCountries([...selectedCountries, countryName]);
      } else {
        alert('You can select up to 7 countries for comparison');
      }
    }
  };

  return (
    <div>
      <label htmlFor="countries" className="block text-lg font-medium text-gray-700 mb-2">
        Select Countries to Compare (max 7)
      </label>
      
      <div className="mb-4">
        <input
          type="text"
          className="shadow-sm focus:ring-blue-500 focus:border-blue-500 block w-full sm:text-sm border-gray-300 rounded-md p-2"
          placeholder="Search countries..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      <div className="flex flex-wrap gap-2 mb-4">
        <button
          className={`px-3 py-1 rounded-full text-sm ${
            activeRegionFilter === 'All' 
              ? 'bg-blue-500 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => setActiveRegionFilter('All')}
        >
          All
        </button>
        {REGIONS.map(region => (
          <button
            key={region}
            className={`px-3 py-1 rounded-full text-sm ${
              activeRegionFilter === region 
                ? 'bg-blue-500 text-white' 
                : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
            }`}
            onClick={() => setActiveRegionFilter(region)}
          >
            {region}
          </button>
        ))}
      </div>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
        {filteredCountries.map(country => (
          <div 
            key={country.code} 
            className={`p-2 rounded flex items-center cursor-pointer ${
              selectedCountries.includes(country.name) 
                ? 'bg-blue-100 border border-blue-500' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleCountryToggle(country.name)}
          >
            <input
              type="checkbox"
              className="h-4 w-4 text-blue-600 rounded"
              checked={selectedCountries.includes(country.name)}
              onChange={() => {}}
            />
            <label className="ml-2 text-sm text-gray-700">
              {country.name}
            </label>
          </div>
        ))}
      </div>
      
      <div className="mt-4">
        <p className="text-sm text-gray-500">Selected: {selectedCountries.join(', ')}</p>
      </div>
    </div>
  );
}

// components/MetricSelector.js
export default function MetricSelector({ metrics, selectedMetrics, setSelectedMetrics }) {
  const handleMetricToggle = (metricId) => {
    if (selectedMetrics.includes(metricId)) {
      setSelectedMetrics(selectedMetrics.filter(m => m !== metricId));
    } else {
      setSelectedMetrics([...selectedMetrics, metricId]);
    }
  };

  return (
    <div>
      <label className="block text-lg font-medium text-gray-700 mb-2">
        Select Wellness Metrics
      </label>
      
      <div className="grid grid-cols-1 gap-2 max-h-60 overflow-y-auto p-2 border border-gray-200 rounded-md">
        {metrics.map(metric => (
          <div 
            key={metric.id} 
            className={`p-3 rounded flex items-start cursor-pointer ${
              selectedMetrics.includes(metric.id) 
                ? 'bg-blue-100 border border-blue-500' 
                : 'hover:bg-gray-100'
            }`}
            onClick={() => handleMetricToggle(metric.id)}
          >
            <input
              type="checkbox"
              className="h-4 w-4 mt-1 text-blue-600 rounded"
              checked={selectedMetrics.includes(metric.id)}
              onChange={() => {}}
            />
            <div className="ml-3">
              <label className="text-sm font-medium text-gray-700">
                {metric.name}
              </label>
              <p className="text-xs text-gray-500 mt-1">
                {metric.description}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Source: {metric.source}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
