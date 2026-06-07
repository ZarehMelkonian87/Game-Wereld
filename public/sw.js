const CACHE_NAME = "game-wereld-shell-v1";
const APP_SHELL_URLS = [
  "/",
  "/manifest.webmanifest",
  "/pwa/icon-192.png",
  "/pwa/icon-512.png",
  "/pwa/maskable-icon-192.png",
  "/pwa/maskable-icon-512.png",
  "/pwa/apple-touch-icon.png"
];

const isCacheableRequest = (request) =>
  request.method === "GET" && new URL(request.url).origin === self.location.origin;

const isLargeMediaRequest = (url) =>
  url.pathname.endsWith(".mp4") ||
  url.pathname.endsWith(".mp3") ||
  url.pathname.endsWith(".webm") ||
  url.pathname.endsWith(".mov");

const isDevAssetRequest = (url) =>
  url.pathname.startsWith("/src/") ||
  url.pathname.startsWith("/@vite") ||
  url.pathname.startsWith("/node_modules/");

const putResponseInCache = async (request, response) => {
  if (!response || response.status !== 200 || response.type === "opaque") {
    return;
  }

  const url = typeof request === "string"
    ? new URL(request, self.location.origin)
    : new URL(request.url);

  if (isLargeMediaRequest(url) || isDevAssetRequest(url)) {
    return;
  }

  const cache = await caches.open(CACHE_NAME);
  await cache.put(request, response.clone());
};

const getNavigationResponse = async (request) => {
  try {
    const response = await fetch(request);
    await putResponseInCache("/", response);
    return response;
  } catch {
    const cache = await caches.open(CACHE_NAME);
    return (await cache.match("/")) ?? Response.error();
  }
};

const getAssetResponse = async (request) => {
  const cache = await caches.open(CACHE_NAME);
  const cachedResponse = await cache.match(request);

  if (cachedResponse) {
    return cachedResponse;
  }

  const response = await fetch(request);
  await putResponseInCache(request, response);
  return response;
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => cache.addAll(APP_SHELL_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((cacheNames) =>
        Promise.all(
          cacheNames
            .filter((cacheName) => cacheName !== CACHE_NAME)
            .map((cacheName) => caches.delete(cacheName))
        )
      )
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  if (!isCacheableRequest(event.request)) {
    return;
  }

  if (event.request.mode === "navigate") {
    event.respondWith(getNavigationResponse(event.request));
    return;
  }

  event.respondWith(getAssetResponse(event.request));
});
