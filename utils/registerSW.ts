// src/utils/registerSW.ts
// Call this once at app startup (e.g., in main.tsx / index.tsx)

export function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', async () => {
      try {
        const registration = await navigator.serviceWorker.register('/service-worker.js', {
          scope: '/',
        });

        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              // New version available — optionally prompt the user to refresh
              console.log('[SW] New version available. Refresh to update.');
            }
          });
        });

        console.log('[SW] Registered successfully:', registration.scope);
      } catch (error) {
        console.error('[SW] Registration failed:', error);
      }
    });
  } else {
    console.warn('[SW] Service Workers not supported in this browser.');
  }
}