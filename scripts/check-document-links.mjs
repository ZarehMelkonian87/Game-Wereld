import fs from "node:fs";
import path from "node:path";

const roots = ["README.md", "docs", "src"];
const markdownFiles = roots.flatMap((root) => {
  if (!fs.existsSync(root)) return [];
  if (fs.statSync(root).isFile()) return [root];
  return fs
    .readdirSync(root, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && entry.name.endsWith(".md"))
    .map((entry) => path.join(entry.parentPath, entry.name));
});

const failures = [];
markdownFiles.forEach((file) => {
  const source = fs.readFileSync(file, "utf8");
  for (const match of source.matchAll(/\[[^\]]+\]\(([^)]+)\)/g)) {
    const rawTarget = match[1]?.trim().replace(/^<|>$/g, "");
    if (!rawTarget || rawTarget.startsWith("#") || /^[a-z][a-z0-9+.-]*:/i.test(rawTarget)) {
      continue;
    }
    const targetWithoutAnchor = decodeURIComponent(rawTarget.split("#")[0] ?? "");
    const resolved = path.resolve(path.dirname(file), targetWithoutAnchor);
    if (!fs.existsSync(resolved)) failures.push(`${file} -> ${rawTarget}`);
  }
});

if (failures.length > 0) {
  throw new Error(`Gebroken lokale documentlinks:\n${failures.join("\n")}`);
}

process.stdout.write(`Documentlinks: ${markdownFiles.length} Markdownbestanden gecontroleerd.\n`);
