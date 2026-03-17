// ENARMlab Service Worker
// VersiÃ³n de cachÃ© â€” incrementa este nÃºmero para forzar actualizaciÃ³n en todos los dispositivos
const CACHE_NAME = 'enarmlab-v6';

// Archivos esenciales que se cachean al instalar
const CORE_ASSETS = [
    '/',
    '/index.html',
    '/styles.css',
    '/app.js',
    '/questions.js',
    '/manifest.json',
    '/logo-e-mask.png',
    '/notification-icon.png',
    '/notification-badge.png',
    '/icon-192.png',
    '/icon-512.png'
];

// â”€â”€â”€ Install: guarda los archivos esenciales en cachÃ© â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Cacheando archivos esenciales...');
            return cache.addAll(CORE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// â”€â”€â”€ Activate: limpia cachÃ©s antiguas â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Eliminando cachÃ© antigua:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// â”€â”€â”€ Fetch: estrategia Network-First para HTML/JS, Cache-First para assets â”€â”€
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Solo manejar peticiones de nuestro propio origen
    if (url.origin !== location.origin) return;

    // Para Firebase / APIs externas, siempre pasar directo sin interferir
    if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) return;

    // Estrategia: intentar red primero, caer a cachÃ© si falla (ej. sin internet)
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Si la respuesta es vÃ¡lida, guardarla en cachÃ© y devolverla
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Sin red: buscar en cachÃ©
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    // Si es una navegaciÃ³n y no hay cachÃ©, devolver index.html
                    if (event.request.mode === 'navigate') {
                        return caches.match('/index.html');
                    }
                });
            })
    );
});

self.addEventListener('notificationclick', event => {
    event.notification.close();

    event.waitUntil((async () => {
        const allClients = await clients.matchAll({ type: 'window', includeUncontrolled: true });

        for (const client of allClients) {
            if ('focus' in client) {
                client.postMessage({ type: 'OPEN_NOTIFICATIONS_MODAL' });
                await client.focus();
                return;
            }
        }

        await clients.openWindow('/');
    })());
});

