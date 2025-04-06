import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Global Wellness Insights',
    short_name: 'Wellness Insights',
    description: 'Explore global wellness metrics and societal structures across countries.',
    start_url: '/',
    display: 'standalone',
    background_color: '#111827',
    theme_color: '#3b82f6',
    icons: [
      {
        src: '/icon-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/icon-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
} 