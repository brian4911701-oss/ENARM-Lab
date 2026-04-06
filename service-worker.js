try {
    importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-app-compat.js');
    importScripts('https://www.gstatic.com/firebasejs/10.9.0/firebase-messaging-compat.js');

    if (!firebase.apps.length) {
        firebase.initializeApp({
            apiKey: "AIzaSyA-ALVpht1Za682OUGvH6QWaudCJZYihFU",
            authDomain: "enarm-lab-social.firebaseapp.com",
            projectId: "enarm-lab-social",
            storageBucket: "enarm-lab-social.firebasestorage.app",
            messagingSenderId: "1046465986024",
            appId: "1:1046465986024:web:f76360b91613c12032b85d"
        });
    }

    const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        const title = (payload.notification && payload.notification.title) || (payload.data && payload.data.title) || 'ENARM Lab';
        const body = (payload.notification && payload.notification.body) || (payload.data && payload.data.body) || '';
        const link = (payload.data && payload.data.link) || '/';

        self.registration.showNotification(title, {
            body,
            icon: '/notification-icon.png',
            badge: '/notification-badge.png',
            tag: (payload.data && payload.data.kind) || 'enarm-push',
            data: {
                action: 'open-notifications-modal',
                link
            }
        });
    });
} catch (err) {
    console.warn('[SW] Firebase Messaging no disponible:', err);
}

// ENARMlab Service Worker
// Versión de caché — incrementa este número para forzar actualización en todos los dispositivos
const CACHE_NAME = 'enarmlab-v9';

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

// ─── Install: guarda los archivos esenciales en caché ───────────────────────
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('[SW] Cacheando archivos esenciales...');
            return cache.addAll(CORE_ASSETS);
        }).then(() => self.skipWaiting())
    );
});

// ─── Activate: limpia cachés antiguas ────────────────────────────────────────
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys =>
            Promise.all(
                keys
                    .filter(key => key !== CACHE_NAME)
                    .map(key => {
                        console.log('[SW] Eliminando caché antigua:', key);
                        return caches.delete(key);
                    })
            )
        ).then(() => self.clients.claim())
    );
});

// ─── Fetch: estrategia Network-First para HTML/JS, Cache-First para assets ──
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Solo manejar peticiones de nuestro propio origen
    if (url.origin !== location.origin) return;

    // Para Firebase / APIs externas, siempre pasar directo sin interferir
    if (url.hostname.includes('firebase') || url.hostname.includes('googleapis')) return;

    // Estrategia: intentar red primero, caer a caché si falla (ej. sin internet)
    event.respondWith(
        fetch(event.request)
            .then(networkResponse => {
                // Si la respuesta es válida, guardarla en caché y devolverla
                if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
                    const responseClone = networkResponse.clone();
                    caches.open(CACHE_NAME).then(cache => cache.put(event.request, responseClone));
                }
                return networkResponse;
            })
            .catch(() => {
                // Sin red: buscar en caché
                return caches.match(event.request).then(cached => {
                    if (cached) return cached;
                    // Si es una navegación y no hay caché, devolver index.html
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
        const targetLink = event.notification && event.notification.data && event.notification.data.link
            ? event.notification.data.link
            : '/';

        for (const client of allClients) {
            if ('focus' in client) {
                client.postMessage({ type: 'OPEN_NOTIFICATIONS_MODAL' });
                await client.focus();
                return;
            }
        }

        await clients.openWindow(targetLink);
    })());
});
