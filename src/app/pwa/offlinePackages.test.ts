import { describe, expect, it } from "vitest";
import type { OfflinePackageDescriptor } from "./offlinePackages";
import { createOfflinePackageManager, offlinePackageManifestSchema } from "./offlinePackages";

class FakeCache {
  readonly records = new Map<string, Response>();
  failWrites = false;

  private key = (request: RequestInfo | URL) =>
    typeof request === "string" ? request : request instanceof URL ? request.href : request.url;

  match = async (request: RequestInfo | URL) => this.records.get(this.key(request))?.clone();

  put = async (request: RequestInfo | URL, response: Response) => {
    if (this.failWrites) throw new DOMException("vol", "QuotaExceededError");
    this.records.set(this.key(request), response.clone());
  };

  keys = async () => [...this.records.keys()].map((url) => new Request(url));
}

class FakeCacheStorage {
  readonly stores = new Map<string, FakeCache>();
  failWrites = false;

  delete = async (name: string) => this.stores.delete(name);
  keys = async () => [...this.stores.keys()];
  open = async (name: string) => {
    const cache = this.stores.get(name) ?? new FakeCache();
    cache.failWrites = this.failWrites;
    this.stores.set(name, cache);
    return cache;
  };
}

const descriptor: OfflinePackageDescriptor = {
  contentVersion: "content-v1",
  id: "game-world",
  manifestUrl: "/offline/game-world-v1.json",
  version: 1,
};

const manifest = offlinePackageManifestSchema.parse({
  assets: [
    {
      bytes: 3,
      hash: "sha256-content-one",
      id: "one",
      license: "test",
      mimeType: "text/plain",
      required: true,
      source: "fixture",
      sourcePath: "one.txt",
      url: "/assets/one.txt",
    },
    {
      bytes: 3,
      hash: "sha256-content-two",
      id: "two",
      license: "test",
      mimeType: "text/plain",
      required: true,
      source: "fixture",
      sourcePath: "two.txt",
      url: "/assets/two.txt",
    },
  ],
  contentVersion: "content-v1",
  gameId: "game",
  id: "game-world",
  schemaVersion: 1,
  totalBytes: 6,
  version: 1,
  worldId: "world",
});

const createManager = (cacheStorage: FakeCacheStorage) =>
  createOfflinePackageManager({
    cacheStorage: cacheStorage as unknown as CacheStorage,
    fetcher: (async (input: RequestInfo | URL) => {
      const url = String(input);
      if (url === descriptor.manifestUrl) {
        return new Response(JSON.stringify(manifest), {
          headers: { "content-type": "application/json" },
        });
      }
      return new Response(url.includes("one") ? "one" : "two");
    }) as typeof fetch,
    hasher: async (buffer) => `content-${new TextDecoder().decode(buffer)}`,
    origin: "https://game.test",
    storageManager: { estimate: async () => ({ quota: 100, usage: 10 }) },
  });

describe("offlinepakketmanager", () => {
  it("wordt pas ready nadat ieder vereist asset is geverifieerd", async () => {
    const cacheStorage = new FakeCacheStorage();
    const manager = createManager(cacheStorage);
    const estimated = await manager.estimate(descriptor);
    expect(estimated).toMatchObject({
      availableBytes: 90,
      status: "awaiting-confirmation",
    });
    if (estimated.status !== "awaiting-confirmation") return;

    const states: string[] = [];
    const result = await manager.download(descriptor, estimated.manifest, {
      onState: (state) => states.push(state.status),
      signal: new AbortController().signal,
    });

    expect(result.status).toBe("ready");
    expect(states).toContain("verifying");
    await expect(manager.inspect(descriptor)).resolves.toMatchObject({ status: "ready" });
  });

  it("ruimt een geannuleerde gedeeltelijke download op", async () => {
    const cacheStorage = new FakeCacheStorage();
    const manager = createManager(cacheStorage);
    const controller = new AbortController();
    controller.abort();

    await expect(
      manager.download(descriptor, manifest, {
        onState: () => undefined,
        signal: controller.signal,
      }),
    ).resolves.toMatchObject({ status: "failed" });
    await expect(manager.inspect(descriptor)).resolves.toEqual({ status: "not-downloaded" });
  });

  it("wordt bij quota-falen nooit ready en verwijdert partial cache", async () => {
    const cacheStorage = new FakeCacheStorage();
    cacheStorage.failWrites = true;
    const manager = createManager(cacheStorage);

    await expect(
      manager.download(descriptor, manifest, {
        onState: () => undefined,
        signal: new AbortController().signal,
      }),
    ).resolves.toMatchObject({
      message: expect.stringContaining("onvoldoende opslagruimte"),
      status: "failed",
    });
    await expect(manager.inspect(descriptor)).resolves.toEqual({ status: "not-downloaded" });
  });

  it("behandelt een ontbrekende storage estimate als onbekende schatting", async () => {
    const cacheStorage = new FakeCacheStorage();
    const manager = createOfflinePackageManager({
      cacheStorage: cacheStorage as unknown as CacheStorage,
      fetcher: (async () => new Response(JSON.stringify(manifest))) as typeof fetch,
      origin: "https://game.test",
      storageManager: {},
    });

    await expect(manager.estimate(descriptor)).resolves.toMatchObject({
      availableBytes: undefined,
      status: "awaiting-confirmation",
    });
  });

  it("begrensd opruimen behoudt het beschermde actieve pakket", async () => {
    const cacheStorage = new FakeCacheStorage();
    await cacheStorage.open("game-wereld-offline-old-v1");
    await cacheStorage.open("game-wereld-offline-other-v1");
    await cacheStorage.open("game-wereld-offline-active-v1");
    const manager = createManager(cacheStorage);

    await manager.cleanupOldPackages("game-wereld-offline-active-v1", 2);

    expect(await cacheStorage.keys()).toHaveLength(2);
    expect(await cacheStorage.keys()).toContain("game-wereld-offline-active-v1");
  });
});
