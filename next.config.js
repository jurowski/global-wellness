const { withSentryConfig } = require('@sentry/nextjs');

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  images: {
    unoptimized: true,
    domains: ['vercel.com'],
    formats: ['image/avif', 'image/webp'],
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
  },
  // Ensure proper static file generation
  generateBuildId: async () => {
    return 'build-' + Date.now();
  },
  // Optimize static file caching
  generateEtags: false,
  compress: true,
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