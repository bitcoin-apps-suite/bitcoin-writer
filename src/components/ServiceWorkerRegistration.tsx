'use client';

import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .register('/service-worker.js')
        .then((registration) => {
          console.log('Bitcoin Writer SW registered: ', registration);
          
          registration.addEventListener('updatefound', () => {
            const newWorker = registration.installing;
            if (newWorker) {
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
                  console.log('Bitcoin Writer SW updated');
                  newWorker.postMessage({ type: 'SKIP_WAITING' });
                }
              });
            }
          });
        })
        .catch((registrationError) => {
          console.log('Bitcoin Writer SW registration failed: ', registrationError);
        });

      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data && event.data.type === 'PROTOCOL_HANDLED') {
          console.log('Protocol handled:', event.data.url);
        }
      });
    }

    // Handle protocol launches
    if ('launchQueue' in window) {
      window.launchQueue.setConsumer((launchParams) => {
        if (launchParams.targetURL) {
          console.log('Bitcoin Writer launched with URL:', launchParams.targetURL);
          
          if (navigator.serviceWorker.controller) {
            navigator.serviceWorker.controller.postMessage({
              type: 'PROTOCOL_LAUNCH',
              url: launchParams.targetURL
            });
          }
        }
      });
    }
  }, []);

  return null;
}
