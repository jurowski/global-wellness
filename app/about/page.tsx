'use client';

import React from 'react';
import Link from 'next/link';

export default function About() {
  return (
    <div className="min-h-screen bg-background-dark">
      <header className="bg-background-light border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-text-primary">
              About Global Wellness Insights
            </h1>
            <Link
              href="/"
              className="text-accent-primary hover:text-accent-secondary transition-colors"
            >
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <section className="bg-card-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Project Overview
            </h2>
            <p className="text-text-secondary mb-4">
              Global Wellness Insights is a comprehensive platform analyzing wellness metrics
              across countries. Our goal is to provide accessible insights into how different
              societal structures and systems influence overall well-being.
            </p>
            <p className="text-text-secondary">
              Through data visualization and analysis, we aim to help researchers,
              policymakers, and the public understand global wellness trends and make
              informed decisions.
            </p>
          </section>

          <section className="bg-card-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Key Features
            </h2>
            <ul className="space-y-4 text-text-secondary">
              <li className="flex items-start">
                <span className="text-accent-primary mr-2">•</span>
                <div>
                  <strong className="text-text-primary">Comprehensive Data:</strong>
                  <p className="mt-1">
                    Access to multiple wellness metrics from authoritative sources worldwide.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-accent-primary mr-2">•</span>
                <div>
                  <strong className="text-text-primary">Interactive Visualization:</strong>
                  <p className="mt-1">
                    Dynamic charts and graphs for intuitive understanding of complex data.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-accent-primary mr-2">•</span>
                <div>
                  <strong className="text-text-primary">Historical Analysis:</strong>
                  <p className="mt-1">
                    Track changes and trends from 2010 to present.
                  </p>
                </div>
              </li>
              <li className="flex items-start">
                <span className="text-accent-primary mr-2">•</span>
                <div>
                  <strong className="text-text-primary">Quality Metrics:</strong>
                  <p className="mt-1">
                    Reliability scores and data quality indicators for transparency.
                  </p>
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-card-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Data Sources
            </h2>
            <p className="text-text-secondary mb-4">
              We collaborate with and source data from leading organizations:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• World Health Organization (WHO)</li>
              <li>• United Nations Educational, Scientific and Cultural Organization (UNESCO)</li>
              <li>• Organisation for Economic Co-operation and Development (OECD)</li>
              <li>• World Happiness Report</li>
              <li>• Gallup World Poll</li>
              <li>• Various National Statistical Offices</li>
            </ul>
          </section>

          <section className="bg-card-bg rounded-lg p-6">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Our Team
            </h2>
            <p className="text-text-secondary mb-4">
              Our interdisciplinary team brings together expertise in:
            </p>
            <ul className="space-y-2 text-text-secondary">
              <li>• Data Science and Analytics</li>
              <li>• Public Health and Epidemiology</li>
              <li>• Social Sciences and Policy Research</li>
              <li>• Software Development and Data Visualization</li>
              <li>• Quality Assurance and Methodology</li>
            </ul>
          </section>

          <section className="bg-card-bg rounded-lg p-6 md:col-span-2">
            <h2 className="text-xl font-semibold text-text-primary mb-4">
              Contact Us
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  General Inquiries
                </h3>
                <p className="text-text-secondary">
                  Email: info@globalwellnessinsights.org
                </p>
                <p className="text-text-secondary mt-2">
                  Phone: +1 (555) 123-4567
                </p>
              </div>
              <div>
                <h3 className="text-lg font-medium text-text-primary mb-2">
                  Follow Us
                </h3>
                <div className="space-y-2">
                  <a
                    href="#"
                    className="block text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    Twitter
                  </a>
                  <a
                    href="#"
                    className="block text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    LinkedIn
                  </a>
                  <a
                    href="#"
                    className="block text-accent-primary hover:text-accent-secondary transition-colors"
                  >
                    GitHub
                  </a>
                </div>
              </div>
            </div>
          </section>
        </div>
      </main>

      <footer className="bg-background-light mt-12 py-6 border-t border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-text-secondary text-sm">
            © {new Date().getFullYear()} Global Wellness Insights. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 