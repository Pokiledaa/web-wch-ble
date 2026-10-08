// Caches the app shell so the installed app opens without a network connection.
// Bump CACHE whenever a file below changes.
const CACHE = 'ch582-led-v15';
const FILES = ['./', 'index.html', 'manifest.webmanifest', 'icon-192.png', 'icon-512.png',
  'snake/', 'snake/index.html', 'snake/manifest.webmanifest',
  'maze/', 'maze/index.html', 'maze/manifest.webmanifest',
  'racing/', 'racing/index.html', 'racing/manifest.webmanifest',
  'shooter/', 'shooter/index.html', 'shooter/manifest.webmanifest',
  'doom/', 'doom/index.html', 'doom/manifest.webmanifest'];

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(FILES)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network first, so updates show up immediately when online; cache when offline.
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    // 'no-cache' asks the server every time: the host lets browsers keep pages for ten minutes,
    // which made a freshly published page look as if it had not changed
    fetch(event.request.url, { cache: 'no-cache' })
      .then((response) => {
        const copy = response.clone();
        caches.open(CACHE).then((cache) => cache.put(event.request, copy));
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
