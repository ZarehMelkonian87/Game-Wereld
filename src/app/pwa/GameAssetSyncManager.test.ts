import { describe, expect, it, vi } from "vitest";
import { createGameAssetSyncManager } from "./GameAssetSyncManager";
import type { OfflinePackageDescriptor, OfflinePackageManifest } from "./offlinePackages";

describe("GameAssetSyncManager", () => {
  const descriptor: OfflinePackageDescriptor = {
    contentVersion: "v1",
    id: "test-game",
    manifestUrl: "/offline/test-game.json",
    version: 1,
  };

  const manifest: OfflinePackageManifest = {
    assets: [
      {
        bytes: 100,
        hash: "sha256-a1",
        id: "asset-1",
        license: "test",
        mimeType: "video/mp4",
        required: true,
        source: "test",
        sourcePath: "video1.mp4",
        url: "/video1.mp4",
      },
      {
        bytes: 200,
        hash: "sha256-a2",
        id: "asset-2",
        license: "test",
        mimeType: "video/mp4",
        required: true,
        source: "test",
        sourcePath: "video2.mp4",
        url: "/video2.mp4",
      },
    ],
    contentVersion: "v1",
    gameId: "test-game",
    id: "test-game",
    schemaVersion: 1,
    totalBytes: 300,
    version: 1,
    worldId: "beach",
  };

  it("geeft status 'synced' terug wanneer alle bestanden al in cache staan", async () => {
    const mockCache = {
      match: vi.fn().mockResolvedValue({}),
      put: vi.fn().mockResolvedValue(undefined),
    };
    const mockCacheStorage = {
      open: vi.fn().mockResolvedValue(mockCache),
    } as unknown as CacheStorage;

    const mockFetcher = vi.fn().mockResolvedValue({
      json: vi.fn().mockResolvedValue(manifest),
      ok: true,
    } as unknown as Response);

    const syncManager = createGameAssetSyncManager({
      cacheStorage: mockCacheStorage,
      fetcher: mockFetcher,
    });

    const result = await syncManager.syncPackage(descriptor);
    expect(result.status).toBe("synced");
    // fetcher mag alleen het manifest hebben opgehaald, GEEN van de assets omdat ze al gecached zijn
    expect(mockFetcher).toHaveBeenCalledTimes(1);
    expect(mockFetcher).toHaveBeenCalledWith("/offline/test-game.json", expect.anything());
  });

  it("downloadt incrementeel alleen ontbrekende bestanden", async () => {
    const mockCache = {
      match: vi.fn().mockImplementation((url: string) => {
        // video1 is al aanwezig, video2 ontbreekt
        if (url === "/video1.mp4") return Promise.resolve({});
        return Promise.resolve(undefined);
      }),
      put: vi.fn().mockResolvedValue(undefined),
    };

    const mockCacheStorage = {
      open: vi.fn().mockResolvedValue(mockCache),
    } as unknown as CacheStorage;

    const progressUpdates: unknown[] = [];
    const mockFetcher = vi.fn().mockImplementation((url: string) => {
      if (url === "/offline/test-game.json") {
        return Promise.resolve({
          json: () => Promise.resolve(manifest),
          ok: true,
        });
      }
      return Promise.resolve({
        arrayBuffer: () => Promise.resolve(new ArrayBuffer(200)),
        headers: new Headers(),
        ok: true,
        status: 200,
        statusText: "OK",
      });
    });

    const syncManager = createGameAssetSyncManager({
      cacheStorage: mockCacheStorage,
      fetcher: mockFetcher,
    });

    const result = await syncManager.syncPackage(descriptor, (p) => progressUpdates.push(p));

    expect(result.status).toBe("synced");
    // Moet 2 calls hebben gehad: manifest en uitsluitend /video2.mp4
    expect(mockFetcher).toHaveBeenCalledTimes(2);
    expect(mockFetcher).toHaveBeenCalledWith("/video2.mp4", expect.anything());
    expect(mockCache.put).toHaveBeenCalledWith("/video2.mp4", expect.anything());
    expect(progressUpdates.length).toBe(1);
  });

  it("checkPackageSync rapporteert ontbrekende bestanden en totale bytes correct", async () => {
    const mockCache = {
      match: vi.fn().mockImplementation((url: string) => {
        if (url === "/video1.mp4") return Promise.resolve({});
        return Promise.resolve(undefined);
      }),
    };

    const mockCacheStorage = {
      open: vi.fn().mockResolvedValue(mockCache),
    } as unknown as CacheStorage;

    const mockFetcher = vi.fn().mockResolvedValue({
      json: () => Promise.resolve(manifest),
      ok: true,
    } as unknown as Response);

    const syncManager = createGameAssetSyncManager({
      cacheStorage: mockCacheStorage,
      fetcher: mockFetcher,
    });

    const check = await syncManager.checkPackageSync(descriptor);
    expect(check.isUpToDate).toBe(false);
    expect(check.missingCount).toBe(1);
    expect(check.missingTotalBytes).toBe(200);
  });
});
