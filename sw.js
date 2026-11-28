const CACHE_NAME = "tamara-fitness-v3.0.0";

const PRECACHE_ASSETS = [
  "./",
  "./index.html",
  "./style.css?v=2.0.4",
  "./script.js?v=3.0.0",
  "./manifest.json",
  "./icon-512.jpg",
];

// Instalação: guarda os arquivos essenciais e ativa imediatamente
self.addEventListener("install", (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_ASSETS)),
  );
});

// Ativação: apaga qualquer cache de versões antigas (v1, v2, etc.)
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== CACHE_NAME)
            .map((oldKey) => caches.delete(oldKey)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

// Interceptação de requisições: Network-First para arquivos do app
self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;

  const url = new URL(req.url);

  // Deixa requisições externas (Firebase, Google Fonts, Auth) passarem direto pela rede
  if (url.origin !== self.location.origin) {
    return;
  }

  event.respondWith(
    fetch(req)
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseClone);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(req)),
  );
});
