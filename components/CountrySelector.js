import { useState } from 'react';

const COUNTRIES = [
  { name: 'United States', code: 'US', region: 'North America' },
  { name: 'Canada', code: 'CA', region: 'North America' },
  { name: 'United Kingdom', code: 'GB', region: 'Europe' },
  { name: 'Germany', code: 'DE', region: 'Europe' },
  { name: 'Japan', code: 'JP', region: 'Asia' },
  // Add more countries as needed
];

export default function CountrySelector({ selectedCountries, setSelectedCountries }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeRegionFilter, setActiveRegionFilter] = useState('All');
  
  const REGIONS = [...new Set(COUNTRIES.map(country => country.region))].sort();
  
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

  const allCountries = [
    'United States', 'Finland', 'Japan', 'Germany', 'Costa Rica',
    'Sweden', 'Norway', 'Denmark', 'Canada', 'New Zealand',
    'Iceland', 'Netherlands', 'Switzerland', 'Australia', 'Singapore'
  ];

  const toggleCountry = (country) => {
    if (selectedCountries.includes(country)) {
      setSelectedCountries(selectedCountries.filter(c => c !== country));
    } else {
      setSelectedCountries([...selectedCountries, country]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-semibold text-text-primary mb-4">Select Countries</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3">
        {allCountries.map(country => (
          <button
            key={country}
            onClick={() => toggleCountry(country)}
            className={`p-3 rounded-lg text-center transition-colors ${
              selectedCountries.includes(country)
                ? 'bg-accent-primary/10 border-2 border-accent-primary'
                : 'bg-background-light border border-border-color hover:bg-hover-bg'
            }`}
          >
            <span className="text-text-primary">{country}</span>
          </button>
        ))}
      </div>
    </div>
  );
} 