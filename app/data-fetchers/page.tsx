'use client';

import React from 'react';
import DataFetcherStatus from '../components/DataFetcherStatus';
import ApiFetchers from '../components/ApiFetchers';

export default function DataFetchersPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl font-bold mb-8 text-gray-900 dark:text-white">Data Fetchers Dashboard</h1>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 mb-8">
          <DataFetcherStatus />
        </div>
        
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
          <ApiFetchers />
        </div>
      </div>
    </div>
  );
} 