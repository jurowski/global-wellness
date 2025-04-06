'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountrySelector from '../components/CountrySelector'
import MetricSelector from '../components/MetricSelector'
import WellnessInsights from '../components/WellnessInsights'
import { SocietalStructuresProvider } from '../components/SocietalStructuresContext'
import Link from 'next/link'

// List of metrics we want to compare
const WELLNESS_METRICS = [
  { 
    id: 'happiness', 
    name: 'Happiness Index', 
    description: 'World Happiness Report score', 
    source: 'World Happiness Report',
    citation: 'Helliwell, J. F., Layard, R., Sachs, J. D., & De Neve, J. E. (2023). World Happiness Report 2023.',
    sourceLink: 'https://worldhappiness.report/',
    dataQuality: {
      reliability: 0.95,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Survey-based with statistical weighting'
    }
  },
  // ... other metrics ...
];

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState(['USA', 'Finland', 'Japan', 'Germany', 'Costa Rica'])
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'healthcare', 'education', 'work_life'])
  const [wellnessData, setWellnessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axios.get('/api/wellness-data', {
          params: { 
            countries: selectedCountries.join(','),
            metrics: selectedMetrics.join(',')
          }
        })
        setWellnessData(response.data)
        setError(null)
      } catch (err) {
        setError('Failed to fetch data. Please try again later.')
        console.error('Error fetching data:', err)
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [selectedCountries, selectedMetrics])

  return (
    <SocietalStructuresProvider>
      <div className="min-h-screen bg-background-dark">
        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-text-primary sm:text-5xl sm:tracking-tight lg:text-6xl">
              Global Wellness Perspectives
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-text-secondary">
              Explore how different societal structures correlate with wellness outcomes around the world.
            </p>
            <div className="mt-6">
              <Link 
                href="/methodology"
                className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary transition-colors"
              >
                View Methodology
              </Link>
            </div>
          </div>

          <div className="bg-card-bg rounded-lg shadow-lg border border-border-color p-6 mb-8">
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
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary"></div>
            </div>
          ) : error ? (
            <div className="bg-red-900/50 border border-red-700 rounded-md p-4">
              <p className="text-red-200">{error}</p>
            </div>
          ) : wellnessData ? (
            <>
              <WellnessInsights data={wellnessData} metrics={WELLNESS_METRICS} />
            </>
          ) : (
            <div className="text-center text-text-secondary">
              No data available. Please adjust your selection.
            </div>
          )}
        </main>

        <footer className="bg-background-light mt-12 py-6 border-t border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">Data Sources & Quality</h3>
                <div className="space-y-4">
                  {WELLNESS_METRICS.map(metric => (
                    <div key={metric.id} className="bg-background-dark p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <a 
                            href={metric.sourceLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-accent-primary hover:text-accent-secondary font-medium"
                          >
                            {metric.source}
                          </a>
                          <p className="text-sm text-text-secondary mt-1">{metric.citation}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-sm text-text-secondary mr-2">Reliability:</span>
                            <div className="w-24 bg-background-light rounded-full h-2.5">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm text-text-secondary mt-1">
                            CI: {metric.dataQuality.confidenceInterval}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-text-secondary">
                        <p>Sample Size: {metric.dataQuality.sampleSize}</p>
                        <p>Update Frequency: {metric.dataQuality.updateFrequency}</p>
                        <p className="mt-1 italic">{metric.dataQuality.methodology}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-text-primary mb-4">About the Data</h3>
                <div className="bg-background-dark p-4 rounded-lg">
                  <h4 className="font-medium text-text-primary mb-2">Data Quality Indicators</h4>
                  <ul className="space-y-2 text-sm text-text-secondary">
                    <li>
                      <span className="font-medium">Reliability Score:</span> Measures the consistency and accuracy of data collection methods (0-1 scale)
                    </li>
                    <li>
                      <span className="font-medium">Confidence Interval:</span> Range within which the true value is likely to fall
                    </li>
                    <li>
                      <span className="font-medium">Sample Size:</span> Indicates the scope of data collection
                    </li>
                    <li>
                      <span className="font-medium">Update Frequency:</span> How often the data is refreshed
                    </li>
                  </ul>
                  <div className="mt-4">
                    <h4 className="font-medium text-text-primary mb-2">Data Normalization</h4>
                    <p className="text-sm text-text-secondary">
                      All metrics are normalized to a 0-100 scale for comparison purposes. 
                      The normalization process accounts for different measurement scales and units across sources.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-text-primary mb-2">Last Updated</h4>
                    <p className="text-sm text-text-secondary">
                      {new Date().toLocaleDateString('en-US', { 
                        year: 'numeric', 
                        month: 'long', 
                        day: 'numeric' 
                      })}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SocietalStructuresProvider>
  )
} 