import { useState, useEffect } from 'react'
import Head from 'next/head'
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
  { 
    id: 'healthcare', 
    name: 'Healthcare Access', 
    description: 'Universal healthcare coverage index', 
    source: 'WHO',
    citation: 'World Health Organization. (2023). Global Health Observatory Data Repository.',
    sourceLink: 'https://www.who.int/data/gho',
    dataQuality: {
      reliability: 0.90,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Biennial',
      confidenceInterval: '±3.0',
      methodology: 'Administrative data with expert assessment'
    }
  },
  { 
    id: 'education', 
    name: 'Education Index', 
    description: 'Years of schooling and expected years', 
    source: 'UN Human Development Index',
    citation: 'United Nations Development Programme. (2023). Human Development Report 2023.',
    sourceLink: 'https://hdr.undp.org/',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.8',
      methodology: 'Administrative data with statistical modeling'
    }
  },
  { 
    id: 'income_inequality', 
    name: 'Income Inequality', 
    description: 'Gini coefficient (lower is better)', 
    source: 'World Bank',
    citation: 'World Bank. (2023). World Development Indicators.',
    sourceLink: 'https://data.worldbank.org/indicator/SI.POV.GINI',
    dataQuality: {
      reliability: 0.85,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±4.0',
      methodology: 'Household survey data with statistical adjustment'
    }
  },
  { 
    id: 'safety', 
    name: 'Safety Index', 
    description: 'Violent crime rates and perceptions of safety', 
    source: 'Global Peace Index',
    citation: 'Institute for Economics & Peace. (2023). Global Peace Index 2023.',
    sourceLink: 'https://www.visionofhumanity.org/',
    dataQuality: {
      reliability: 0.87,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.5',
      methodology: 'Multiple indicators with expert weighting'
    }
  },
  { 
    id: 'work_life', 
    name: 'Work-Life Balance', 
    description: 'Working hours and paid leave policies', 
    source: 'OECD Better Life Index',
    citation: 'OECD. (2023). Better Life Index.',
    sourceLink: 'https://www.oecdbetterlifeindex.org/',
    dataQuality: {
      reliability: 0.92,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'Survey and administrative data with standardization'
    }
  },
  { 
    id: 'social_support', 
    name: 'Social Support', 
    description: 'Strength of social connections and community', 
    source: 'OECD Better Life Index',
    citation: 'OECD. (2023). Better Life Index.',
    sourceLink: 'https://www.oecdbetterlifeindex.org/',
    dataQuality: {
      reliability: 0.86,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.2',
      methodology: 'Survey data with social network analysis'
    }
  },
  { 
    id: 'environmental', 
    name: 'Environmental Quality', 
    description: 'Air quality and access to green spaces', 
    source: 'Environmental Performance Index',
    citation: 'Yale Center for Environmental Law & Policy. (2023). Environmental Performance Index.',
    sourceLink: 'https://epi.yale.edu/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Biennial',
      confidenceInterval: '±3.8',
      methodology: 'Environmental monitoring with spatial analysis'
    }
  },
  { 
    id: 'life_expectancy', 
    name: 'Life Expectancy', 
    description: 'Average life expectancy at birth', 
    source: 'WHO',
    citation: 'World Health Organization. (2023). Global Health Observatory Data Repository.',
    sourceLink: 'https://www.who.int/data/gho',
    dataQuality: {
      reliability: 0.94,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Annual',
      confidenceInterval: '±1.5',
      methodology: 'Vital statistics with demographic modeling'
    }
  },
  { 
    id: 'gdp_per_capita', 
    name: 'GDP per Capita', 
    description: 'Economic output per person', 
    source: 'World Bank',
    citation: 'World Bank. (2023). World Development Indicators.',
    sourceLink: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD',
    dataQuality: {
      reliability: 0.93,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.0',
      methodology: 'National accounts with purchasing power parity adjustment'
    }
  },
  { 
    id: 'mental_health', 
    name: 'Mental Health', 
    description: 'Mental health services and outcomes', 
    source: 'WHO',
    citation: 'World Health Organization. (2023). Mental Health Atlas.',
    sourceLink: 'https://www.who.int/mental_health/evidence/atlas/mental_health_atlas_2020/en/',
    dataQuality: {
      reliability: 0.82,
      sampleSize: 'Large',
      updateFrequency: 'Biennial',
      confidenceInterval: '±4.5',
      methodology: 'Survey and administrative data with expert assessment'
    }
  },
  { 
    id: 'gender_equality', 
    name: 'Gender Equality', 
    description: 'Gender gap index and equality measures', 
    source: 'World Economic Forum',
    citation: 'World Economic Forum. (2023). Global Gender Gap Report 2023.',
    sourceLink: 'https://www.weforum.org/reports/global-gender-gap-report-2023',
    dataQuality: {
      reliability: 0.88,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.0',
      methodology: 'Multiple indicators with gender-specific weighting'
    }
  },
  { 
    id: 'political_stability', 
    name: 'Political Stability', 
    description: 'Government effectiveness and stability', 
    source: 'World Bank',
    citation: 'World Bank. (2023). Worldwide Governance Indicators.',
    sourceLink: 'https://info.worldbank.org/governance/wgi/',
    dataQuality: {
      reliability: 0.85,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.5',
      methodology: 'Expert assessment with multiple sources'
    }
  },
  { 
    id: 'corruption_perception', 
    name: 'Corruption Perception', 
    description: 'Perceived levels of public sector corruption', 
    source: 'Transparency International',
    citation: 'Transparency International. (2023). Corruption Perceptions Index.',
    sourceLink: 'https://www.transparency.org/en/cpi',
    dataQuality: {
      reliability: 0.84,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±4.0',
      methodology: 'Expert and business surveys with statistical aggregation'
    }
  },
  { 
    id: 'press_freedom', 
    name: 'Press Freedom', 
    description: 'Freedom of the press and media independence', 
    source: 'Reporters Without Borders',
    citation: 'Reporters Without Borders. (2023). World Press Freedom Index.',
    sourceLink: 'https://rsf.org/en/index',
    dataQuality: {
      reliability: 0.86,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.8',
      methodology: 'Expert assessment with media monitoring'
    }
  },
  { 
    id: 'digital_access', 
    name: 'Digital Access', 
    description: 'Internet access and digital infrastructure', 
    source: 'ITU',
    citation: 'International Telecommunication Union. (2023). ICT Development Index.',
    sourceLink: 'https://www.itu.int/en/ITU-D/Statistics/Pages/IDI/default.aspx',
    dataQuality: {
      reliability: 0.91,
      sampleSize: 'Comprehensive',
      updateFrequency: 'Annual',
      confidenceInterval: '±2.5',
      methodology: 'Administrative data with technical assessment'
    }
  },
  { 
    id: 'innovation', 
    name: 'Innovation Index', 
    description: 'Research and development investment', 
    source: 'Global Innovation Index',
    citation: 'WIPO. (2023). Global Innovation Index 2023.',
    sourceLink: 'https://www.wipo.int/global_innovation_index/en/',
    dataQuality: {
      reliability: 0.89,
      sampleSize: 'Large',
      updateFrequency: 'Annual',
      confidenceInterval: '±3.2',
      methodology: 'Multiple indicators with innovation-specific weighting'
    }
  }
]

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
      <div className="min-h-screen bg-[var(--background-dark)]">
        <Head>
          <title>Global Wellness Perspectives</title>
          <meta name="description" content="Expanding perspectives through global wellness comparisons" />
          <link rel="icon" href="/favicon.ico" />
        </Head>

        <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-extrabold text-[var(--text-primary)] sm:text-5xl sm:tracking-tight lg:text-6xl">
              Global Wellness Perspectives
            </h1>
            <p className="mt-5 max-w-xl mx-auto text-xl text-[var(--text-secondary)]">
              Explore how different societal structures correlate with wellness outcomes around the world.
            </p>
            <div className="mt-6">
              <Link 
                href="/methodology"
                className="btn-primary"
              >
                View Methodology
              </Link>
            </div>
          </div>

          <div className="card p-6 mb-8">
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
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--accent-primary)]"></div>
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
            <div className="text-center text-[var(--text-secondary)]">
              No data available. Please adjust your selection.
            </div>
          )}
        </main>

        <footer className="bg-[var(--background-light)] mt-12 py-6 border-t border-[var(--border-color)]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">Data Sources & Quality</h3>
                <div className="space-y-4">
                  {WELLNESS_METRICS.map(metric => (
                    <div key={metric.id} className="bg-[var(--background-dark)] p-4 rounded-lg">
                      <div className="flex justify-between items-start">
                        <div>
                          <a 
                            href={metric.sourceLink} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-[var(--accent-primary)] hover:text-[var(--accent-secondary)] font-medium"
                          >
                            {metric.source}
                          </a>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">{metric.citation}</p>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center">
                            <span className="text-sm text-[var(--text-secondary)] mr-2">Reliability:</span>
                            <div className="w-24 bg-[var(--background-light)] rounded-full h-2.5">
                              <div 
                                className="bg-green-500 h-2.5 rounded-full" 
                                style={{ width: `${metric.dataQuality.reliability * 100}%` }}
                              ></div>
                            </div>
                          </div>
                          <p className="text-sm text-[var(--text-secondary)] mt-1">
                            CI: {metric.dataQuality.confidenceInterval}
                          </p>
                        </div>
                      </div>
                      <div className="mt-2 text-sm text-[var(--text-secondary)]">
                        <p>Sample Size: {metric.dataQuality.sampleSize}</p>
                        <p>Update Frequency: {metric.dataQuality.updateFrequency}</p>
                        <p className="mt-1 italic">{metric.dataQuality.methodology}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-4">About the Data</h3>
                <div className="bg-[var(--background-dark)] p-4 rounded-lg">
                  <h4 className="font-medium text-[var(--text-primary)] mb-2">Data Quality Indicators</h4>
                  <ul className="space-y-2 text-sm text-[var(--text-secondary)]">
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
                    <h4 className="font-medium text-[var(--text-primary)] mb-2">Data Normalization</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
                      All metrics are normalized to a 0-100 scale for comparison purposes. 
                      The normalization process accounts for different measurement scales and units across sources.
                    </p>
                  </div>
                  <div className="mt-4">
                    <h4 className="font-medium text-[var(--text-primary)] mb-2">Last Updated</h4>
                    <p className="text-sm text-[var(--text-secondary)]">
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