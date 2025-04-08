import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { MockedProvider } from '@apollo/client/testing';
import CountryComparison from '../app/components/CountryComparison';
import { gql } from '@apollo/client';

// Extend the global Jest matchers
declare global {
  namespace jest {
    interface Matchers<R> {
      toBeInTheDocument(): R;
      toHaveTextContent(text: string): R;
    }
  }
}

const GET_COUNTRIES = gql`
  query GetCountries {
    countries {
      name
      countryCode
      region
      population
    }
  }
`;

const COMPARE_COUNTRIES = gql`
  query CompareCountries($countryCodes: [String!]!) {
    compareCountries(countryCodes: $countryCodes) {
      name
      countryCode
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
      education {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      work_life {
        value
        year
        source
        confidenceInterval
        isRealData
        category
      }
      social_support {
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

const mocks = [
  {
    request: {
      query: GET_COUNTRIES,
    },
    result: {
      data: {
        countries: [
          { name: 'United States', countryCode: 'US', region: 'North America', population: 331002651 },
          { name: 'Finland', countryCode: 'FI', region: 'Europe', population: 5540720 },
          { name: 'Japan', countryCode: 'JP', region: 'Asia', population: 125836021 },
        ],
      },
    },
  },
  {
    request: {
      query: COMPARE_COUNTRIES,
      variables: { countryCodes: ['US', 'FI'] },
    },
    result: {
      data: {
        compareCountries: [
          {
            name: 'United States',
            countryCode: 'US',
            region: 'North America',
            population: 331002651,
            happiness: { value: 7.0, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'happiness' },
            healthcare: { value: 8.0, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'healthcare' },
            education: { value: 7.5, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'education' },
            work_life: { value: 6.5, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'work_life' },
            social_support: { value: 7.2, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'social_support' },
          },
          {
            name: 'Finland',
            countryCode: 'FI',
            region: 'Europe',
            population: 5540720,
            happiness: { value: 7.8, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'happiness' },
            healthcare: { value: 8.5, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'healthcare' },
            education: { value: 8.0, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'education' },
            work_life: { value: 7.5, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'work_life' },
            social_support: { value: 7.8, year: 2023, source: 'Test', confidenceInterval: '±0.1', isRealData: true, category: 'social_support' },
          },
        ],
      },
    },
  },
];

describe('Country Comparison Tests', () => {
  it('should load and display country comparison data', async () => {
    const { container } = render(
      <MockedProvider mocks={mocks} addTypename={false}>
        <CountryComparison selectedMetrics={['happiness', 'healthcare', 'education', 'work_life']} />
      </MockedProvider>
    );

    // Wait for the countries to load in the select elements
    await waitFor(() => {
      const countrySelects = screen.getAllByRole('combobox');
      expect(countrySelects).toHaveLength(2);
      expect(countrySelects[0]).toHaveValue('United States');
      expect(countrySelects[1]).toHaveValue('Finland');
    });

    // Wait for the chart data to load
    await waitFor(() => {
      const chartContainer = container.querySelector('.recharts-responsive-container');
      expect(chartContainer).toBeInTheDocument();
    });

    // Check for metric labels
    const metricLabels = screen.getAllByText(/Happiness|Healthcare|Education|Work Life/);
    expect(metricLabels.length).toBeGreaterThan(0);

    // Check for country data cards
    const usCard = screen.getByRole('heading', { name: 'United States' });
    const fiCard = screen.getByRole('heading', { name: 'Finland' });
    expect(usCard).toBeInTheDocument();
    expect(fiCard).toBeInTheDocument();
  });
}); 