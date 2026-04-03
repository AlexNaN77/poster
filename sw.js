// EL CHALÁN DE VAULTIFYER 👷‍♂️

const CACHE_NAME = 'vaultifyer-cache-v1';

// Cuando la app se instala
self.addEventListener('install', (e) => {
    console.log('[Chalán] Ya me instalé patrón 🗣️🔥');
    self.skipWaiting();
});

// Cuando la app arranca
self.addEventListener('activate', (e) => {
    console.log('[Chalán] Ya ando activo y cobrando sueldo 🤑');
    return self.clients.claim();
});

// Cuando la app pide datos (nomas lo dejamos pasar pa que no rompa tu base de datos)
self.addEventListener('fetch', (e) => {
    e.respondWith(
        fetch(e.request).catch(() => {
            console.log("[Chalán] Tas sin internet mijo, pero la app jala pq los datos estan en tu cel 📱");
        })
    );
});