import React from 'react';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Global Wellness Insights',
  description: 'Explore global wellness metrics and societal structures across countries.',
  keywords: 'wellness, global health, data visualization, societal structures, well-being metrics',
  authors: [{ name: 'Global Wellness Insights Team' }],
  openGraph: {
    title: 'Global Wellness Insights',
    description: 'Explore global wellness metrics and societal structures across countries.',
    url: 'https://globalwellnessinsights.org',
    siteName: 'Global Wellness Insights',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Global Wellness Insights',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Global Wellness Insights',
    description: 'Explore global wellness metrics and societal structures across countries.',
    images: ['/og-image.png'],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
} 