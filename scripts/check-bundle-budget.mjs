import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { gzipSync } from "node:zlib";

const formatKilobytes = (bytes) => `${(bytes / 1024).toFixed(2)} kB`;
const formatDelta = (actual, baseline) => {
  if (baseline === undefined) return "geen main-baseline";
  const delta = actual - baseline;
  const percentage = baseline === 0 ? 0 : (delta / baseline) * 100;
  return `${delta >= 0 ? "+" : ""}${formatKilobytes(delta)} (${percentage >= 0 ? "+" : ""}${percentage.toFixed(1)}%) t.o.v. main`;
};

export const evaluatePerformanceBudgets = (measurements, config) => {
  const results = [
    {
      actual: measurements.shellJavaScriptGzip,
      baseline: config.shellJavaScriptGzip.mainBaselineBytes,
      label: "app-shell JavaScript gzip",
      limit: config.shellJavaScriptGzip.limitBytes,
    },
    {
      actual: measurements.gameJavaScriptGzip,
      baseline: config.gameJavaScriptGzip.mainBaselineBytes,
      label: "gamechunk JavaScript gzip",
      limit: config.gameJavaScriptGzip.limitBytes,
    },
    {
      actual: measurements.shellCssGzip,
      baseline: config.shellCssGzip.mainBaselineBytes,
      label: "app-shell CSS gzip",
      limit: config.shellCssGzip.limitBytes,
    },
    {
      actual: measurements.offlinePackage,
      label: "offlinepakket",
      limit: config.offlinePackage.limitBytes,
    },
  ].map((result) => ({
    ...result,
    passed: result.actual <= result.limit,
  }));
  const approvalRequired =
    measurements.offlinePackage > config.offlinePackage.approvalThresholdBytes;
  const approvalPassed =
    !approvalRequired ||
    (config.offlinePackage.approvedAboveThreshold &&
      Boolean(config.offlinePackage.approvalReference));
  return {
    approvalPassed,
    approvalReference: approvalRequired ? config.offlinePackage.approvalReference : undefined,
    passed: results.every((result) => result.passed) && approvalPassed,
    results,
  };
};

export const checkPerformanceBudgets = ({
  configPath = path.resolve("config/performance-budgets.json"),
  distDirectory = path.resolve("dist"),
  reportDirectory = path.resolve("reports"),
} = {}) => {
  const viteManifest = JSON.parse(
    fs.readFileSync(path.join(distDirectory, ".vite/manifest.json"), "utf8"),
  );
  const packageManifest = JSON.parse(
    fs.readFileSync(path.join(distDirectory, "offline/strand-bezem-escape-beach-v1.json"), "utf8"),
  );
  const config = JSON.parse(fs.readFileSync(configPath, "utf8"));
  const entry = viteManifest["index.html"];
  const game = Object.values(viteManifest).find(
    (record) => record.isDynamicEntry && record.file?.includes("/game-strand-bezem-escape-"),
  );
  if (!entry?.file || !game?.file) {
    throw new Error("Bundlemanifest mist de shell-entry of de lazy gamechunk.");
  }
  const gzipBytes = (file) => gzipSync(fs.readFileSync(path.join(distDirectory, file))).byteLength;
  const measurements = {
    gameJavaScriptGzip: gzipBytes(game.file),
    offlinePackage: packageManifest.totalBytes,
    shellCssGzip: (entry.css ?? []).reduce((total, file) => total + gzipBytes(file), 0),
    shellJavaScriptGzip: gzipBytes(entry.file),
  };
  const evaluation = evaluatePerformanceBudgets(measurements, config);
  evaluation.results.forEach(({ actual, baseline, label, limit, passed }) => {
    process.stdout.write(
      `${passed ? "PASS" : "FAIL"} ${label}: ${formatKilobytes(actual)} / ${formatKilobytes(limit)}; ${formatDelta(actual, baseline)}\n`,
    );
  });
  if (evaluation.approvalReference) {
    process.stdout.write(
      `${evaluation.approvalPassed ? "PASS" : "FAIL"} groot offlinepakket: expliciet goedgekeurd via ${evaluation.approvalReference}\n`,
    );
  }
  fs.mkdirSync(reportDirectory, { recursive: true });
  fs.writeFileSync(
    path.join(reportDirectory, "performance-budget.json"),
    `${JSON.stringify({ evaluation, measurements }, null, 2)}\n`,
  );
  if (!evaluation.passed) process.exitCode = 1;
  return { evaluation, measurements };
};

const isDirectInvocation =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isDirectInvocation) checkPerformanceBudgets();
