'use client';

import React from 'react';
import Link from 'next/link';

export default function Methodology() {
  return (
    <div className="min-h-screen bg-background-dark">
      <header className="bg-background-light border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-primary">
              Methodology
            </h1>
            <Link
              href="/"
              className="text-accent-primary hover:text-accent-secondary transition-colors"
            >
              Back to Countries
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="prose prose-invert max-w-none">
          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Data Collection Process
            </h2>
            <div className="bg-card-bg rounded-lg p-6">
              <ul className="space-y-4 text-text-secondary">
                <li>
                  <strong className="text-text-primary">Primary Sources:</strong>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>World Happiness Report</li>
                    <li>WHO Global Health Observatory</li>
                    <li>UNESCO Institute for Statistics</li>
                    <li>OECD Better Life Index</li>
                    <li>Gallup World Poll</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-text-primary">Data Verification:</strong>
                  <p className="mt-2">
                    Each data point undergoes a rigorous verification process:
                  </p>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Cross-referencing with multiple sources</li>
                    <li>Statistical validation for outliers</li>
                    <li>Temporal consistency checks</li>
                    <li>Expert review and validation</li>
                  </ul>
                </li>
                <li>
                  <strong className="text-text-primary">Update Frequency:</strong>
                  <p className="mt-2">
                    Data is updated annually, with some metrics receiving quarterly updates when available.
                    Historical data is preserved for trend analysis.
                  </p>
                </li>
              </ul>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Quality Assessment Framework
            </h2>
            <div className="bg-card-bg rounded-lg p-6">
              <div className="space-y-6 text-text-secondary">
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-3">
                    Reliability Scoring
                  </h3>
                  <p>
                    Our reliability scores (0-1) are calculated based on:
                  </p>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Source credibility (40%)</li>
                    <li>Data collection methodology (30%)</li>
                    <li>Sample size and representation (20%)</li>
                    <li>Update frequency (10%)</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-3">
                    Confidence Intervals
                  </h3>
                  <p>
                    Confidence intervals are calculated using:
                  </p>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Standard error of measurement</li>
                    <li>Sample size considerations</li>
                    <li>Historical variance</li>
                    <li>95% confidence level standard</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section className="mb-12">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Data Processing Methods
            </h2>
            <div className="bg-card-bg rounded-lg p-6">
              <div className="space-y-4 text-text-secondary">
                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-3">
                    Normalization
                  </h3>
                  <p>
                    All metrics are normalized to a 0-100 scale using:
                  </p>
                  <pre className="bg-background-dark p-4 rounded-md mt-2">
                    <code>
                      normalized_value = (value - min_value) / (max_value - min_value) * 100
                    </code>
                  </pre>
                </div>

                <div>
                  <h3 className="text-lg font-medium text-text-primary mb-3">
                    Aggregation
                  </h3>
                  <p>
                    When combining multiple data sources:
                  </p>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Weighted averages based on source reliability</li>
                    <li>Temporal alignment for consistent comparison</li>
                    <li>Missing data interpolation when appropriate</li>
                  </ul>
                </div>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Limitations and Considerations
            </h2>
            <div className="bg-card-bg rounded-lg p-6">
              <ul className="space-y-4 text-text-secondary">
                <li>
                  <strong className="text-text-primary">Cultural Differences:</strong>
                  <p className="mt-2">
                    Metrics may be influenced by cultural contexts and interpretations.
                    We attempt to account for this through regional normalization.
                  </p>
                </li>
                <li>
                  <strong className="text-text-primary">Data Availability:</strong>
                  <p className="mt-2">
                    Some regions may have limited data availability or less frequent updates.
                    Gaps are clearly indicated in the visualization.
                  </p>
                </li>
                <li>
                  <strong className="text-text-primary">Future Improvements:</strong>
                  <p className="mt-2">
                    We are continuously working to:
                  </p>
                  <ul className="mt-2 ml-6 list-disc">
                    <li>Expand data sources and coverage</li>
                    <li>Improve normalization methods</li>
                    <li>Enhance cultural sensitivity</li>
                    <li>Increase update frequency</li>
                  </ul>
                </li>
              </ul>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-background-light mt-12 py-6 border-t border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-text-secondary text-sm">
            Last Updated: {new Date().toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </p>
        </div>
      </footer>
    </div>
  );
} 