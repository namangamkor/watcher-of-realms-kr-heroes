const CACHE_NAME = "namangam-wor-v21207-dark-ezio-artifact";

const CORE_ASSETS = [
  "/styles.css?v=2.11.47",
  "/app.js?v=2.12.7",
  "/heroes.json?v=2.12.7",
  "/gear-presets.js?v=2.11.45c",
  "/gear-presets.json",
  "/manifest.webmanifest",
  "/favicon-crystal-v1.png",
  "/namangam-subscribe.png",
  "/icon-192.png",
  "/icon-512.png",
  "/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(CORE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key))))
      .then(() => self.clients.claim())
  );
});

function networkFirst(request) {
  return fetch(request).then((response) => {
    if (response && response.status === 200) {
      const copy = response.clone();
      caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
    }
    return response;
  }).catch(() => caches.match(request));
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never store comments, moderation results, or authentication responses offline.
  if (url.pathname.startsWith("/api/comments") || url.pathname.startsWith("/admin/") || url.pathname.startsWith("/cdn-cgi/access/")) {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  // Navigation pages are always fetched from the network.
  // This prevents / and /gear-presets/ from ever sharing a stale cached HTML response.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  const updateCritical =
    url.pathname.endsWith("/comments.js") ||
    url.pathname.endsWith("/comments-admin.js") ||
    url.pathname.endsWith("/comments.css") ||
    url.pathname.endsWith("/app.js") ||
    url.pathname.endsWith("/styles.css") ||
    url.pathname.endsWith("/heroes.json") ||
    url.pathname.endsWith("/gear-presets.js") ||
    url.pathname.endsWith("/gear-presets.json") ||
    url.pathname.endsWith("/manifest.webmanifest");

  if (updateCritical) {
    event.respondWith(networkFirst(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).then((response) => {
      if (response && response.status === 200) {
        const copy = response.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
      }
      return response;
    }))
  );
});
