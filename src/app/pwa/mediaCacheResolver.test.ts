import { beforeEach, describe, expect, it, vi } from "vitest";
import { clearCachedBlobUrls, isMediaCached, resolveCachedMediaUrl } from "./mediaCacheResolver";

describe("mediaCacheResolver", () => {
  beforeEach(() => {
    clearCachedBlobUrls();
  });

  it("geeft de originele URL terug wanneer caches niet beschikbaar is", async () => {
    const resolved = await resolveCachedMediaUrl("/test.mp4", undefined);
    expect(resolved).toBe("/test.mp4");
  });

  it("geeft de originele URL terug als het bestand niet in de cache staat", async () => {
    const mockCacheStorage = {
      keys: vi.fn().mockResolvedValue(["game-wereld-offline-pack-v1"]),
      open: vi.fn().mockResolvedValue({
        match: vi.fn().mockResolvedValue(undefined),
      }),
    } as unknown as CacheStorage;

    const resolved = await resolveCachedMediaUrl("/video.mp4", mockCacheStorage);
    expect(resolved).toBe("/video.mp4");
  });

  it("resolveert naar een Blob URL wanneer het bestand in de offline cache staat", async () => {
    const mockBlob = new Blob(["mock-video-bytes"], { type: "video/mp4" });
    const mockResponse = {
      blob: vi.fn().mockResolvedValue(mockBlob),
    };

    const mockCache = {
      match: vi.fn().mockImplementation((req: string) => {
        if (req.includes("video.mp4")) return Promise.resolve(mockResponse);
        return Promise.resolve(undefined);
      }),
    };

    const mockCacheStorage = {
      keys: vi.fn().mockResolvedValue(["game-wereld-offline-pack-v1"]),
      open: vi.fn().mockResolvedValue(mockCache),
    } as unknown as CacheStorage;

    const createObjectURLSpy = vi
      .spyOn(URL, "createObjectURL")
      .mockReturnValue("blob:http://localhost/mock-uuid");

    const resolved = await resolveCachedMediaUrl("/assets/video.mp4", mockCacheStorage);
    expect(resolved).toBe("blob:http://localhost/mock-uuid");
    expect(createObjectURLSpy).toHaveBeenCalledWith(mockBlob);

    // Tweede aanroep moet direct uit in-memory cache komen zonder cacheStorage opnieuw aan te roepen
    mockCache.match.mockClear();
    const secondResolved = await resolveCachedMediaUrl("/assets/video.mp4", mockCacheStorage);
    expect(secondResolved).toBe("blob:http://localhost/mock-uuid");
    expect(mockCache.match).not.toHaveBeenCalled();

    createObjectURLSpy.mockRestore();
  });

  it("isMediaCached geeft true terug als bestand in cache staat", async () => {
    const mockCache = {
      match: vi.fn().mockResolvedValue({}),
    };
    const mockCacheStorage = {
      keys: vi.fn().mockResolvedValue(["game-wereld-offline-pack-v1"]),
      open: vi.fn().mockResolvedValue(mockCache),
    } as unknown as CacheStorage;

    const cached = await isMediaCached("/assets/video.mp4", mockCacheStorage);
    expect(cached).toBe(true);
  });
});
