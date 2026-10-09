import fs from "node:fs/promises";
import path from "node:path";

const siteRoot = path.resolve("C:/Users/Administrator/OneDrive/Documents/EchoesEngine_complete/kamdridi-site");
const indexPath = path.join(siteRoot, "index.html");
const cssOut = path.join(siteRoot, "assets/css/index.css");
const jsOut = path.join(siteRoot, "assets/js/index.js");

async function ensureDir(filePath) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
}

function replaceFirst(haystack, needle, replacement) {
  const idx = haystack.indexOf(needle);
  if (idx === -1) return haystack;
  return haystack.slice(0, idx) + replacement + haystack.slice(idx + needle.length);
}

const html = await fs.readFile(indexPath, "utf8");

const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/i);
const scriptMatch = html.match(/<script>\s*const T = [\s\S]*?<\/script>/i);

if (styleMatch) {
  await ensureDir(cssOut);
  await fs.writeFile(cssOut, `${styleMatch[1].trim()}\n`, "utf8");
}

if (scriptMatch) {
  await ensureDir(jsOut);
  await fs.writeFile(jsOut, `${scriptMatch[0].replace(/^<script>/i, "").replace(/<\/script>$/i, "").trim()}\n`, "utf8");
}

let updated = html;
if (styleMatch) {
  updated = replaceFirst(
    updated,
    styleMatch[0],
    [
      '<link rel="preload" href="assets/css/index.css" as="style">',
      '<link rel="stylesheet" href="assets/css/index.css">'
    ].join("\n  ")
  );
}

if (scriptMatch) {
  updated = replaceFirst(
    updated,
    scriptMatch[0],
    '<script src="assets/js/index.js" defer></script>'
  );
}

const base64ImgRegex = /<img src="data:image\/png;base64,([^"]+)" alt="([^"]+)"([^>]*)>/gi;
const inlineMatches = [...html.matchAll(base64ImgRegex)];

for (const [index, match] of inlineMatches.entries()) {
  const [, base64Data, altText, trailingAttrs] = match;
  const safeName =
    index === 0 ? "echoes-unearthed-cover.png" : `inline-release-${index + 1}.png`;
  const imageOut = path.join(siteRoot, `assets/images/releases/${safeName}`);
  const webPath = `assets/images/releases/${safeName}`;
  await ensureDir(imageOut);
  await fs.writeFile(imageOut, Buffer.from(base64Data, "base64"));
  updated = replaceFirst(
    updated,
    match[0],
    `<img src="${webPath}" alt="${altText}" loading="lazy" decoding="async"${trailingAttrs}>`
  );
}

await fs.writeFile(indexPath, updated, "utf8");

console.log("Optimized index.html:");
if (styleMatch) {
  console.log(`- extracted inline CSS -> ${path.relative(siteRoot, cssOut)}`);
}
if (scriptMatch) {
  console.log(`- extracted inline JS  -> ${path.relative(siteRoot, jsOut)}`);
}
console.log(`- extracted base64 PNGs -> ${inlineMatches.length}`);
