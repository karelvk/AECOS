const CACHE_NAME = 'aecos-questionnaire-cache-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/css/styles.css',
    '/js/app.js',
    '/js/notification.js',
    '/manifest.json',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : {};
    const options = {
        body: data.body || 'Default body',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title || 'Default title', options)
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});
