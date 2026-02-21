// service-worker.js
// Place this file in your /public directory

const CACHE_NAME = 'warehouse-app-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
];

// Install: cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log('[SW] Caching static assets');
      return cache.addAll(STATIC_ASSETS);
    })
  );
  self.skipWaiting();
});

// Activate: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) =>
      Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      )
    )
  );
  self.clients.claim();
});

// Fetch: network-first for API, cache-first for assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests and browser extensions
  if (request.method !== 'GET') return;
  if (url.protocol === 'chrome-extension:') return;

  event.respondWith(
    caches.open(CACHE_NAME).then(async (cache) => {
      // Try network first
      try {
        const networkResponse = await fetch(request);
        // Cache successful responses for same-origin requests
        if (networkResponse.ok && url.origin === self.location.origin) {
          cache.put(request, networkResponse.clone());
        }
        return networkResponse;
      } catch {
        // Network failed — serve from cache
        const cachedResponse = await cache.match(request);
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', request.url);
          return cachedResponse;
        }
        // For navigation requests, serve the app shell
        if (request.mode === 'navigate') {
          return cache.match('/index.html');
        }
        // Nothing available
        return new Response('Offline', { status: 503 });
      }
    })
  );
});

// Listen for sync events (background sync)
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-transactions') {
    event.waitUntil(syncPendingTransactions());
  }
});

async function syncPendingTransactions() {
  // In a real app, you'd read from IndexedDB and POST to your server
  console.log('[SW] Background sync triggered for transactions');
}