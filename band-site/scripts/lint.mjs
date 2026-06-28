import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const checkedExtensions = new Set([".ts", ".tsx", ".js", ".jsx", ".mjs", ".cjs"]);
const ignoredDirs = new Set([".git", ".next", "node_modules", ".vercel"]);
const requiredFiles = [
  "app/label/ai-artists/[slug]/page.tsx",
  "data/ai-artists.ts",
  "public/audio/dust-on-the-altar.mp3",
  "public/assets/images/label/iron-county-ghosts/band-hero.png",
  "public/assets/images/label/iron-county-ghosts/lead-portrait.png",
  "public/assets/images/label/iron-county-ghosts/dust-on-the-altar-cover.png",
  "public/assets/images/label/iron-county-ghosts/band-alt-wide.png",
  "public/assets/images/label/iron-county-ghosts/band-dark-church.png"
];

const errors = [];

function walk(dir) {
  for (const entry of readdirSync(dir)) {
    if (ignoredDirs.has(entry)) continue;
    const fullPath = path.join(dir, entry);
    const stats = statSync(fullPath);
    if (stats.isDirectory()) {
      walk(fullPath);
      continue;
    }

    if (!checkedExtensions.has(path.extname(entry))) continue;
    const relative = path.relative(root, fullPath).replaceAll("\\", "/");
    const source = readFileSync(fullPath, "utf8");

    if (source.includes("\u0000")) {
      errors.push(`${relative}: contains null bytes`);
    }

    if (relative.includes("label/ai-artists") && source.includes("href=\"#\"")) {
      errors.push(`${relative}: contains a dead href="#" link`);
    }

    if (relative.includes("label/ai-artists") && source.includes("TODO")) {
      errors.push(`${relative}: contains TODO placeholder text`);
    }
  }
}

for (const file of requiredFiles) {
  if (!existsSync(path.join(root, file))) {
    errors.push(`missing required file: ${file}`);
  }
}

walk(root);

if (errors.length > 0) {
  console.error("Lint failed:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("Custom lint passed: source scan and IRON COUNTY GHOSTS assets verified.");
