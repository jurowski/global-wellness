'use client';

import React from 'react';
import { CountryCode } from '../types';

interface CountrySelectorProps {
  selectedCountries: CountryCode[];
  setSelectedCountries: (countries: CountryCode[]) => void;
  selectedMetrics: string[];
  dataAvailability?: Record<CountryCode, Record<string, boolean>>;
}

// Define a list of available countries with their display names
const AVAILABLE_COUNTRIES: { code: CountryCode; name: string }[] = [
  { code: 'United States', name: 'United States' },
  { code: 'Finland', name: 'Finland' },
  { code: 'Japan', name: 'Japan' },
  { code: 'Germany', name: 'Germany' },
  { code: 'Costa Rica', name: 'Costa Rica' },
  { code: 'New Zealand', name: 'New Zealand' },
  { code: 'Denmark', name: 'Denmark' },
  { code: 'Canada', name: 'Canada' },
  { code: 'Netherlands', name: 'Netherlands' },
  { code: 'Switzerland', name: 'Switzerland' },
];

export const CountrySelector: React.FC<CountrySelectorProps> = ({
  selectedCountries,
  setSelectedCountries,
  selectedMetrics,
  dataAvailability = {},
}) => {
  const handleCountryToggle = (countryCode: CountryCode) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(code => code !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const hasRealData = (countryCode: CountryCode) => {
    if (!dataAvailability || !selectedMetrics || selectedMetrics.length === 0) return true;
    return selectedMetrics.every(metric => dataAvailability[countryCode]?.[metric]);
  };

  return (
    <div className="w-full">
      <h3 className="text-xs font-medium text-text-secondary mb-1">Select Countries</h3>
      <div className="max-h-[200px] overflow-y-auto bg-background-dark rounded-lg text-xs">
        <div className="p-2 space-y-1">
          {AVAILABLE_COUNTRIES.map(({ code, name }) => {
            const isSelected = selectedCountries.includes(code);
            const hasData = hasRealData(code);

            return (
              <button
                key={code}
                onClick={() => handleCountryToggle(code)}
                className={`
                  w-full text-left px-2 py-0.5 rounded flex items-center justify-between
                  ${isSelected
                    ? 'bg-accent-primary text-white hover:bg-accent-primary/80'
                    : hasData
                    ? 'hover:bg-accent-secondary/20 text-text-primary'
                    : 'text-text-secondary hover:bg-background-light'
                  }
                  transition-colors duration-200
                `}
              >
                <span>{name}</span>
                <div className="flex space-x-1">
                  {hasData && (
                    <span className="text-green-500" title="Has real data">●</span>
                  )}
                  {!hasData && (
                    <span className="text-yellow-500" title="Has mock data">○</span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div className="text-xs text-text-secondary mt-1">
        Selected: {selectedCountries.length} / {AVAILABLE_COUNTRIES.length}
      </div>
    </div>
  );
}; 