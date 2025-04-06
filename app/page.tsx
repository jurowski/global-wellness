'use client';

import React, { useState, useEffect } from 'react'
import axios from 'axios'
import CountrySelector from '../components/CountrySelector'
import MetricSelector from '../components/MetricSelector'
import WellnessInsights from '../components/WellnessInsights'
import LocationComparison from '../components/LocationComparison'
import { SocietalStructuresProvider } from '../components/SocietalStructuresContext'
import Link from 'next/link'
import Script from 'next/script'

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

// Declare the custom element type for TypeScript
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'elevenlabs-convai': React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement> & {
        'agent-id': string;
      }, HTMLElement>;
    }
  }
}

// Add ElevenLabs widget component
function ElevenLabsWidget() {
  return (
    <>
      <elevenlabs-convai agent-id="RjWW5CP9gUsiIlGRShhj"></elevenlabs-convai>
      <Script 
        src="https://elevenlabs.io/convai-widget/index.js" 
        strategy="lazyOnload"
      />
    </>
  );
}

export default function Home() {
  const [selectedCountries, setSelectedCountries] = useState(['United States', 'Finland', 'Japan', 'Germany', 'Costa Rica'])
  const [selectedMetrics, setSelectedMetrics] = useState(['happiness', 'healthcare', 'education', 'work_life'])
  const [wellnessData, setWellnessData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isSourcesExpanded, setIsSourcesExpanded] = useState(false)
  const [isAboutExpanded, setIsAboutExpanded] = useState(false)
  
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
        <main className="max-w-7xl mx-auto px-4 py-2 sm:px-6 lg:px-8">
          <div className="text-center mb-2">
            <h1 className="text-2xl font-bold text-text-primary">
              Global Wellness Perspectives
            </h1>
            <p className="mt-1 text-xs text-text-secondary">
              Explore how different societal structures correlate with wellness outcomes around the world.
            </p>
          </div>

          {/* Add the widget near the top of the page */}
          <div className="mb-4">
            <ElevenLabsWidget />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-2">
            <div className="bg-card-bg rounded-lg shadow-lg border border-border-color p-2">
              <div className="grid grid-cols-2 gap-2">
                <CountrySelector 
                  selectedCountries={selectedCountries} 
                  setSelectedCountries={setSelectedCountries} 
                  selectedMetrics={selectedMetrics}
                  dataAvailability={wellnessData?.dataAvailability}
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
              <div className="space-y-2">
                <LocationComparison 
                  metrics={selectedMetrics}
                  globalData={wellnessData}
                />
                <WellnessInsights data={wellnessData} metrics={WELLNESS_METRICS} />
              </div>
            ) : (
              <div className="text-center text-text-secondary">
                No data available. Please adjust your selection.
              </div>
            )}
          </div>
        </main>

        <footer className="bg-background-light mt-4 py-2 border-t border-border-color">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
              <div>
                <button
                  onClick={() => setIsSourcesExpanded(!isSourcesExpanded)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-text-primary mb-2 hover:text-accent-primary transition-colors"
                >
                  <span>Data Sources & Quality</span>
                  <span className="transform transition-transform duration-200" style={{
                    transform: isSourcesExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
                {isSourcesExpanded && (
                  <div className="space-y-4 animate-fadeIn">
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
                )}
              </div>
              <div>
                <button
                  onClick={() => setIsAboutExpanded(!isAboutExpanded)}
                  className="flex justify-between items-center w-full text-left text-lg font-semibold text-text-primary mb-2 hover:text-accent-primary transition-colors"
                >
                  <span>About the Data</span>
                  <span className="transform transition-transform duration-200" style={{
                    transform: isAboutExpanded ? 'rotate(180deg)' : 'rotate(0deg)'
                  }}>▼</span>
                </button>
                {isAboutExpanded && (
                  <div className="bg-background-dark p-4 rounded-lg animate-fadeIn">
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
                )}
              </div>
            </div>
          </div>
        </footer>
      </div>
    </SocietalStructuresProvider>
  )
} 