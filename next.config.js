const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.com'],
    formats: ['image/avif', 'image/webp'],
  },
  headers: async () => {
    return [
      {
        source: '/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/api/:path*',
        headers: [
          {
            key: 'Cache-Control',
            value: 'public, max-age=3600, stale-while-revalidate=86400',
          },
        ],
      },
    ];
  },
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@vercel/speed-insights'],
  },
  webpack: (config) => {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    return config;
  },
  eslint: {
    // Don't run ESLint during production builds
    ignoreDuringBuilds: true
  },
  typescript: {
    // Don't run type checking during production builds
    ignoreBuildErrors: true
  }
};

module.exports = withSentryConfig(
  nextConfig,
  {
    silent: true,
    org: "sandon-jurowskis-projects",
    project: "global-wellness",
  },
  {
    widenClientFileUpload: true,
    transpileClientSDK: true,
    tunnelRoute: "/monitoring-tunnel",
    hideSourceMaps: true,
  }
); 