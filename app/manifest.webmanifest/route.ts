import { NextResponse } from 'next/server';

export async function GET() {
  const manifest = {
    name: 'Global Wellness Dashboard',
    short_name: 'Wellness',
    description: 'Track and analyze global wellness metrics',
    start_url: '/',
    display: 'standalone',
    background_color: '#1a1a1a',
    theme_color: '#1a1a1a',
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

  return NextResponse.json(manifest);
} 