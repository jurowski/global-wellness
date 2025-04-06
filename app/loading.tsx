import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen bg-background-dark flex items-center justify-center">
      <div className="max-w-xl w-full mx-auto px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-primary mx-auto"></div>
          <h2 className="text-2xl font-semibold text-text-primary mt-8">
            Loading...
          </h2>
          <p className="text-text-secondary mt-4">
            Please wait while we fetch your data.
          </p>
        </div>
      </div>
    </div>
  );
} 