'use client';

import * as Sentry from '@sentry/nextjs';
import Error from './error';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  Sentry.captureException(error);
  return <Error error={error} reset={reset} />;
} 