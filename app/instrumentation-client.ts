'use client';

import * as Sentry from '@sentry/nextjs';

export function register() {
  Sentry.init({
    dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
    tracesSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    replaysOnErrorSampleRate: 1.0,
    debug: process.env.NODE_ENV === 'development',
  });
} 