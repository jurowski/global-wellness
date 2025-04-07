import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import { SpeedInsights } from '@vercel/speed-insights/next';
import { Analytics } from '@vercel/analytics/next';
import './globals.css';
import Header from './components/Header';

const inter = Inter({ subsets: ['latin'] });

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [{ media: '(prefers-color-scheme: dark)', color: '#1a1a1a' }],
  viewportFit: 'cover',
};

export const metadata: Metadata = {
  title: 'Global Wellness Dashboard',
  description: 'Track and analyze global wellness metrics',
  manifest: '/manifest.webmanifest',
  icons: {
    icon: '/icon-192x192.png',
    apple: '/apple-touch-icon.png',
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Global Wellness'
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body suppressHydrationWarning className="bg-gray-900 text-white min-h-screen">
        <Header />
        <main className="container mx-auto px-4 py-8">{children}</main>
        <SpeedInsights />
        <Analytics />
      </body>
    </html>
  );
} 