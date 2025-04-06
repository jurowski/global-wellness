// pages/index.js
import { useState, useEffect } from 'react';
import Head from 'next/head';
import axios from 'axios';
import WellnessComparison from '../components/WellnessComparison';
import CountrySelector from '../components/CountrySelector';
import MetricSelector from '../components/MetricSelector';
import WellnessInsights from '../components/WellnessInsights';
import SocietalStructuresContext from '../components/SocietalStructuresContext';
import EducationalResources from '../components/EducationalResources';
import FAQ from '../components/FAQ';

// List of metrics we want to compare
const WELLNESS_METRICS = [
  { id: 'happiness', name: 'Happiness Index', description: 'World Happiness Report score', source: 'World Happiness Report' },
  { id: 'healthcare', name: 'Healthcare Access', description: 'Universal healthcare coverage index', source: 'WHO' },
  { id: 'education', name: 'Education Index', description: 'Years of schooling and expected years', source: 'UN Human Development Index' },
  { id: 'income_inequality', name: 'Income Inequality', description: 'Gini coefficient (lower is better)', source: 'World Bank' },
  { id: 'safety', name: 'Safety Index', description: 'Violent crime rates and perceptions of safety', source: 'Global Peace Index' },
  { id: 'work_life', name: 'Work-Life Balance', description: 'Working hours and paid leave policies', source: 'OECD Better Life Index' },
  { id: 'social_support', name: 'Social Support', description: 'Strength of social connections and community', source: 'OECD Better Life Index' },
  { id: 'environmental', name: 'Environmental Quality', description: 'Air quality and access to green spaces', source: 'Environmental Performance Index' },
];

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState(['USA', 'Finland', 'Japan', 'Germany', 'Costa Rica']);
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'healthcare', 'education', 'work_life']);
  const [wellnessData, setWellnessData] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        // In a real application, you would fetch this data from an API
        // For prototype purposes, we'll simulate the data
        const response = await axios.get('/api/wellness-data', {
          params: { 
            countries: selectedCountries.join(','),
            metrics: selectedMetrics.join(',')
          }
        });
        setWellnessData(response.data);
      } catch (error) {
        console.error('Error fetching wellness data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [selectedCountries, selectedMetrics]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <Head>
        <title>Global Wellness Perspectives</title>
        <meta name="description" content="Expanding perspectives through global wellness comparisons" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Global Wellness Perspectives
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Explore how different societal structures correlate with wellness outcomes around the world.
          </p>
        </div>

        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <CountrySelector 
              selectedCountries={selectedCountries} 
              setSelectedCountries={setSelectedCountries} 
            />
            <MetricSelector 
              metrics={WELLNESS_METRICS}
              selectedMetrics={selectedMetrics} 
              setSelectedMetrics={setSelectedMetrics} 
            />
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : wellnessData ? (
          <>
            <WellnessComparison data={wellnessData} metrics={WELLNESS_METRICS} />
            <SocietalStructuresContext selectedCountries={selectedCountries} />
            <WellnessInsights data={wellnessData} metrics={WELLNESS_METRICS} />
            <EducationalResources />
            <FAQ />
          </>
        ) : (
          <div className="text-center text-gray-500">
            No data available. Please adjust your selection.
          </div>
        )}
      </main>

      <footer className="bg-white mt-12 py-6 border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            Data sources include: World Happiness Report, WHO, UN Human Development Index, World Bank, Global Peace Index, OECD Better Life Index
          </p>
        </div>
      </footer>
    </div>
  );
}
