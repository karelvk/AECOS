const CACHE_NAME = 'aecos-questionnaire-cache-v1';
const urlsToCache = [
    '/AECOS/',
    '/AECOS/index.html',
    '/AECOS/css/styles.css',
    '/AECOS/js/app.js',
    '/AECOS/js/notification.js',
    '/AECOS/manifest.json',
    '/AECOS/icons/icon-192x192.png',
    '/AECOS/icons/icon-512x512.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
            .catch(error => {
                console.error('Failed to cache assets:', error);
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
    const data = event.data ? event.data.json() : { title: 'Default title', body: 'Default body' };
    const options = {
        body: data.body,
        icon: '/AECOS/icons/icon-192x192.png',
        badge: '/AECOS/icons/icon-192x192.png'
    };
    event.waitUntil(
        self.registration.showNotification(data.title, options).catch(error => {
            console.error('Error showing notification:', error);
        })
    );
});

self.addEventListener('notificationclick', function(event) {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/AECOS/').catch(error => {
            console.error('Error opening window:', error);
        })
    );
});

self.addEventListener('message', function(event) {
    if (event.data && event.data.action === 'push') {
        const data = event.data.data;
        const options = {
            body: data.body,
            icon: '/AECOS/icons/icon-192x192.png',
            badge: '/AECOS/icons/icon-192x192.png'
        };
        self.registration.showNotification(data.title, options).catch(error => {
            console.error('Error showing notification:', error);
        });
    }
});
