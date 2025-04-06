import Link from 'next/link'

export default function Methodology() {
  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <header className="bg-[var(--background-light)] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              Methodology
            </h1>
            <Link href="/" className="text-[var(--text-secondary)] hover:text-[var(--text-primary)]">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="card">
          <div className="px-4 py-5 sm:p-6">
            <div className="space-y-8">
              {/* Data Collection Process */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Data Collection Process</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>Our data collection process involves aggregating information from multiple authoritative sources:</p>
                  <ul>
                    <li><strong className="text-[var(--text-primary)]">World Happiness Report:</strong> Annual survey data measuring subjective well-being</li>
                    <li><strong className="text-[var(--text-primary)]">WHO Health Statistics:</strong> Comprehensive healthcare metrics and outcomes</li>
                    <li><strong className="text-[var(--text-primary)]">UNESCO Education Database:</strong> Educational statistics and accessibility measures</li>
                    <li><strong className="text-[var(--text-primary)]">OECD Better Life Index:</strong> Work-life balance and quality of life indicators</li>
                  </ul>
                </div>
              </section>

              {/* Quality Assessment */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Quality Assessment Framework</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>Each metric undergoes rigorous quality assessment based on:</p>
                  <ul>
                    <li><strong className="text-[var(--text-primary)]">Reliability Score:</strong> Calculated using test-retest methodology and internal consistency measures</li>
                    <li><strong className="text-[var(--text-primary)]">Sample Size:</strong> Minimum thresholds for statistical significance</li>
                    <li><strong className="text-[var(--text-primary)]">Update Frequency:</strong> Regular data refresh cycles</li>
                    <li><strong className="text-[var(--text-primary)]">Source Credibility:</strong> Evaluation of data provider reputation and methodology</li>
                  </ul>
                </div>
              </section>

              {/* Data Processing */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Data Processing and Normalization</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>Our data processing pipeline includes:</p>
                  <ol>
                    <li>Raw data collection from primary sources</li>
                    <li>Standardization to common scales (0-100)</li>
                    <li>Outlier detection and handling</li>
                    <li>Missing data imputation using advanced statistical methods</li>
                    <li>Confidence interval calculations</li>
                  </ol>
                </div>
              </section>

              {/* Historical Data */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Historical Data Analysis</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>Historical trends are analyzed through:</p>
                  <ul>
                    <li>Time series analysis from 2010 to present</li>
                    <li>Trend identification and validation</li>
                    <li>Seasonal adjustment where applicable</li>
                    <li>Change point detection for significant shifts</li>
                  </ul>
                </div>
              </section>

              {/* Limitations */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Limitations and Considerations</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <ul>
                    <li>Data availability varies by country and metric</li>
                    <li>Cultural differences may affect certain metrics</li>
                    <li>Some indicators are based on survey data with inherent biases</li>
                    <li>Historical data may have gaps or inconsistencies</li>
                  </ul>
                </div>
              </section>

              {/* Future Improvements */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Future Improvements</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>We are continuously working to enhance our methodology through:</p>
                  <ul>
                    <li>Integration of additional data sources</li>
                    <li>Enhanced validation techniques</li>
                    <li>More granular regional analysis</li>
                    <li>Advanced machine learning for trend prediction</li>
                  </ul>
                </div>
              </section>
            </div>
          </div>
        </div>
      </main>

      <footer className="bg-[var(--background-light)] border-t border-[var(--border-color)] mt-12">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-[var(--text-secondary)] text-sm">
            Last updated: {new Date().toLocaleDateString()}
          </p>
        </div>
      </footer>
    </div>
  );
} 