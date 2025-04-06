'use client';

import React from 'react';
import Link from 'next/link';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">
            Something went wrong
          </h1>
          <p className="text-text-secondary mb-8">
            We apologize for the inconvenience. Please try again later or contact support if the problem persists.
          </p>
          <div className="space-x-4">
            <button
              onClick={reset}
              className="bg-accent-primary text-white px-4 py-2 rounded-md hover:bg-accent-secondary transition-colors"
            >
              Try again
            </button>
            <Link
              href="/"
              className="inline-block bg-background-light text-text-primary px-4 py-2 rounded-md hover:bg-border-color transition-colors"
            >
              Go home
            </Link>
          </div>
          {process.env.NODE_ENV === 'development' && (
            <div className="mt-8 p-4 bg-background-light rounded-md">
              <p className="text-text-secondary text-sm font-mono">
                {error.message}
              </p>
              {error.digest && (
                <p className="text-text-secondary text-sm font-mono mt-2">
                  Error ID: {error.digest}
                </p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
} 