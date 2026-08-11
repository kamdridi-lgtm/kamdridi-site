import { execFileSync } from "node:child_process";
import { existsSync, readFileSync } from "node:fs";
import { dirname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(siteRoot, "public");
const catalog = JSON.parse(readFileSync(join(siteRoot, "data", "master-catalog.json"), "utf8"));
const errors = [];
const warnings = [];

function duration(filePath) {
  return Number(
    execFileSync("ffprobe", ["-v", "error", "-show_entries", "format=duration", "-of", "default=noprint_wrappers=1:nokey=1", filePath], {
      encoding: "utf8"
    }).trim()
  );
}

function resolvePublic(relativePath, label) {
  if (!relativePath || isAbsolute(relativePath)) {
    errors.push(`${label}: unsafe or empty path`);
    return null;
  }
  const absolute = resolve(publicRoot, relativePath);
  if (relative(publicRoot, absolute).startsWith("..")) {
    errors.push(`${label}: path escapes public/`);
    return null;
  }
  return absolute;
}

function findDuplicates(values) {
  const seen = new Set();
  const duplicates = new Set();
  for (const value of values) {
    if (seen.has(value)) duplicates.add(value);
    seen.add(value);
  }
  return [...duplicates];
}

for (const duplicate of findDuplicates(catalog.collections.map((entry) => entry.id))) errors.push(`Duplicate collection id: ${duplicate}`);
for (const duplicate of findDuplicates(catalog.tracks.map((entry) => entry.id))) errors.push(`Duplicate track id: ${duplicate}`);
for (const duplicate of findDuplicates(catalog.tracks.map((entry) => entry.radioPath))) errors.push(`Duplicate radio path: ${duplicate}`);
for (const duplicate of findDuplicates(catalog.tracks.map((entry) => entry.previewPath).filter(Boolean))) errors.push(`Duplicate preview path: ${duplicate}`);

const collectionIds = new Set(catalog.collections.map((entry) => entry.id));
let liveCount = 0;
let awaitingCount = 0;
let previewCount = 0;

for (const track of catalog.tracks) {
  const label = `${track.id} (${track.title})`;
  if (!collectionIds.has(track.collectionId)) errors.push(`${label}: unknown collection ${track.collectionId}`);
  if (!Number.isInteger(track.trackNumber) || track.trackNumber < 1) errors.push(`${label}: invalid track number`);

  const radioFile = resolvePublic(track.radioPath, `${label} radio`);
  if (track.radioEnabled) {
    liveCount += 1;
    if (!radioFile || !existsSync(radioFile)) {
      errors.push(`${label}: radioEnabled but file is missing`);
    } else {
      const seconds = duration(radioFile);
      if (seconds < 60) errors.push(`${label}: enabled radio file is only ${seconds.toFixed(2)}s`);
    }
  } else {
    awaitingCount += 1;
  }

  if (track.previewPath) {
    const previewFile = resolvePublic(track.previewPath, `${label} preview`);
    if (previewFile && existsSync(previewFile)) {
      previewCount += 1;
      const seconds = duration(previewFile);
      if (Math.abs(seconds - catalog.previewDurationSeconds) > 0.75) {
        warnings.push(`${label}: preview is ${seconds.toFixed(2)}s (target ${catalog.previewDurationSeconds}s)`);
      }
    } else if (track.previewAvailable || track.status === "processed" || track.status === "live") {
      errors.push(`${label}: processed/live preview is missing`);
    }
  }
}

console.log(`Catalog: ${catalog.collections.length} collections, ${catalog.tracks.length} registered tracks`);
console.log(`Radio: ${liveCount} enabled full tracks, ${awaitingCount} safely disabled`);
console.log(`Previews found: ${previewCount}`);

for (const warning of warnings) console.warn(`WARNING: ${warning}`);
for (const error of errors) console.error(`ERROR: ${error}`);

if (errors.length > 0) process.exit(1);
console.log("Master catalog verification passed.");
