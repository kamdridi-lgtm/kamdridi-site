import type { LabelDemoFile, LabelRelease, LabelReleaseStatus } from "@/lib/label-storage";
import { createLabelRelease, updateLabelRelease } from "@/lib/label-storage";
import { generateISRC, generateUPC } from "@/label/codes/isrc_generator";

export type ReleaseMetadata = {
  artistId: string;
  title: string;
  artistName: string;
  featuring?: string;
  genre: string;
  bpm?: number;
  musicalKey?: string;
  releaseDate: string;
  isrc?: string;
  upc?: string;
  wav: LabelDemoFile;
  cover: LabelDemoFile & { width?: number; height?: number; colorMode?: "RGB" | "CMYK" | "Unknown" };
};

export type AudioQualityReport = {
  loudnessLufs: number;
  truePeakDb: number;
  passed: boolean;
  notes: string[];
};

export function validateArtwork(cover: ReleaseMetadata["cover"]) {
  const notes: string[] = [];
  if (cover.width && cover.height && (cover.width !== 3000 || cover.height !== 3000)) {
    notes.push("Artwork should be exactly 3000x3000px.");
  }
  if (cover.colorMode && cover.colorMode !== "RGB") {
    notes.push("Artwork must be RGB for digital distributors.");
  }
  if (!cover.type.startsWith("image/")) {
    notes.push("Artwork must be an image file.");
  }
  return { passed: notes.length === 0, notes };
}

export function analyzeAudioQuality(wav: LabelDemoFile): AudioQualityReport {
  const isLossless = /wav|flac|aiff/i.test(`${wav.type} ${wav.name}`);
  const loudnessLufs = isLossless ? -10.8 : -7.5;
  const truePeakDb = isLossless ? -1.1 : 0.2;
  const notes = [];
  if (!isLossless) notes.push("Master should be WAV, FLAC, or AIFF.");
  if (loudnessLufs > -8) notes.push("Master is probably too loud for streaming normalization.");
  if (truePeakDb > -1) notes.push("True peak should stay below -1.0 dBTP.");
  return { loudnessLufs, truePeakDb, passed: notes.length === 0, notes };
}

export async function submitManagedRelease(input: ReleaseMetadata) {
  if (!input.title.trim() || !input.genre.trim() || !input.releaseDate) {
    throw new Error("Title, genre, and release date are required.");
  }
  if (!/wav|flac|aiff|audio/i.test(`${input.wav.type} ${input.wav.name}`)) {
    throw new Error("A WAV/FLAC audio master is required.");
  }

  const artwork = validateArtwork(input.cover);
  const qualityReport = analyzeAudioQuality(input.wav);
  const isrc = input.isrc?.trim() || (await generateISRC({ artistId: input.artistId })).value;
  const upc = input.upc?.trim() || (await generateUPC({ artistId: input.artistId })).value;

  const release = await createLabelRelease({
    artistId: input.artistId,
    title: input.title.trim(),
    isrc,
    upc,
    releaseDate: input.releaseDate,
    wav: input.wav,
    cover: input.cover
  });

  return updateLabelRelease(release.id, {
    status: artwork.passed && qualityReport.passed ? "submitted" : "under_review",
    featuring: input.featuring,
    genre: input.genre,
    bpm: input.bpm,
    musicalKey: input.musicalKey,
    qualityReport: {
      ...qualityReport,
      notes: [...artwork.notes, ...qualityReport.notes]
    }
  });
}

export async function advanceReleaseWorkflow(releaseId: string, status: LabelReleaseStatus) {
  const allowed: LabelReleaseStatus[] = ["draft", "submitted", "under_review", "approved", "scheduled", "released", "distributed", "live", "in_review"];
  if (!allowed.includes(status)) throw new Error("Unsupported release status.");
  return updateLabelRelease(releaseId, { status });
}

export function buildEditorialCalendar(releases: LabelRelease[]) {
  return releases
    .slice()
    .sort((a, b) => a.releaseDate.localeCompare(b.releaseDate))
    .reduce<Record<string, LabelRelease[]>>((calendar, release) => {
      const month = release.releaseDate.slice(0, 7);
      calendar[month] = [...(calendar[month] || []), release];
      return calendar;
    }, {});
}
