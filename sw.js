// Cauang — Service Worker

const CACHE = 'cauang-v1';
const URLS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/src/icons/app-icon-192x192.png',
  '/src/icons/app-icon-512x512.png',
  '/src/utils/constants.js',
  '/src/utils/helpers.js',
  '/src/models/Storage.js',
  '/src/views/DashboardView.js',
  '/src/views/AddExpenseView.js',
  '/src/views/HistoryView.js',
  '/src/views/InsightView.js',
  '/src/views/SettingsView.js',
  '/src/app.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE)
      .then(cache => cache.addAll(URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(clients.claim());
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(r => r || fetch(e.request))
  );
});
