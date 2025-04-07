'use client';

import { gql, useQuery } from '@apollo/client';
import { useState } from 'react';

const SEARCH_COUNTRIES = gql`
  query SearchCountries($query: String!) {
    searchCountries(query: $query) {
      name
      code
      region
      population
      happiness {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      healthcare {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
    }
  }
`;

export default function WellnessData() {
  const [searchQuery, setSearchQuery] = useState('');
  const { loading, error, data } = useQuery(SEARCH_COUNTRIES, {
    variables: { query: searchQuery || 'United' }, // Default to searching for 'United'
  });

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Search Countries</h2>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search countries..."
          className="w-full p-2 rounded-lg bg-gray-700 text-white mb-4"
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <p>Error: {error.message}</p>}
      
      {data && (
        <div>
          <h2 className="text-2xl font-bold mb-4">Wellness Data</h2>
          <div className="grid gap-6">
            {data.searchCountries.map((country: any) => (
              <div key={country.code} className="bg-gray-800 p-6 rounded-lg">
                <div className="flex justify-between items-start mb-4">
                  <h3 className="text-xl font-semibold">{country.name}</h3>
                  <div className="text-sm text-gray-400">
                    <p>Region: {country.region}</p>
                    <p>Population: {country.population.toLocaleString()}</p>
                  </div>
                </div>
                
                {country.happiness && (
                  <div className="mb-4">
                    <h4 className="font-medium">Happiness</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Value: {country.happiness.value.toFixed(2)}</p>
                      <p>Year: {country.happiness.year}</p>
                      <p>Source: {country.happiness.source}</p>
                      <p>Confidence: {country.happiness.confidenceInterval}</p>
                      <p>Real Data: {country.happiness.isRealData ? 'Yes' : 'No'}</p>
                      <p>Category: {country.happiness.category}</p>
                    </div>
                  </div>
                )}

                {country.healthcare && (
                  <div>
                    <h4 className="font-medium">Healthcare</h4>
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <p>Value: {country.healthcare.value.toFixed(2)}</p>
                      <p>Year: {country.healthcare.year}</p>
                      <p>Source: {country.healthcare.source}</p>
                      <p>Confidence: {country.healthcare.confidenceInterval}</p>
                      <p>Real Data: {country.healthcare.isRealData ? 'Yes' : 'No'}</p>
                      <p>Category: {country.healthcare.category}</p>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
} 