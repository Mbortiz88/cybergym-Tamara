const CACHE_NAME = "tamara-cybergym-hud-v1.8.4";
const ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=1.8.4",
  "./script.js?v=1.8.4",
  "./manifest.json",
  "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  if (
    event.request.url.includes("googleapis.com") ||
    event.request.url.includes("gstatic.com") ||
    event.request.url.includes("firebase")
  ) {
    return;
  }

  event.respondWith(
    fetch(event.request)
      .then((res) => {
        const clone = res.clone();
        caches
          .open(CACHE_NAME)
          .then((cache) => cache.put(event.request, clone));
        return res;
      })
      .catch(() => caches.match(event.request)),
  );
});
