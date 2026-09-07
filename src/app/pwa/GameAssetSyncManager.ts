/**
 * @file GameAssetSyncManager.ts
 * @description Automatische en incrementele synchronisatie van game-assets en video's.
 * Controleert bij het openen van de game welke bestanden al lokaal aanwezig zijn,
 * en downloadt uitsluitend nieuwe of ontbrekende bestanden.
 * Bevat een bewuste controle voor mobiele databundels (4G/5G).
 */

import {
  type OfflinePackageDescriptor,
  type OfflinePackageManifest,
  offlinePackageManifestSchema,
} from "./offlinePackages";

export interface SyncProgress {
  downloadedBytes: number;
  downloadedFiles: number;
  totalBytes: number;
  totalFiles: number;
}

export interface DeviceConnectionInfo {
  isCellular: boolean;
  isSaveData: boolean;
}

export const getDeviceConnectionInfo = (): DeviceConnectionInfo => {
  if (typeof navigator === "undefined") {
    return { isCellular: false, isSaveData: false };
  }

  const nav = navigator as Navigator & {
    connection?: {
      effectiveType?: string;
      saveData?: boolean;
      type?: string;
    };
  };

  const conn = nav.connection;
  if (!conn) {
    return { isCellular: false, isSaveData: false };
  }

  const isSaveData = Boolean(conn.saveData);
  const isCellular = conn.type === "cellular" || isSaveData;

  return { isCellular, isSaveData };
};

export interface CheckSyncResult {
  isCellular: boolean;
  isUpToDate: boolean;
  manifest: OfflinePackageManifest;
  missingCount: number;
  missingTotalBytes: number;
}

export type SyncState =
  | { status: "checking" }
  | {
      manifest: OfflinePackageManifest;
      missingCount: number;
      missingTotalBytes: number;
      status: "awaiting-cellular-confirmation";
    }
  | {
      manifest: OfflinePackageManifest;
      missingCount: number;
      missingTotalBytes: number;
      status: "syncing";
      progress: SyncProgress;
    }
  | {
      manifest: OfflinePackageManifest;
      status: "synced";
    }
  | {
      error: string;
      status: "error";
    };

const OFFLINE_CACHE_PREFIX = "game-wereld-offline-";
const safeCachePart = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");
const cacheNameFor = (descriptor: OfflinePackageDescriptor) =>
  `${OFFLINE_CACHE_PREFIX}${safeCachePart(descriptor.id)}-v${descriptor.version}`;
const metadataUrlFor = (origin: string, descriptor: OfflinePackageDescriptor) =>
  `${origin}/__offline-package-metadata__/${encodeURIComponent(descriptor.id)}/${descriptor.version}`;

interface SyncManagerDependencies {
  cacheStorage?: CacheStorage;
  fetcher?: typeof fetch;
  origin?: string;
  storageManager?: Partial<Pick<StorageManager, "persist" | "estimate">>;
}

export const createGameAssetSyncManager = ({
  cacheStorage = typeof caches !== "undefined" ? caches : undefined,
  fetcher = typeof fetch !== "undefined" ? fetch : undefined,
  origin = typeof window !== "undefined" ? window.location.origin : "http://localhost",
  storageManager = typeof navigator !== "undefined" ? navigator.storage : undefined,
}: SyncManagerDependencies = {}) => {
  const checkPackageSync = async (
    descriptor: OfflinePackageDescriptor,
    signal?: AbortSignal,
  ): Promise<CheckSyncResult> => {
    if (!cacheStorage || !fetcher) {
      throw new Error("CacheStorage of fetch niet beschikbaar op dit apparaat.");
    }

    const response = await fetcher(descriptor.manifestUrl, { cache: "no-store", signal });
    if (!response.ok) {
      throw new Error("Kon asset-manifest niet laden.");
    }
    const manifest = offlinePackageManifestSchema.parse(await response.json());

    const currentCacheName = cacheNameFor(descriptor);
    const cache = await cacheStorage.open(currentCacheName);

    const checkResults = await Promise.all(
      manifest.assets.map(async (asset) => {
        const matched = await cache.match(asset.url);
        return { asset, isCached: Boolean(matched) };
      }),
    );

    const missing = checkResults.filter((item) => !item.isCached).map((item) => item.asset);
    const missingTotalBytes = missing.reduce((sum, item) => sum + item.bytes, 0);
    const connection = getDeviceConnectionInfo();

    return {
      isCellular: connection.isCellular,
      isUpToDate: missing.length === 0,
      manifest,
      missingCount: missing.length,
      missingTotalBytes,
    };
  };

  const syncPackage = async (
    descriptor: OfflinePackageDescriptor,
    onProgress?: (progress: SyncProgress) => void,
    signal?: AbortSignal,
  ): Promise<SyncState> => {
    if (!cacheStorage || !fetcher) {
      return {
        error: "CacheStorage of fetch niet beschikbaar op dit apparaat.",
        status: "error",
      };
    }

    try {
      // Vraag persistente opslag aan zodat de browser data niet automatisch opschoont
      if (storageManager?.persist) {
        try {
          await storageManager.persist();
        } catch {
          // Niet fataal als persist() geweigerd wordt
        }
      }

      // 1. Haal manifest op (lichtgewicht json, ~60kb)
      const response = await fetcher(descriptor.manifestUrl, { cache: "no-store", signal });
      if (!response.ok) {
        throw new Error("Kon asset-manifest niet laden.");
      }
      const manifest = offlinePackageManifestSchema.parse(await response.json());

      // 2. Open de doellocatie in CacheStorage
      const currentCacheName = cacheNameFor(descriptor);
      const cache = await cacheStorage.open(currentCacheName);

      // 3. Controleer welke bestanden al aanwezig zijn (snelle check)
      const checkResults = await Promise.all(
        manifest.assets.map(async (asset) => {
          const matched = await cache.match(asset.url);
          return { asset, isCached: Boolean(matched) };
        }),
      );

      const missing = checkResults.filter((item) => !item.isCached).map((item) => item.asset);

      // Snelle afslag: Alles is al lokaal aanwezig! (0 ms wachttijd voor het kind)
      if (missing.length === 0) {
        return { manifest, status: "synced" };
      }

      // 4. Download uitsluitend de ontbrekende/nieuwe bestanden (incrementeel!)
      const missingTotalBytes = missing.reduce((sum, item) => sum + item.bytes, 0);
      let downloadedBytes = 0;
      let downloadedFiles = 0;

      for (const asset of missing) {
        if (signal?.aborted) {
          throw new DOMException("Synchronisatie geannuleerd.", "AbortError");
        }

        const assetResponse = await fetcher(asset.url, { signal });
        if (!assetResponse.ok) {
          throw new Error(`Bestand kon niet worden geladen: ${asset.url}`);
        }

        const buffer = await assetResponse.arrayBuffer();
        await cache.put(
          asset.url,
          new Response(buffer, {
            headers: assetResponse.headers,
            status: assetResponse.status,
            statusText: assetResponse.statusText,
          }),
        );

        downloadedBytes += asset.bytes;
        downloadedFiles += 1;

        if (onProgress) {
          onProgress({
            downloadedBytes,
            downloadedFiles,
            totalBytes: missingTotalBytes,
            totalFiles: missing.length,
          });
        }
      }

      // 5. Schrijf metadata zodat de package-inspecteur weet dat alles compleet is
      const metadata = {
        contentVersion: manifest.contentVersion,
        id: manifest.id,
        lastUsedAt: new Date().toISOString(),
        manifest,
        version: manifest.version,
      };
      await cache.put(
        metadataUrlFor(origin, descriptor),
        new Response(JSON.stringify(metadata), {
          headers: { "content-type": "application/json" },
        }),
      );

      return { manifest, status: "synced" };
    } catch (error) {
      if (error instanceof DOMException && error.name === "AbortError") {
        return { error: "Synchronisatie geannuleerd.", status: "error" };
      }
      return {
        error: error instanceof Error ? error.message : "Onbekende fout tijdens download.",
        status: "error",
      };
    }
  };

  return { checkPackageSync, syncPackage };
};
