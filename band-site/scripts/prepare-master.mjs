import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import { existsSync, mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from "node:fs";
import { dirname, extname, isAbsolute, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const siteRoot = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const publicRoot = join(siteRoot, "public");
const catalogPath = join(siteRoot, "data", "master-catalog.json");
const receiptsRoot = join(siteRoot, "data", "master-receipts");

function usage(message) {
  if (message) console.error(`\n${message}\n`);
  console.error(
    "Usage: node scripts/prepare-master.mjs --track <catalog-id> --input <master.wav> [--activate] [--force]\n" +
      "\nThe master is never copied into public/. A 320 kbps radio MP3 and a 36-second preview are generated."
  );
  process.exit(1);
}

function parseArgs(argv) {
  const result = { activate: false, force: false };
  for (let index = 0; index < argv.length; index += 1) {
    const value = argv[index];
    if (value === "--activate") result.activate = true;
    else if (value === "--force") result.force = true;
    else if (value === "--track") result.trackId = argv[++index];
    else if (value === "--input") result.input = argv[++index];
    else usage(`Unknown argument: ${value}`);
  }
  if (!result.trackId || !result.input) usage("Both --track and --input are required.");
  return result;
}

function requireCommand(command) {
  try {
    execFileSync(command, ["-version"], { stdio: "ignore" });
  } catch {
    throw new Error(`${command} is required but was not found.`);
  }
}

function publicFile(relativePath) {
  if (!relativePath || isAbsolute(relativePath)) throw new Error(`Unsafe public path: ${relativePath || "(empty)"}`);
  const absolutePath = resolve(publicRoot, relativePath);
  if (relative(publicRoot, absolutePath).startsWith("..")) throw new Error(`Public path escapes public/: ${relativePath}`);
  return absolutePath;
}

function probe(filePath) {
  const output = execFileSync(
    "ffprobe",
    ["-v", "error", "-show_entries", "format=duration,format_name:stream=codec_name,sample_rate,channels,bits_per_raw_sample", "-of", "json", filePath],
    { encoding: "utf8" }
  );
  const parsed = JSON.parse(output);
  const audio = parsed.streams?.find((stream) => stream.codec_name);
  return {
    durationSeconds: Number(parsed.format?.duration || 0),
    format: parsed.format?.format_name || "unknown",
    codec: audio?.codec_name || "unknown",
    sampleRate: Number(audio?.sample_rate || 0),
    channels: Number(audio?.channels || 0),
    bitsPerRawSample: Number(audio?.bits_per_raw_sample || 0)
  };
}

function sha256(filePath) {
  return createHash("sha256").update(readFileSync(filePath)).digest("hex");
}

function runFfmpeg(args) {
  execFileSync("ffmpeg", ["-hide_banner", "-loglevel", "error", "-nostdin", ...args], { stdio: "inherit" });
}

function atomicEncode(outputPath, ffmpegArgs, force) {
  if (existsSync(outputPath) && !force) {
    throw new Error(`Output already exists: ${relative(siteRoot, outputPath)}. Use --force only after confirming the replacement.`);
  }
  mkdirSync(dirname(outputPath), { recursive: true });
  const temporaryPath = `${outputPath}.partial-${process.pid}${extname(outputPath)}`;
  rmSync(temporaryPath, { force: true });
  try {
    runFfmpeg(["-y", ...ffmpegArgs, temporaryPath]);
    renameSync(temporaryPath, outputPath);
  } finally {
    rmSync(temporaryPath, { force: true });
  }
}

function syncBrasilPreviewButton(trackEntry) {
  if (trackEntry.collectionId !== "echoes-unlive-brasil") return;
  const pagePath = join(publicRoot, "echoes-un-live-in-brasil", "index.html");
  const marker = `data-master-track-id="${trackEntry.id}"`;
  if (!existsSync(pagePath)) throw new Error("Brasil release page is missing.");
  let html = readFileSync(pagePath, "utf8");
  if (!html.includes(marker)) return;

  const relativePreview = trackEntry.previewPath.replace(/^echoes-un-live-in-brasil\//, "");
  html = html
    .replace(`${marker} data-src=""`, `${marker} data-src="${relativePreview}"`)
    .replace(/ disabled style="opacity:0\.5;cursor:not-allowed"/, "")
    .replace('<span class="preview-access unavailable">', '<span class="preview-access">')
    .replace(
      '<span class="access-copy" data-en="Preview pending" data-fr="Extrait bientôt" data-pt="Prévia em breve">Prévia em breve</span><time>--:--</time>',
      '<span class="access-copy" data-en="Preview" data-fr="Extrait" data-pt="Prévia">Prévia</span><time>0:36</time>'
    );
  writeFileSync(pagePath, html, "utf8");
}

const args = parseArgs(process.argv.slice(2));
requireCommand("ffmpeg");
requireCommand("ffprobe");

const catalog = JSON.parse(readFileSync(catalogPath, "utf8"));
const track = catalog.tracks.find((entry) => entry.id === args.trackId);
if (!track) usage(`Unknown track id: ${args.trackId}`);

const collection = catalog.collections.find((entry) => entry.id === track.collectionId);
if (!collection) throw new Error(`Collection not found for ${track.id}.`);
if (collection.ingestLocked) {
  throw new Error(`${collection.title} is protected because it is already complete. No file was changed.`);
}

const inputPath = resolve(process.cwd(), args.input);
if (!existsSync(inputPath)) throw new Error(`Master not found: ${inputPath}`);
if (!/[.](wav|wave|flac|aif|aiff)$/i.test(inputPath)) {
  throw new Error("Master input must be WAV, FLAC, AIF, or AIFF. MP3 previews are not accepted as masters.");
}

const sourceProbe = probe(inputPath);
if (!Number.isFinite(sourceProbe.durationSeconds) || sourceProbe.durationSeconds < 60) {
  throw new Error(`Master duration is ${sourceProbe.durationSeconds.toFixed(2)}s. Full masters must be at least 60 seconds.`);
}
if (sourceProbe.channels < 1 || sourceProbe.sampleRate < 32000) {
  throw new Error(`Invalid audio stream: ${sourceProbe.channels} channel(s), ${sourceProbe.sampleRate} Hz.`);
}

const radioOutput = publicFile(track.radioPath);
const previewOutput = publicFile(track.previewPath);
const album = collection.title;
const displayTitle = track.version ? `${track.title} — ${track.version}` : track.title;
const metadata = [
  "-metadata", `artist=${catalog.artist}`,
  "-metadata", `album=${album}`,
  "-metadata", `title=${displayTitle}`,
  "-metadata", `track=${track.trackNumber}`
];

atomicEncode(
  radioOutput,
  ["-i", inputPath, "-map", "0:a:0", "-vn", "-map_metadata", "-1", ...metadata, "-c:a", "libmp3lame", "-b:a", "320k"],
  args.force
);

const previewStart = Number(track.previewStartSeconds || 0);
atomicEncode(
  previewOutput,
  ["-ss", String(previewStart), "-i", inputPath, "-t", String(catalog.previewDurationSeconds), "-map", "0:a:0", "-vn", "-map_metadata", "-1", ...metadata, "-c:a", "libmp3lame", "-b:a", "256k"],
  args.force
);

const radioProbe = probe(radioOutput);
const previewProbe = probe(previewOutput);
if (radioProbe.durationSeconds < 60) throw new Error("Generated radio file failed the full-track duration check.");
if (Math.abs(previewProbe.durationSeconds - catalog.previewDurationSeconds) > 0.75) {
  throw new Error(`Generated preview is ${previewProbe.durationSeconds.toFixed(2)}s instead of ${catalog.previewDurationSeconds}s.`);
}

track.status = "processed";
track.radioEnabled = Boolean(args.activate);
track.previewAvailable = true;
track.lastProcessedAt = new Date().toISOString();
track.sourceSha256 = sha256(inputPath);
writeFileSync(catalogPath, `${JSON.stringify(catalog, null, 2)}\n`, "utf8");
syncBrasilPreviewButton(track);

mkdirSync(receiptsRoot, { recursive: true });
const receipt = {
  schemaVersion: 1,
  trackId: track.id,
  collectionId: track.collectionId,
  title: displayTitle,
  processedAt: track.lastProcessedAt,
  activatedForRadio: track.radioEnabled,
  source: {
    originalFilename: inputPath.split(/[\\/]/).pop(),
    sha256: track.sourceSha256,
    ...sourceProbe
  },
  outputs: {
    radio: { path: track.radioPath, sha256: sha256(radioOutput), ...radioProbe },
    preview: { path: track.previewPath, sha256: sha256(previewOutput), ...previewProbe }
  }
};
writeFileSync(join(receiptsRoot, `${track.id}.json`), `${JSON.stringify(receipt, null, 2)}\n`, "utf8");

console.log(`Prepared: ${displayTitle}`);
console.log(`Radio:   ${track.radioPath} (${radioProbe.durationSeconds.toFixed(2)}s, 320 kbps MP3)`);
console.log(`Preview: ${track.previewPath} (${previewProbe.durationSeconds.toFixed(2)}s)`);
console.log(args.activate ? "Radio activation: enabled" : "Radio activation: held for review (run again with --activate after approval)");
