'use client';

import React from 'react';

interface Country {
  code: string;
  name: string;
  region: string;
}

interface CountrySelectorProps {
  selectedCountries: string[];
  setSelectedCountries: (countries: string[]) => void;
  selectedMetrics: string[];
  dataAvailability?: Record<string, Record<string, boolean>>;
}

const AVAILABLE_COUNTRIES: Country[] = [
  { code: 'United States', name: 'United States', region: 'North America' },
  { code: 'Finland', name: 'Finland', region: 'Europe' },
  { code: 'Japan', name: 'Japan', region: 'Asia' },
  { code: 'Germany', name: 'Germany', region: 'Europe' },
  { code: 'Costa Rica', name: 'Costa Rica', region: 'Central America' },
  { code: 'New Zealand', name: 'New Zealand', region: 'Oceania' },
  { code: 'Denmark', name: 'Denmark', region: 'Europe' },
  { code: 'Canada', name: 'Canada', region: 'North America' },
  { code: 'Netherlands', name: 'Netherlands', region: 'Europe' },
  { code: 'Switzerland', name: 'Switzerland', region: 'Europe' },
];

export default function CountrySelector({
  selectedCountries,
  setSelectedCountries,
  selectedMetrics,
  dataAvailability
}: CountrySelectorProps) {
  // Check if a country has real data for all selected metrics
  const hasRealData = (countryCode: string) => {
    if (!dataAvailability || !selectedMetrics || selectedMetrics.length === 0) return true;
    return selectedMetrics.every(metric => 
      dataAvailability[metric]?.[countryCode] === true
    );
  };

  // Check if a country has mock data for any selected metrics
  const hasMockData = (countryCode: string) => {
    if (!dataAvailability || !selectedMetrics || selectedMetrics.length === 0) return false;
    return selectedMetrics.some(metric => 
      dataAvailability[metric]?.[countryCode] === false
    );
  };

  const handleCountryToggle = (countryCode: string) => {
    // Don't allow toggling if the country has no real data for selected metrics
    const hasReal = hasRealData(countryCode);
    if (!hasReal && selectedMetrics.length > 0 && !selectedCountries.includes(countryCode)) return;

    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(code => code !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const renderCountryButton = (country: Country) => {
    const hasReal = hasRealData(country.code);
    const hasMock = hasMockData(country.code);
    const isSelected = selectedCountries.includes(country.code);
    
    return (
      <button
        key={country.code}
        onClick={() => handleCountryToggle(country.code)}
        disabled={!hasReal && selectedMetrics.length > 0 && !isSelected}
        className={`
          w-full text-left px-2 py-0.5 rounded flex items-center justify-between
          ${isSelected
            ? 'bg-accent-primary text-white hover:bg-accent-primary/80'
            : hasReal
            ? 'hover:bg-accent-secondary/20 text-text-primary'
            : 'text-text-secondary hover:bg-background-light cursor-not-allowed'
          }
          transition-colors duration-200
        `}
      >
        <span>{country.name}</span>
        <div className="flex space-x-1">
          {hasReal && (
            <span className="text-green-500" title="Has real data">●</span>
          )}
          {hasMock && (
            <span className="text-yellow-500" title="Has mock data">○</span>
          )}
        </div>
      </button>
    );
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-text-secondary mb-1">Select Countries</h3>
      <div className="max-h-[200px] overflow-y-auto bg-background-dark rounded-lg text-xs">
        <div className="p-2">
          <div className="mb-2">
            <div className="flex items-center justify-end space-x-2 text-[10px] text-text-secondary mb-1">
              <div className="flex items-center">
                <span className="text-green-500 mr-1">●</span> Real data
              </div>
              <div className="flex items-center">
                <span className="text-yellow-500 mr-1">○</span> Mock data
              </div>
            </div>
          </div>

          <div className="mb-1">
            <h4 className="text-text-secondary text-xs">North America</h4>
            <button
              onClick={() => handleCountryToggle('United States')}
              className={`w-full text-left px-2 py-0.5 rounded flex items-center justify-between
                ${selectedCountries.includes('United States')
                  ? 'bg-accent-primary text-white hover:bg-accent-primary/80'
                  : hasRealData('United States')
                  ? 'hover:bg-accent-secondary/20 text-text-primary'
                  : 'text-text-secondary hover:bg-background-light cursor-not-allowed'
                }
                transition-colors duration-200
              `}
            >
              <span>United States</span>
              <div className="flex space-x-1">
                {hasRealData('United States') && (
                  <span className="text-green-500" title="Has real data">●</span>
                )}
                {hasMockData('United States') && (
                  <span className="text-yellow-500" title="Has mock data">○</span>
                )}
              </div>
            </button>
            {AVAILABLE_COUNTRIES
              .filter(country => country.region === 'North America')
              .filter(country => country.code !== 'United States')
              .map(country => renderCountryButton(country))}
          </div>

          <div className="mb-1">
            <h4 className="text-text-secondary text-xs">Europe</h4>
            {AVAILABLE_COUNTRIES
              .filter(country => country.region === 'Europe')
              .map(country => renderCountryButton(country))}
          </div>

          <div className="mb-1">
            <h4 className="text-text-secondary text-xs">Asia</h4>
            {AVAILABLE_COUNTRIES
              .filter(country => country.region === 'Asia')
              .map(country => renderCountryButton(country))}
          </div>

          <div className="mb-1">
            <h4 className="text-text-secondary text-xs">Central America</h4>
            {AVAILABLE_COUNTRIES
              .filter(country => country.region === 'Central America')
              .map(country => renderCountryButton(country))}
          </div>

          <div>
            <h4 className="text-text-secondary text-xs">Oceania</h4>
            {AVAILABLE_COUNTRIES
              .filter(country => country.region === 'Oceania')
              .map(country => renderCountryButton(country))}
          </div>
        </div>
      </div>
      <div className="text-xs text-text-secondary mt-1">
        Selected: {selectedCountries.length} / {AVAILABLE_COUNTRIES.length}
      </div>
    </div>
  );
} 