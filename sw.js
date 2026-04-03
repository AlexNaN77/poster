const CACHE_NAME = 'poster-v1';

const ASSETS = [
    './index.html',
    './sw.js',
    './manifest.json',
    'https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@400;500;600;700&family=Montserrat:wght@900;800;700&display=swap',
];

// INSTALACION: cachear todo
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('[POSTER SW] Cacheando assets...');
            return cache.addAll(ASSETS);
        })
    );
    self.skipWaiting();
});

// ACTIVACION: limpiar caches viejas
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys.filter((key) => key !== CACHE_NAME)
                    .map((key) => {
                        console.log('[POSTER SW] Borrando cache vieja:', key);
                        return caches.delete(key);
                    })
            )
        )
    );
    self.clients.claim();
});

// FETCH: Cache first, luego red
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return fetch(event.request).then((networkResponse) => {
                // Solo cacheamos respuestas ok
                if (
                    !networkResponse ||
                    networkResponse.status !== 200 ||
                    networkResponse.type === 'opaque'
                ) {
                    return networkResponse;
                }
                const responseToCache = networkResponse.clone();
                caches.open(CACHE_NAME).then((cache) => {
                    cache.put(event.request, responseToCache);
                });
                return networkResponse;
            }).catch(() => {
                // Sin red y sin cache: regresa la página principal
                return caches.match('./index.html');
            });
        })
    );
});