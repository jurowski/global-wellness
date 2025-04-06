import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Label,
  ReferenceLine,
  LineChart,
  Line,
  Brush
} from 'recharts';

interface GlobalData {
  countries: string[];
  metrics: Record<string, Record<string, number>>;
  sources: string[];
}

interface LocationComparisonProps {
  metrics: string[];
  globalData: GlobalData;
}

interface LocationState {
  loading: boolean;
  error: string | null;
  country: string | null;
  data: any[] | null;
  sortBy: 'name' | 'difference' | 'value';
  sortDirection: 'asc' | 'desc';
  focusBar: string | null;
  selectedMetric: string | null;
  detailedView: boolean;
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (!active || !payload || !payload.length) return null;

  const localValue = payload[0].value;
  const globalValue = payload[1].value;
  const difference = ((localValue - globalValue) / globalValue * 100).toFixed(1);
  const isPositive = localValue > globalValue;

  return (
    <div className="bg-white/10 backdrop-blur-md p-4 rounded-lg border border-gray-200/20 shadow-xl">
      <p className="font-semibold mb-2">{label}</p>
      {payload.map((entry: any, index: number) => (
        <p key={index} className="text-sm" style={{ color: entry.color }}>
          {entry.name}: {entry.value.toFixed(1)}
        </p>
      ))}
      <div className="mt-2 pt-2 border-t border-gray-200/20">
        <p className={`text-sm ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
          {isPositive ? '↑' : '↓'} {Math.abs(Number(difference))}% vs Global Average
        </p>
      </div>
    </div>
  );
};

const DetailedMetricView = ({ 
  metric, 
  country, 
  globalData, 
  onClose 
}: { 
  metric: string; 
  country: string; 
  globalData: any; 
  onClose: () => void;
}) => {
  // Prepare detailed data for the selected metric
  const allCountries = Object.entries(globalData)
    .map(([countryName, data]: [string, any]) => ({
      country: countryName,
      value: data[metric] || 0
    }))
    .sort((a, b) => b.value - a.value);

  const countryRank = allCountries.findIndex(c => c.country === country) + 1;
  const totalCountries = allCountries.length;
  const percentile = ((totalCountries - countryRank) / totalCountries * 100).toFixed(1);

  return (
    <div className="absolute inset-0 bg-gray-900/95 backdrop-blur-sm rounded-xl p-8">
      <button
        onClick={onClose}
        className="absolute top-4 right-4 text-gray-400 hover:text-white"
      >
        ✕
      </button>
      <h3 className="text-xl font-bold mb-6 text-white">
        {metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white/5 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-white">Rankings</h4>
          <p className="text-gray-300 mb-2">
            {country} ranks <span className="text-blue-400 font-bold">#{countryRank}</span> out of {totalCountries} countries
          </p>
          <p className="text-gray-300">
            Better than <span className="text-green-400 font-bold">{percentile}%</span> of countries
          </p>
        </div>
        <div className="bg-white/5 rounded-lg p-6">
          <h4 className="text-lg font-semibold mb-4 text-white">Distribution</h4>
          <div className="h-40">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={allCountries}>
                <XAxis 
                  dataKey="country" 
                  tick={false}
                  stroke="rgba(255,255,255,0.2)"
                />
                <YAxis 
                  domain={[0, 100]}
                  tick={{ fill: 'white' }}
                  stroke="rgba(255,255,255,0.2)"
                />
                <Tooltip
                  content={({ active, payload }) => {
                    if (!active || !payload?.length) return null;
                    const value = payload[0]?.value;
                    if (typeof value !== 'number') return null;
                    return (
                      <div className="bg-white/10 backdrop-blur-md p-2 rounded border border-gray-200/20">
                        <p className="text-white">{payload[0].payload.country}</p>
                        <p className="text-blue-400">{value.toFixed(1)}</p>
                      </div>
                    );
                  }}
                />
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke="#4a90e2"
                  dot={false}
                  strokeWidth={2}
                />
                <ReferenceLine
                  x={countryRank - 1}
                  stroke="#4a90e2"
                  strokeDasharray="3 3"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function LocationComparison({ metrics, globalData }: LocationComparisonProps) {
  const [locationState, setLocationState] = useState<LocationState>({
    loading: true,
    error: null,
    country: null,
    data: null,
    sortBy: 'difference',
    sortDirection: 'desc',
    focusBar: null,
    selectedMetric: null,
    detailedView: false
  });

  useEffect(() => {
    async function getUserLocation() {
      try {
        // Check if geolocation is supported
        if (!navigator.geolocation) {
          throw new Error('Geolocation is not supported by your browser');
        }

        // Get user's position
        const position = await new Promise<GeolocationPosition>((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 5000,
            maximumAge: 0
          });
        });

        // Get API key from environment variable
        const apiKey = process.env.NEXT_PUBLIC_OPENCAGE_API_KEY;
        if (!apiKey || apiKey === 'your_opencage_api_key_here') {
          throw new Error('OpenCage API key is not configured. Please add your API key to .env.local');
        }

        // Reverse geocode the coordinates
        const { data } = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?q=${position.coords.latitude}+${position.coords.longitude}&key=${apiKey}`
        );

        if (!data.results?.length) {
          throw new Error('Could not determine your location');
        }

        // Get country from results
        const country = data.results[0].components.country;
        if (!country) {
          throw new Error('Could not determine your country');
        }

        // Prepare comparison data
        const comparisonData = metrics.map(metric => {
          // Get the metric data for the current country
          const countryValue = globalData.metrics[metric]?.[country] || 0;
          
          // Calculate global average from the metrics data
          const allValues = Object.values(globalData.metrics[metric] || {});
          const globalAverage = allValues.length > 0
            ? allValues.reduce((sum: number, val: number) => sum + val, 0) / allValues.length
            : 0;

          return {
            name: metric,
            'Your Location': countryValue,
            'Global Average': globalAverage
          };
        });

        setLocationState({
          loading: false,
          error: null,
          country,
          data: comparisonData,
          sortBy: 'difference',
          sortDirection: 'desc',
          focusBar: null,
          selectedMetric: null,
          detailedView: false
        });

      } catch (error: any) {
        let errorMessage = 'An error occurred while getting your location';
        
        if (error.code === 1) {
          errorMessage = 'Location access was denied. Please enable location services to see how your country compares.';
        } else if (error.code === 2) {
          errorMessage = 'Could not determine your location. Please check your connection and try again.';
        } else if (error.code === 3) {
          errorMessage = 'Location request timed out. Please try again.';
        } else if (error.response?.status === 401) {
          errorMessage = 'Invalid or missing API key. Please check your OpenCage API configuration.';
        } else if (error.message) {
          errorMessage = error.message;
        }

        setLocationState({
          loading: false,
          error: errorMessage,
          country: null,
          data: null,
          sortBy: 'difference',
          sortDirection: 'desc',
          focusBar: null,
          selectedMetric: null,
          detailedView: false
        });
        console.error('Location error:', error);
      }
    }

    getUserLocation();
  }, [metrics, globalData]);

  const formatMetricName = (name: string) => {
    return name
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const sortData = (data: any[]) => {
    return [...data].sort((a, b) => {
      let compareA, compareB;
      
      switch (locationState.sortBy) {
        case 'name':
          compareA = a.name;
          compareB = b.name;
          break;
        case 'difference':
          compareA = (a['Your Location'] - a['Global Average']);
          compareB = (b['Your Location'] - b['Global Average']);
          break;
        case 'value':
          compareA = a['Your Location'];
          compareB = b['Your Location'];
          break;
        default:
          return 0;
      }

      const comparison = compareA > compareB ? 1 : -1;
      return locationState.sortDirection === 'asc' ? comparison : -comparison;
    });
  };

  const handleSort = (type: 'name' | 'difference' | 'value') => {
    setLocationState(prev => ({
      ...prev,
      sortBy: type,
      sortDirection: prev.sortBy === type ? 
        (prev.sortDirection === 'asc' ? 'desc' : 'asc') : 
        'desc'
    }));
  };

  const handleLegendMouseEnter = (entry: any) => {
    setLocationState(prev => ({
      ...prev,
      focusBar: entry.dataKey
    }));
  };

  const handleLegendMouseLeave = () => {
    setLocationState(prev => ({
      ...prev,
      focusBar: null
    }));
  };

  const handleBarClick = (data: any) => {
    setLocationState(prev => ({
      ...prev,
      selectedMetric: data.name,
      detailedView: true
    }));
  };

  const handleCloseDetailedView = () => {
    setLocationState(prev => ({
      ...prev,
      selectedMetric: null,
      detailedView: false
    }));
  };

  const prepareComparisonData = () => {
    return metrics.map(metric => {
      // Get the US value
      const usValue = globalData.metrics[metric]?.['United States'] || 0;
      
      // Calculate global average excluding US
      const otherCountries = globalData.countries.filter(c => c !== 'United States');
      const globalValues = otherCountries.map(country => globalData.metrics[metric]?.[country] || 0);
      const globalAverage = globalValues.length > 0 
        ? globalValues.reduce((sum, val) => sum + val, 0) / globalValues.length 
        : 0;

      return {
        name: metric.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' '),
        'United States': usValue,
        'Global Average': globalAverage
      };
    });
  };

  const data = prepareComparisonData();

  if (locationState.loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (locationState.error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500 mb-4">{locationState.error}</p>
        <p className="text-gray-400">
          You can still explore global wellness data using the controls above.
        </p>
      </div>
    );
  }

  if (!locationState.data || !locationState.country) {
    return (
      <div className="p-8 text-center text-gray-400">
        No comparison data available.
      </div>
    );
  }

  return (
    <div className="bg-card-bg rounded-lg p-4">
      <h3 className="text-sm font-medium text-text-primary mb-2">
        How United States Compares Globally
      </h3>
      <div className="flex gap-2 mb-2 text-xs">
        <button
          onClick={() => handleSort('name')}
          className={`px-2 py-1 rounded ${
            locationState.sortBy === 'name' ? 'bg-accent-primary' : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
          }`}
        >
          Sort by Name
        </button>
        <button
          onClick={() => handleSort('difference')}
          className={`px-2 py-1 rounded ${
            locationState.sortBy === 'difference' ? 'bg-accent-primary' : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
          }`}
        >
          Sort by Difference
        </button>
        <button
          onClick={() => handleSort('value')}
          className={`px-2 py-1 rounded ${
            locationState.sortBy === 'value' ? 'bg-accent-primary' : 'bg-background-light text-text-secondary hover:bg-accent-secondary/20'
          }`}
        >
          Sort by Value
        </button>
      </div>
      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border-color)" />
            <XAxis
              type="number"
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
            />
            <YAxis
              dataKey="name"
              type="category"
              stroke="var(--text-secondary)"
              tick={{ fill: 'var(--text-secondary)', fontSize: 12 }}
              width={120}
            />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="United States" fill="#4a90e2" radius={[0, 4, 4, 0]} />
            <Bar dataKey="Global Average" fill="#82ca9d" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
      <p className="text-xs text-text-secondary mt-2 text-center">
        This chart compares wellness metrics in United States with global averages. Higher values indicate better outcomes.
      </p>
      {locationState.detailedView && locationState.selectedMetric && (
        <DetailedMetricView
          metric={locationState.selectedMetric}
          country={locationState.country!}
          globalData={globalData}
          onClose={handleCloseDetailedView}
        />
      )}
    </div>
  );
} 