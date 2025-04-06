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
}

const AVAILABLE_COUNTRIES: Country[] = [
  { code: 'USA', name: 'United States', region: 'North America' },
  { code: 'FIN', name: 'Finland', region: 'Europe' },
  { code: 'JPN', name: 'Japan', region: 'Asia' },
  { code: 'DEU', name: 'Germany', region: 'Europe' },
  { code: 'CRI', name: 'Costa Rica', region: 'Central America' },
  { code: 'NZL', name: 'New Zealand', region: 'Oceania' },
  { code: 'DNK', name: 'Denmark', region: 'Europe' },
  { code: 'CAN', name: 'Canada', region: 'North America' },
  { code: 'NLD', name: 'Netherlands', region: 'Europe' },
  { code: 'CHE', name: 'Switzerland', region: 'Europe' },
];

export default function CountrySelector({
  selectedCountries,
  setSelectedCountries,
}: CountrySelectorProps) {
  const handleCountryToggle = (countryCode: string) => {
    if (selectedCountries.includes(countryCode)) {
      setSelectedCountries(selectedCountries.filter(code => code !== countryCode));
    } else {
      setSelectedCountries([...selectedCountries, countryCode]);
    }
  };

  const groupedCountries = AVAILABLE_COUNTRIES.reduce((acc, country) => {
    if (!acc[country.region]) {
      acc[country.region] = [];
    }
    acc[country.region].push(country);
    return acc;
  }, {} as Record<string, Country[]>);

  return (
    <div className="bg-card-bg rounded-lg p-6">
      <h3 className="text-lg font-semibold text-text-primary mb-4">
        Select Countries
      </h3>
      <div className="space-y-4">
        {Object.entries(groupedCountries).map(([region, countries]) => (
          <div key={region}>
            <h4 className="text-sm font-medium text-text-secondary mb-2">{region}</h4>
            <div className="grid grid-cols-2 gap-2">
              {countries.map((country) => (
                <button
                  key={country.code}
                  onClick={() => handleCountryToggle(country.code)}
                  className={`
                    px-3 py-2 rounded-md text-sm font-medium
                    transition-colors duration-200 ease-in-out
                    ${
                      selectedCountries.includes(country.code)
                        ? 'bg-accent-primary text-white'
                        : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
                    }
                  `}
                >
                  {country.name}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4">
        <p className="text-sm text-text-secondary">
          Selected: {selectedCountries.length} / {AVAILABLE_COUNTRIES.length}
        </p>
      </div>
    </div>
  );
} 