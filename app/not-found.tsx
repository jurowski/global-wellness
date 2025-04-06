import React from 'react';
import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-text-secondary mb-8">
            The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
          </p>
          <Link
            href="/"
            className="inline-block bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary transition-colors"
          >
            Go back home
          </Link>
        </div>
      </div>
    </div>
  );
} 