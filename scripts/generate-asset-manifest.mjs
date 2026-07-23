import { createHash } from "node:crypto";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ASSET_SOURCE_PREFIX = "src/app/games/strand-bezem-escape/assets/";
const GAME_ENTRY = "src/app/games/strand-bezem-escape/index.tsx";
const MIME_TYPES = {
  ".avif": "image/avif",
  ".css": "text/css",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript",
  ".mp3": "audio/mpeg",
  ".mp4": "video/mp4",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webm": "video/webm",
  ".webp": "image/webp",
};

const readJson = (filePath) => JSON.parse(fs.readFileSync(filePath, "utf8"));
const sha256 = (buffer) => createHash("sha256").update(buffer).digest("hex");
const mimeFor = (filePath) =>
  MIME_TYPES[path.extname(filePath).toLowerCase()] ?? "application/octet-stream";

const listFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory() ? listFiles(filePath) : [filePath];
  });

export const validateGeneratedAssets = (assets) => {
  const ids = new Set();
  assets.forEach((asset) => {
    if (ids.has(asset.id)) throw new Error(`Duplicate asset-id: ${asset.id}`);
    ids.add(asset.id);
    if (!asset.url || !asset.hash || !asset.mimeType || asset.bytes <= 0) {
      throw new Error(`Onvolledige assetmetadata: ${asset.id}`);
    }
  });
  return assets;
};

const collectGameFiles = (viteManifest) => {
  const gameEntry =
    viteManifest[GAME_ENTRY] ??
    Object.values(viteManifest).find(
      (record) => record.isDynamicEntry && record.file?.includes("/game-strand-bezem-escape-"),
    );
  if (!gameEntry?.file) throw new Error(`Vite-manifest mist game-entry '${GAME_ENTRY}'.`);
  const sourceAssets = Object.entries(viteManifest)
    .filter(([sourcePath, record]) => sourcePath.startsWith(ASSET_SOURCE_PREFIX) && record.file)
    .map(([sourcePath, record]) => ({ file: record.file, sourcePath }));
  return [{ file: gameEntry.file, sourcePath: GAME_ENTRY }, ...sourceAssets];
};

export const createGeneratedAssetManifest = ({ distDirectory, packageSource, viteManifest }) => {
  const assets = collectGameFiles(viteManifest).map(({ file, sourcePath }) => {
    const outputPath = path.join(distDirectory, file);
    if (!fs.existsSync(outputPath)) {
      throw new Error(`Verplicht buildasset ontbreekt: ${file}`);
    }
    const contents = fs.readFileSync(outputPath);
    return {
      bytes: contents.byteLength,
      hash: `sha256-${sha256(contents)}`,
      id: sourcePath,
      license: packageSource.license,
      mimeType: mimeFor(file),
      required: true,
      source: packageSource.source,
      sourcePath,
      url: `/${file}`,
    };
  });
  validateGeneratedAssets(assets);
  return {
    assets: assets.sort((left, right) => left.id.localeCompare(right.id)),
    contentVersion: packageSource.contentVersion,
    gameId: packageSource.gameId,
    id: packageSource.id,
    schemaVersion: 1,
    totalBytes: assets.reduce((total, asset) => total + asset.bytes, 0),
    version: packageSource.version,
    worldId: packageSource.worldId,
  };
};

export const generateAssetManifest = ({
  distDirectory = path.resolve("dist"),
  packageSourcePath = path.resolve(
    "src/app/games/strand-bezem-escape/assets/offline-package.source.json",
  ),
  reportDirectory = path.resolve("reports"),
} = {}) => {
  const viteManifestPath = path.join(distDirectory, ".vite/manifest.json");
  if (!fs.existsSync(viteManifestPath)) {
    throw new Error("Bouw eerst de productieversie; dist/.vite/manifest.json ontbreekt.");
  }
  const packageSource = readJson(packageSourcePath);
  const viteManifest = readJson(viteManifestPath);
  const manifest = createGeneratedAssetManifest({
    distDirectory,
    packageSource,
    viteManifest,
  });
  const outputDirectory = path.join(distDirectory, "offline");
  fs.mkdirSync(outputDirectory, { recursive: true });
  const outputPath = path.join(
    outputDirectory,
    `${packageSource.id}-v${packageSource.version}.json`,
  );
  fs.writeFileSync(outputPath, `${JSON.stringify(manifest, null, 2)}\n`);

  const sourceRoot = path.resolve("src/app/games/strand-bezem-escape/assets");
  const referencedSources = new Set(manifest.assets.map((asset) => path.resolve(asset.sourcePath)));
  const orphans = listFiles(sourceRoot)
    .filter((filePath) => !filePath.endsWith(".md") && !filePath.endsWith(".json"))
    .filter((filePath) => !referencedSources.has(path.resolve(filePath)))
    .map((filePath) => path.relative(process.cwd(), filePath))
    .sort();
  fs.mkdirSync(reportDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(reportDirectory, "asset-report.json"),
    `${JSON.stringify(
      {
        assetCount: manifest.assets.length,
        contentVersion: manifest.contentVersion,
        orphanAssets: orphans,
        packageId: manifest.id,
        totalBytes: manifest.totalBytes,
      },
      null,
      2,
    )}\n`,
  );
  process.stdout.write(
    `Assetmanifest: ${manifest.assets.length} vereiste assets, ${(manifest.totalBytes / 1024 / 1024).toFixed(2)} MB, ${orphans.length} orphan-signalen.\n`,
  );
  return { manifest, orphans, outputPath };
};

const isDirectInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectInvocation) generateAssetManifest();
