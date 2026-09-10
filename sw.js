const CACHE_NAME = "namangam-wor-v21145c-static-gear-routes";

const CORE_ASSETS = [
  "/styles.css?v=2.11.45c",
  "/app.js?v=2.11.45",
  "/heroes.json",
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

  // Navigation pages are always fetched from the network.
  // This prevents / and /gear-presets/ from ever sharing a stale cached HTML response.
  if (request.mode === "navigate") {
    event.respondWith(fetch(request, { cache: "no-store" }));
    return;
  }

  const updateCritical =
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
