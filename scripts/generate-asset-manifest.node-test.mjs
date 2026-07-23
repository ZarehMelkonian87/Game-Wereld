import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import {
  createGeneratedAssetManifest,
  validateGeneratedAssets,
} from "./generate-asset-manifest.mjs";

const packageSource = {
  contentVersion: "content-v1",
  gameId: "game",
  id: "game-world",
  license: "test-license",
  source: "test-source",
  version: 1,
  worldId: "world",
};

const createFixture = () => {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "game-wereld-assets-"));
  fs.mkdirSync(path.join(directory, "assets"), { recursive: true });
  fs.writeFileSync(path.join(directory, "assets/game.js"), "game");
  fs.writeFileSync(path.join(directory, "assets/image.png"), "image");
  return directory;
};

test("genereert stabiele metadata voor gamecode en runtimeassets", () => {
  const distDirectory = createFixture();
  const manifest = createGeneratedAssetManifest({
    distDirectory,
    packageSource,
    viteManifest: {
      [GAME_ENTRY]: { file: "assets/game.js" },
      [`${ASSET_SOURCE_PREFIX}image.png`]: { file: "assets/image.png" },
    },
  });

  assert.equal(manifest.assets.length, 2);
  assert.equal(manifest.totalBytes, 9);
  assert.deepEqual(
    manifest.assets.map(({ mimeType, required, source }) => ({ mimeType, required, source })),
    [
      { mimeType: "image/png", required: true, source: "test-source" },
      { mimeType: "text/javascript", required: true, source: "test-source" },
    ],
  );
  fs.rmSync(distDirectory, { force: true, recursive: true });
});

test("weigert ontbrekende verplichte output en duplicate ids", () => {
  const distDirectory = createFixture();
  assert.throws(
    () =>
      createGeneratedAssetManifest({
        distDirectory,
        packageSource,
        viteManifest: {
          [GAME_ENTRY]: { file: "assets/ontbreekt.js" },
        },
      }),
    /ontbreekt/,
  );
  assert.throws(
    () =>
      validateGeneratedAssets([
        { bytes: 1, hash: "x", id: "duplicate", mimeType: "text/plain", url: "/a" },
        { bytes: 1, hash: "y", id: "duplicate", mimeType: "text/plain", url: "/b" },
      ]),
    /Duplicate/,
  );
  fs.rmSync(distDirectory, { force: true, recursive: true });
});

const GAME_ENTRY = "src/app/games/strand-bezem-escape/index.tsx";
const ASSET_SOURCE_PREFIX = "src/app/games/strand-bezem-escape/assets/";
