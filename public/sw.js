const CACHE_NAME = 'sweet-app-v1';
const urlsToCache = [
    '/',
    '/index.html',
    '/manifest.json'
];

// Встановлення воркера і кешування
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then((cache) => {
                console.log('Opened cache');
                return cache.addAll(urlsToCache);
            })
    );
});

// Перехоплення запитів (якщо офлайн - беремо з кешу)
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request)
            .then((response) => {
                // Якщо є в кеші - повертаємо з кешу
                if (response) {
                    return response;
                }
                // Якщо немає - качаємо з інтернету
                return fetch(event.request).then(
                    (response) => {
                        // Перевіряємо, чи валідна відповідь
                        if(!response || response.status !== 200 || response.type !== 'basic') {
                            return response;
                        }
                        // Кешуємо нові файли на льоту
                        const responseToCache = response.clone();
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });
                        return response;
                    }
                );
            })
    );
});

// Оновлення кешу при новій версії
self.addEventListener('activate', (event) => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});