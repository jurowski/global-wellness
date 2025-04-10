'use client';

import { useEffect } from 'react';

export default function ServiceWorkerManager() {
  useEffect(() => {
    if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
      // Unregister any existing service workers to clear potential issues
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        for (const registration of registrations) {
          registration.unregister().then(() => {
            console.log('Service worker unregistered successfully');
          }).catch((error) => {
            console.error('Error unregistering service worker:', error);
          });
        }
      }).catch((error) => {
        console.error('Error getting service worker registrations:', error);
      });

      // Temporarily disabled for debugging
      /*
      // Register service worker
      window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then((registration) => {
          console.log('Service Worker registered with scope:', registration.scope);
        }).catch((error) => {
          console.error('Service Worker registration failed:', error);
        });
      });
      */
    }
  }, []);

  return null;
} 