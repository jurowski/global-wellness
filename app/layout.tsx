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
  description: 'Track and analyze global wellness metrics',
  manifest: '/manifest.json',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Global Wellness',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body suppressHydrationWarning className={`${inter.className} bg-gray-900 text-white min-h-screen`}>
        <Header />
        <main className="container mx-auto px-4 py-8">
          <ApolloWrapper>
            {children}
          </ApolloWrapper>
        </main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
} 