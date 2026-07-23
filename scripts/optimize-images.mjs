import fs from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("src/app/games/strand-bezem-escape/assets");
const webpSources = [
  "backgrounds/beach-board-landscape.png",
  "backgrounds/beach-board-portrait.png",
  "backgrounds/beach-voice-side-scroller.png",
];
const pngDirectories = ["backgrounds", "icons", "logos", "objects"];

const listPngFiles = (directory) =>
  fs.readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const filePath = path.join(directory, entry.name);
    return entry.isDirectory()
      ? listPngFiles(filePath)
      : entry.name.endsWith(".png")
        ? [filePath]
        : [];
  });

const optimizePng = async (filePath) => {
  const before = fs.statSync(filePath).size;
  const temporaryPath = `${filePath}.optimized`;
  await sharp(filePath).png({ compressionLevel: 9 }).toFile(temporaryPath);
  const after = fs.statSync(temporaryPath).size;
  if (after < before) {
    fs.renameSync(temporaryPath, filePath);
    return { after, before, file: path.relative(process.cwd(), filePath) };
  }
  fs.unlinkSync(temporaryPath);
  return { after: before, before, file: path.relative(process.cwd(), filePath) };
};

const pngResults = [];
for (const directory of pngDirectories) {
  for (const filePath of listPngFiles(path.join(root, directory))) {
    pngResults.push(await optimizePng(filePath));
  }
}

const variants = [];
for (const source of webpSources) {
  const sourcePath = path.join(root, source);
  const outputPath = sourcePath.replace(/\.png$/, ".webp");
  await sharp(sourcePath).webp({ effort: 6, quality: 82 }).toFile(outputPath);
  variants.push({
    bytes: fs.statSync(outputPath).size,
    file: path.relative(process.cwd(), outputPath),
    source: path.relative(process.cwd(), sourcePath),
  });
}

const bytesBefore = pngResults.reduce((total, result) => total + result.before, 0);
const bytesAfter = pngResults.reduce((total, result) => total + result.after, 0);
fs.mkdirSync(path.resolve("reports"), { recursive: true });
fs.writeFileSync(
  path.resolve("reports/image-optimization.json"),
  `${JSON.stringify({ bytesAfter, bytesBefore, pngResults, variants }, null, 2)}\n`,
);
process.stdout.write(
  `PNG lossless: ${(bytesBefore / 1024 / 1024).toFixed(2)} MB → ${(bytesAfter / 1024 / 1024).toFixed(2)} MB; ${variants.length} WebP-varianten gegenereerd.\n`,
);
