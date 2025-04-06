import Link from 'next/link'

export default function About() {
  return (
    <div className="min-h-screen bg-[var(--background-dark)]">
      <header className="bg-[var(--background-light)] shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold text-[var(--text-primary)]">
              About Global Wellness Insights
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
              {/* Project Overview */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Project Overview</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>
                    Global Wellness Insights is a comprehensive platform that analyzes and visualizes wellness metrics
                    across different countries. Our goal is to provide accessible, accurate, and actionable insights
                    into global well-being trends.
                  </p>
                </div>
              </section>

              {/* Key Features */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Key Features</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-[var(--accent-primary)]/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-[var(--accent-primary)] mb-2">Comprehensive Data</h3>
                    <p className="text-[var(--text-secondary)]">
                      Access to multiple wellness metrics from authoritative sources worldwide
                    </p>
                  </div>
                  <div className="bg-green-500/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-green-400 mb-2">Interactive Visualization</h3>
                    <p className="text-[var(--text-secondary)]">
                      Dynamic charts and comparisons for better understanding of trends
                    </p>
                  </div>
                  <div className="bg-purple-500/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-purple-400 mb-2">Historical Analysis</h3>
                    <p className="text-[var(--text-secondary)]">
                      Track changes and developments from 2010 to present
                    </p>
                  </div>
                  <div className="bg-yellow-500/10 p-4 rounded-lg">
                    <h3 className="text-lg font-semibold text-yellow-400 mb-2">Quality Metrics</h3>
                    <p className="text-[var(--text-secondary)]">
                      Transparent reliability scores and data quality indicators
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Sources */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Data Sources</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>Our platform aggregates data from leading international organizations:</p>
                  <ul>
                    <li>World Health Organization (WHO)</li>
                    <li>United Nations Educational, Scientific and Cultural Organization (UNESCO)</li>
                    <li>Organisation for Economic Co-operation and Development (OECD)</li>
                    <li>World Happiness Report</li>
                    <li>National statistical offices</li>
                  </ul>
                </div>
              </section>

              {/* Team */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Our Team</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>
                    Our interdisciplinary team includes data scientists, researchers, and developers
                    committed to providing accurate and meaningful insights into global wellness trends.
                  </p>
                </div>
              </section>

              {/* Contact */}
              <section>
                <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-4">Contact Us</h2>
                <div className="prose max-w-none text-[var(--text-secondary)]">
                  <p>
                    For questions, feedback, or collaboration opportunities, please reach out to us:
                  </p>
                  <ul>
                    <li>Email: contact@globalwellnessinsights.org</li>
                    <li>Twitter: @GlobalWellness</li>
                    <li>LinkedIn: Global Wellness Insights</li>
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
            © {new Date().getFullYear()} Global Wellness Insights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 