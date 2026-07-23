import { z } from "zod";
import type { GameManifest } from "../game-platform/contracts";

export type OfflinePackageDescriptor = GameManifest["offlinePackages"][number];

const offlineAssetSchema = z
  .object({
    bytes: z.number().int().positive(),
    hash: z.string().startsWith("sha256-"),
    id: z.string().min(1),
    license: z.string().min(1),
    mimeType: z.string().min(1),
    required: z.boolean(),
    source: z.string().min(1),
    sourcePath: z.string().min(1),
    url: z.string().startsWith("/"),
  })
  .strict();

export const offlinePackageManifestSchema = z
  .object({
    assets: z.array(offlineAssetSchema).min(1),
    contentVersion: z.string().min(1),
    gameId: z.string().min(1),
    id: z.string().min(1),
    schemaVersion: z.literal(1),
    totalBytes: z.number().int().positive(),
    version: z.number().int().positive(),
    worldId: z.string().min(1),
  })
  .strict()
  .superRefine((manifest, context) => {
    if (manifest.assets.reduce((total, asset) => total + asset.bytes, 0) !== manifest.totalBytes) {
      context.addIssue({ code: "custom", message: "Pakkettotaal wijkt af van assettotalen." });
    }
    if (new Set(manifest.assets.map((asset) => asset.id)).size !== manifest.assets.length) {
      context.addIssue({ code: "custom", message: "Offlinepakket bevat duplicate asset-id's." });
    }
  });

export type OfflinePackageManifest = z.infer<typeof offlinePackageManifestSchema>;

export type OfflinePackageState =
  | { status: "not-downloaded" }
  | { status: "estimating" }
  | {
      availableBytes?: number;
      manifest: OfflinePackageManifest;
      status: "awaiting-confirmation";
      usageBytes?: number;
    }
  | { downloadedBytes: number; totalBytes: number; status: "downloading" }
  | { status: "verifying"; totalBytes: number }
  | { manifest: OfflinePackageManifest; status: "ready" }
  | { missingAssets: number; status: "partial" }
  | { message: string; status: "failed" }
  | { installedVersion: number; status: "outdated" };

interface PackageMetadata {
  contentVersion: string;
  id: string;
  lastUsedAt: string;
  manifest: OfflinePackageManifest;
  version: number;
}

interface OfflinePackageManagerDependencies {
  cacheStorage?: CacheStorage;
  clock?: { now: () => Date };
  fetcher?: typeof fetch;
  hasher?: (buffer: ArrayBuffer) => Promise<string>;
  origin?: string;
  storageManager?: Partial<Pick<StorageManager, "estimate">>;
}

const OFFLINE_CACHE_PREFIX = "game-wereld-offline-";
export const LARGE_OFFLINE_PACKAGE_BYTES = 50 * 1024 * 1024;

const safeCachePart = (value: string) => value.replace(/[^a-zA-Z0-9_-]/g, "-");
const cachePrefixFor = (descriptor: OfflinePackageDescriptor) =>
  `${OFFLINE_CACHE_PREFIX}${safeCachePart(descriptor.id)}-v`;
const cacheNameFor = (descriptor: OfflinePackageDescriptor) =>
  `${cachePrefixFor(descriptor)}${descriptor.version}`;
const metadataUrlFor = (origin: string, descriptor: OfflinePackageDescriptor) =>
  `${origin}/__offline-package-metadata__/${encodeURIComponent(descriptor.id)}/${descriptor.version}`;

const parseMetadata = async (response?: Response): Promise<PackageMetadata | undefined> => {
  if (!response) return undefined;
  try {
    const value = (await response.json()) as PackageMetadata;
    return value?.manifest ? value : undefined;
  } catch {
    return undefined;
  }
};

const hashBuffer = async (buffer: ArrayBuffer) => {
  const digest = await crypto.subtle.digest("SHA-256", buffer);
  return [...new Uint8Array(digest)].map((byte) => byte.toString(16).padStart(2, "0")).join("");
};

const assertDescriptorMatches = (
  descriptor: OfflinePackageDescriptor,
  manifest: OfflinePackageManifest,
) => {
  if (
    descriptor.id !== manifest.id ||
    descriptor.version !== manifest.version ||
    descriptor.contentVersion !== manifest.contentVersion
  ) {
    throw new Error("Offlinepakket hoort bij een andere content- of pakketversie.");
  }
};

export const createOfflinePackageManager = ({
  cacheStorage = caches,
  clock = { now: () => new Date() },
  fetcher = fetch,
  hasher = hashBuffer,
  origin = window.location.origin,
  storageManager = navigator.storage,
}: OfflinePackageManagerDependencies = {}) => {
  const readManifest = async (descriptor: OfflinePackageDescriptor) => {
    const response = await fetcher(descriptor.manifestUrl, { cache: "no-store" });
    if (!response.ok) throw new Error("Offlinepakketmanifest kon niet worden geladen.");
    const manifest = offlinePackageManifestSchema.parse(await response.json());
    assertDescriptorMatches(descriptor, manifest);
    return manifest;
  };

  const inspect = async (descriptor: OfflinePackageDescriptor): Promise<OfflinePackageState> => {
    const names = await cacheStorage.keys();
    const currentName = cacheNameFor(descriptor);
    if (!names.includes(currentName)) {
      const oldName = names.find((name) => name.startsWith(cachePrefixFor(descriptor)));
      if (!oldName) return { status: "not-downloaded" };
      const installedVersion = Number(oldName.slice(cachePrefixFor(descriptor).length)) || 0;
      return { installedVersion, status: "outdated" };
    }
    const cache = await cacheStorage.open(currentName);
    const metadata = await parseMetadata(await cache.match(metadataUrlFor(origin, descriptor)));
    if (!metadata) return { missingAssets: 1, status: "partial" };
    const matches = await Promise.all(
      metadata.manifest.assets
        .filter((asset) => asset.required)
        .map((asset) => cache.match(asset.url)),
    );
    const missingAssets = matches.filter((response) => !response).length;
    return missingAssets === 0
      ? { manifest: metadata.manifest, status: "ready" }
      : { missingAssets, status: "partial" };
  };

  const estimate = async (descriptor: OfflinePackageDescriptor): Promise<OfflinePackageState> => {
    const [manifest, storageEstimate] = await Promise.all([
      readManifest(descriptor),
      storageManager?.estimate
        ? storageManager.estimate().catch((): StorageEstimate => ({}))
        : Promise.resolve<StorageEstimate>({}),
    ]);
    const availableBytes =
      storageEstimate.quota === undefined
        ? undefined
        : Math.max(0, storageEstimate.quota - (storageEstimate.usage ?? 0));
    return {
      availableBytes,
      manifest,
      status: "awaiting-confirmation",
      usageBytes: storageEstimate.usage,
    };
  };

  const remove = async (descriptor: OfflinePackageDescriptor) =>
    cacheStorage.delete(cacheNameFor(descriptor));

  const download = async (
    descriptor: OfflinePackageDescriptor,
    manifest: OfflinePackageManifest,
    options: {
      onState: (state: OfflinePackageState) => void;
      signal: AbortSignal;
    },
  ): Promise<OfflinePackageState> => {
    assertDescriptorMatches(descriptor, manifest);
    const cacheName = cacheNameFor(descriptor);
    await cacheStorage.delete(cacheName);
    const cache = await cacheStorage.open(cacheName);
    let downloadedBytes = 0;
    try {
      for (const asset of manifest.assets) {
        if (options.signal.aborted) throw new DOMException("Download geannuleerd.", "AbortError");
        const response = await fetcher(asset.url, {
          cache: "no-store",
          signal: options.signal,
        });
        if (!response.ok) throw new Error(`Asset kon niet worden geladen: ${asset.id}`);
        const buffer = await response.arrayBuffer();
        if (buffer.byteLength !== asset.bytes) {
          throw new Error(`Assetgrootte klopt niet: ${asset.id}`);
        }
        const hash = await hasher(buffer);
        if (`sha256-${hash}` !== asset.hash) {
          throw new Error(`Assetcontrole mislukt: ${asset.id}`);
        }
        await cache.put(
          asset.url,
          new Response(buffer, {
            headers: response.headers,
            status: response.status,
            statusText: response.statusText,
          }),
        );
        downloadedBytes += asset.bytes;
        options.onState({
          downloadedBytes,
          status: "downloading",
          totalBytes: manifest.totalBytes,
        });
      }
      options.onState({ status: "verifying", totalBytes: manifest.totalBytes });
      const verified = await Promise.all(
        manifest.assets.filter((asset) => asset.required).map((asset) => cache.match(asset.url)),
      );
      if (verified.some((response) => !response)) {
        throw new Error("Niet alle verplichte assets zijn na download aanwezig.");
      }
      const metadata: PackageMetadata = {
        contentVersion: manifest.contentVersion,
        id: manifest.id,
        lastUsedAt: clock.now().toISOString(),
        manifest,
        version: manifest.version,
      };
      await cache.put(
        metadataUrlFor(origin, descriptor),
        new Response(JSON.stringify(metadata), {
          headers: { "content-type": "application/json" },
        }),
      );
      return { manifest, status: "ready" };
    } catch (error) {
      await cacheStorage.delete(cacheName);
      if (error instanceof DOMException && error.name === "AbortError") {
        return {
          message: "Download geannuleerd; gedeeltelijke bestanden zijn opgeruimd.",
          status: "failed",
        };
      }
      const quotaMessage =
        error instanceof DOMException && error.name === "QuotaExceededError"
          ? "Er is onvoldoende opslagruimte voor dit offlinepakket."
          : error instanceof Error
            ? error.message
            : "Offlinepakket downloaden is mislukt.";
      return { message: quotaMessage, status: "failed" };
    }
  };

  const cleanupOldPackages = async (protectedCacheName?: string, maxPackages = 2) => {
    const names = (await cacheStorage.keys()).filter((name) =>
      name.startsWith(OFFLINE_CACHE_PREFIX),
    );
    const candidates = await Promise.all(
      names.map(async (name) => {
        const cache = await cacheStorage.open(name);
        const requests = await cache.keys();
        const metadataRequest = requests.find((request) =>
          request.url.includes("/__offline-package-metadata__/"),
        );
        const metadata = await parseMetadata(
          metadataRequest ? await cache.match(metadataRequest) : undefined,
        );
        return { lastUsedAt: metadata?.lastUsedAt ?? "", name };
      }),
    );
    const removable = candidates
      .filter(({ name }) => name !== protectedCacheName)
      .sort((left, right) => right.lastUsedAt.localeCompare(left.lastUsedAt))
      .slice(Math.max(0, maxPackages - (protectedCacheName ? 1 : 0)));
    await Promise.all(removable.map(({ name }) => cacheStorage.delete(name)));
    return removable.map(({ name }) => name);
  };

  return {
    cleanupOldPackages,
    download,
    estimate,
    inspect,
    remove,
  };
};
