/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['vercel.com', 'localhost'],
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
}

module.exports = nextConfig 