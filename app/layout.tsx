import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from './components/Header';
import { ApolloWrapper } from './apollo-provider';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  colorScheme: 'dark',
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Global Wellness Dashboard',
  description: 'Compare wellness metrics across countries',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Check if we're in test mode using environment variable instead of window
  const isTestMode = process.env.NODE_ENV === 'test';
  
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          {isTestMode ? (
            // Use test provider in test mode
            <div id="test-provider">
              {children}
            </div>
          ) : (
            // Use regular provider in production/development
            <ApolloWrapper>
              {children}
            </ApolloWrapper>
          )}
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 