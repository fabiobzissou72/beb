const CACHE_NAME = 'bb-confeccoes-v1';
const RUNTIME_CACHE = 'bb-runtime-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
    './src/index.html',
    './src/styles.css',
    './src/app.js',
    './products.json',
    './logo/logotipo.png',
];

// Install event - cache core assets
self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');

    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Service Worker: Caching core assets');
                return cache.addAll(PRECACHE_ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames
                    .filter((cacheName) => {
                        return cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE;
                    })
                    .map((cacheName) => {
                        console.log('Service Worker: Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    })
            );
        }).then(() => self.clients.claim())
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
    const { request } = event;
    const url = new URL(request.url);

    // Skip cross-origin requests
    if (url.origin !== location.origin) {
        // For webhook requests, always use network
        if (url.href.includes('webhook')) {
            return;
        }
    }

    // Handle navigation requests (HTML pages)
    if (request.mode === 'navigate') {
        event.respondWith(
            fetch(request)
                .catch(() => {
                    return caches.match('./src/index.html');
                })
        );
        return;
    }

    // Handle other requests with cache-first strategy
    event.respondWith(
        caches.match(request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(request)
                    .then((response) => {
                        // Don't cache non-successful responses
                        if (!response || response.status !== 200 || response.type === 'error') {
                            return response;
                        }

                        // Clone the response
                        const responseToCache = response.clone();

                        // Cache images and fonts in runtime cache
                        if (request.destination === 'image' || request.destination === 'font') {
                            caches.open(RUNTIME_CACHE)
                                .then((cache) => {
                                    cache.put(request, responseToCache);
                                });
                        }

                        return response;
                    })
                    .catch((error) => {
                        console.error('Service Worker: Fetch failed:', error);

                        // Return offline page for failed navigations
                        if (request.mode === 'navigate') {
                            return caches.match('./src/index.html');
                        }
                    });
            })
    );
});

// Background sync for offline form submissions (future enhancement)
self.addEventListener('sync', (event) => {
    if (event.tag === 'sync-forms') {
        event.waitUntil(syncForms());
    }
});

async function syncForms() {
    // This would handle offline form submissions
    // Store forms in IndexedDB when offline, sync when back online
    console.log('Service Worker: Syncing forms...');
}

// Push notifications (future enhancement)
self.addEventListener('push', (event) => {
    const options = {
        body: event.data ? event.data.text() : 'Nova atualização disponível!',
        icon: './public/icons/icon-192.png',
        badge: './public/icons/icon-72.png',
        vibrate: [200, 100, 200],
        data: {
            dateOfArrival: Date.now(),
            primaryKey: 1
        },
        actions: [
            {
                action: 'explore',
                title: 'Ver',
                icon: './public/icons/icon-72.png'
            },
            {
                action: 'close',
                title: 'Fechar',
                icon: './public/icons/icon-72.png'
            }
        ]
    };

    event.waitUntil(
        self.registration.showNotification('B&B Confecções', options)
    );
});

// Notification click handler
self.addEventListener('notificationclick', (event) => {
    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.openWindow('./src/index.html')
        );
    }
});

// Message handler for skip waiting
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});

console.log('Service Worker: Loaded');
