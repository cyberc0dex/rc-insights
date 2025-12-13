// service-worker.js - Service worker for system-insights

const CACHE_NAME = 'rc-prod-v1.0.1';
const urlsToCache = [
    './',
    './index.html',
    './request.html',
    './css/styles.css',
    './js/config.js',
    './js/session.js',
    '.js/encryption.js',
    './js/storage.js',
    './js/auth.js',
    './js/dataFetcher.js',
    './js/matchHistory.js',
    './js/playerStats.js',
    './js/app.js',
    './js/request.js',
    './manifest.json',
    './assets/icons/icon-180.png',
    './assets/icons/icon-192.png',
    './assets/icons/icon-512.png',
    './assets/icons/header.png'
];

// Install event - cache all assets except data.enc
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Fetch event - serve from cache, but NEVER cache data.enc
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);
    
    // NEVER cache data.enc - always fetch from network
    if (url.pathname.endsWith('data.enc') || url.pathname.includes('data.enc')) {
        event.respondWith(
            fetch(event.request)
                .then(response => {
                    // Return response without caching
                    return response;
                })
                .catch(error => {
                    console.error('Failed to fetch data.enc:', error);
                    throw error;
                })
        );
        return;
    }

    // For all other requests, use cache-first strategy
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                // Cache hit - return response
                if (response) {
                    return response;
                }
                
                // Clone the request
                const fetchRequest = event.request.clone();

                return fetch(fetchRequest).then(response => {
                    // Check if valid response
                    if (!response || response.status !== 200 || response.type !== 'basic') {
                        return response;
                    }

                    // Clone the response
                    const responseToCache = response.clone();

                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                        });

                    return response;
                });
            })
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});