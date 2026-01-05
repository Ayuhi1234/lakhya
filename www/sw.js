const CACHE_NAME = "lakhya-v3";
const ASSETS = [
    "./", 
    "./index.html", 
    "./script.js", 
    "./manifest.json",
    "https://actions.google.com/sounds/v1/alarms/beep_short.ogg",
    "https://actions.google.com/sounds/v1/cartoon/boing_spring.ogg",
    "https://actions.google.com/sounds/v1/cartoon/magic_chime.ogg",
    "https://actions.google.com/sounds/v1/animals/duck_quack.ogg",
    "https://actions.google.com/sounds/v1/cartoon/slide_whistle.ogg"
];

self.addEventListener("install", e => {
    self.skipWaiting();
    e.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)));
});

self.addEventListener("activate", e => {
    // Clean old caches
    e.waitUntil(caches.keys().then(keys => Promise.all(
        keys.map(k => k !== CACHE_NAME ? caches.delete(k) : null)
    )));
    return self.clients.claim();
});

self.addEventListener("fetch", e => {
    e.respondWith(caches.match(e.request).then(res => res || fetch(e.request)));
});

// Handle the Notification Click
self.addEventListener("notificationclick", e => {
    e.notification.close();
    e.waitUntil(
        clients.matchAll({ type: "window" }).then(clientList => {
            // If app is already open, focus it
            for (const client of clientList) {
                if (client.url === "/" && "focus" in client) return client.focus();
            }
            // Otherwise open it
            if (clients.openWindow) return clients.openWindow("./");
        })
    );
});