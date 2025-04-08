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
  compiler: {
    styledComponents: true,
  },
  webpack: (config, { isServer, dev }) => {
    // SVG handling
    config.module.rules.push({
      test: /\.svg$/,
      use: ['@svgr/webpack']
    });

    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      tls: false,
      dns: false,
      child_process: false,
      readline: false,
    };

    // Add test-specific configuration
    if (process.env.NODE_ENV === 'test') {
      config.optimization = {
        ...config.optimization,
        minimize: false,
      };
    }

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

// Only use Sentry in production
const config = process.env.NODE_ENV === 'production' 
  ? withSentryConfig(
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
    )
  : nextConfig;

module.exports = config; 