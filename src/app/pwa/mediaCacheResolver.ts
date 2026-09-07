/**
 * @file mediaCacheResolver.ts
 * @description Biedt directe in-memory en CacheStorage resolutie naar Blob URLs voor video en audio.
 * Hiermee omzeilen we netwerk- en Service Worker-wachttijden volledig, zodat video's op mobiel
 * in 0 milliseconden direct vanaf het apparaat kunnen starten.
 */

const blobUrlCache = new Map<string, string>();
const OFFLINE_CACHE_PREFIX = "game-wereld-offline-";

const normalizeUrlPath = (url: string): string => {
  try {
    const parsed = new URL(
      url,
      typeof window !== "undefined" ? window.location.origin : "http://localhost",
    );
    return parsed.pathname;
  } catch {
    return url;
  }
};

/**
 * Zoekt een media-bestand in de offline- of runtime caches en geeft een lokale blob-URL terug.
 * Als het bestand niet gecached is, wordt de originele URL veilig geretourneerd als fallback.
 */
export const resolveCachedMediaUrl = async (
  url: string,
  cacheStorage: CacheStorage | undefined = typeof caches !== "undefined" ? caches : undefined,
): Promise<string> => {
  if (!url || !cacheStorage) {
    return url;
  }

  // 1. Snelle in-memory hit (0ms)
  const existingBlob = blobUrlCache.get(url);
  if (existingBlob) {
    return existingBlob;
  }

  try {
    const pathname = normalizeUrlPath(url);
    const cacheNames = await cacheStorage.keys();

    // Zoek eerst in de offline pakketcaches (prioriteit), daarna eventuele overige caches
    const sortedCacheNames = [
      ...cacheNames.filter((name) => name.startsWith(OFFLINE_CACHE_PREFIX)),
      ...cacheNames.filter((name) => !name.startsWith(OFFLINE_CACHE_PREFIX)),
    ];

    for (const cacheName of sortedCacheNames) {
      const cache = await cacheStorage.open(cacheName);

      // Probeer de exacte URL en het genormaliseerde pad
      let matched = await cache.match(url);
      if (!matched && pathname !== url) {
        matched = await cache.match(pathname);
      }

      if (matched) {
        const blob = await matched.blob();
        const blobUrl = URL.createObjectURL(blob);
        blobUrlCache.set(url, blobUrl);
        if (pathname !== url) {
          blobUrlCache.set(pathname, blobUrl);
        }
        return blobUrl;
      }
    }
  } catch {
    // Bij eventuele storage/DOM-fouten valt hij geruisloos terug naar de netwerk-URL
  }

  return url;
};

/**
 * Controleert of een media-URL reeds lokaal in de cache aanwezig is.
 */
export const isMediaCached = async (
  url: string,
  cacheStorage: CacheStorage | undefined = typeof caches !== "undefined" ? caches : undefined,
): Promise<boolean> => {
  if (!url || !cacheStorage) return false;
  if (blobUrlCache.has(url)) return true;

  try {
    const pathname = normalizeUrlPath(url);
    const cacheNames = await cacheStorage.keys();
    for (const cacheName of cacheNames) {
      const cache = await cacheStorage.open(cacheName);
      if ((await cache.match(url)) || (await cache.match(pathname))) {
        return true;
      }
    }
  } catch {
    return false;
  }
  return false;
};

/**
 * Ruimt gemaakte Object URLs op (bijv. bij wisselen van game of app teardown).
 */
export const clearCachedBlobUrls = () => {
  for (const blobUrl of blobUrlCache.values()) {
    try {
      URL.revokeObjectURL(blobUrl);
    } catch {
      // Negeer fouten tijdens opruimen
    }
  }
  blobUrlCache.clear();
};
