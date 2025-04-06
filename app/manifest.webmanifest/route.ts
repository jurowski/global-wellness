import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  const manifest = {
    name: "Global Wellness Dashboard",
    short_name: "Wellness",
    description: "Track and analyze global wellness metrics",
    start_url: "/",
    display: "standalone",
    background_color: "#111827",
    theme_color: "#1a1a1a",
    icons: [
      {
        src: "/icon-192.png",
        sizes: "192x192",
        type: "image/png"
      },
      {
        src: "/icon-512.png",
        sizes: "512x512",
        type: "image/png"
      },
      {
        src: "/apple-touch-icon.png",
        sizes: "180x180",
        type: "image/png"
      }
    ]
  };

  return new NextResponse(JSON.stringify(manifest, null, 2), {
    headers: {
      'Content-Type': 'application/manifest+json',
      'Cache-Control': 'public, max-age=3600'
    }
  });
} 