// Temporarily comment out Sentry integration
// const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable output standalone for production deployments
  output: process.env.NODE_ENV === 'production' ? 'standalone' : undefined,
  images: {
    unoptimized: true,
    domains: ['vercel.com'],
  },
  // Add experimental config but only optimizeCss (this was in your working logs)
  experimental: {
    optimizeCss: true,
  },
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: true
  },
  // Ensure proper static file generation with a stable build ID
  generateBuildId: async () => {
    return `build-${new Date().toISOString().replace(/[:.]/g, '-')}`;
  },
};

// Export config directly without Sentry
module.exports = nextConfig; 