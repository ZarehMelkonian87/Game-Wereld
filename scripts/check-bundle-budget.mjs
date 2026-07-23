import fs from "node:fs";
import path from "node:path";
import { gzipSync } from "node:zlib";

const manifestPath = path.resolve("dist/.vite/manifest.json");
const manifest = JSON.parse(fs.readFileSync(manifestPath, "utf8"));

const gzipBytes = (file) => gzipSync(fs.readFileSync(path.resolve("dist", file))).byteLength;
const formatKilobytes = (bytes) => `${(bytes / 1024).toFixed(2)} kB gzip`;
const entry = manifest["index.html"];
const game = manifest["src/app/games/strand-bezem-escape/index.tsx"];

if (!entry?.file || !game?.file) {
  throw new Error("Bundlemanifest mist de shell-entry of de Strand Bezem Escape-gamechunk.");
}

const budgets = [
  {
    actual: gzipBytes(entry.file),
    label: "app-shell entry",
    limit: 200 * 1024,
  },
  {
    actual: gzipBytes(game.file),
    label: "strand-bezem-escape gamechunk",
    limit: 250 * 1024,
  },
  {
    actual: (entry.css ?? []).reduce((total, file) => total + gzipBytes(file), 0),
    label: "app-shell CSS",
    limit: 40 * 1024,
  },
];

let failed = false;
budgets.forEach(({ actual, label, limit }) => {
  const status = actual <= limit ? "PASS" : "FAIL";
  process.stdout.write(
    `${status} ${label}: ${formatKilobytes(actual)} / ${formatKilobytes(limit)}\n`,
  );
  failed ||= actual > limit;
});

if (failed) {
  process.exitCode = 1;
}
