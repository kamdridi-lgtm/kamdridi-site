import { listLabelApplications, listLabelReleases, type LabelApplication, type LabelRelease } from "@/lib/label-storage";
import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type StreamPlatform = "spotify" | "apple" | "youtube" | "deezer";

export type StreamStat = {
  id: string;
  artistId: string;
  releaseId: string;
  platform: StreamPlatform;
  month: string;
  streams: number;
  createdAt: string;
};

export type RoyaltySplit = {
  artistPct: number;
  labelPct: number;
  distributionFeePct: number;
};

export type RoyaltyLine = {
  platform: StreamPlatform;
  streams: number;
  grossCents: number;
  distributionFeeCents: number;
  netCents: number;
  artistCents: number;
  labelCents: number;
};

export type RoyaltyReport = {
  artist: LabelApplication;
  releases: LabelRelease[];
  split: RoyaltySplit;
  totalStreams: number;
  grossCents: number;
  netCents: number;
  artistCents: number;
  labelCents: number;
  monthly: Array<{ month: string; streams: number; grossCents: number; artistCents: number; labelCents: number }>;
  lines: RoyaltyLine[];
  annualProjectionCents: number;
  chartJs: {
    labels: string[];
    datasets: Array<{ label: string; data: number[]; borderColor: string; backgroundColor: string }>;
  };
};

const ratesCents: Record<StreamPlatform, number> = {
  spotify: 0.3,
  apple: 0.7,
  youtube: 0.1,
  deezer: 0.35
};

const platforms: StreamPlatform[] = ["spotify", "apple", "youtube", "deezer"];

function cents(value: number) {
  return Math.round(value);
}

export function calculateRoyaltyLines(stats: StreamStat[], split: RoyaltySplit): RoyaltyLine[] {
  return platforms.map((platform) => {
    const streams = stats.filter((stat) => stat.platform === platform).reduce((sum, stat) => sum + stat.streams, 0);
    const grossCents = cents(streams * ratesCents[platform]);
    const distributionFeeCents = cents(grossCents * (split.distributionFeePct / 100));
    const netCents = Math.max(0, grossCents - distributionFeeCents);
    return {
      platform,
      streams,
      grossCents,
      distributionFeeCents,
      netCents,
      artistCents: cents(netCents * (split.artistPct / 100)),
      labelCents: cents(netCents * (split.labelPct / 100))
    };
  });
}

export async function listStreamStats() {
  return readLabelJson<StreamStat[]>("stream-stats.json", []);
}

export async function recordStreamStats(input: Omit<StreamStat, "id" | "createdAt">) {
  const stats = await listStreamStats();
  const stat: StreamStat = {
    ...input,
    id: `stat_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    createdAt: new Date().toISOString()
  };
  stats.unshift(stat);
  await writeLabelJson("stream-stats.json", stats);
  return stat;
}

export async function seedSimulatedStats() {
  const existing = await listStreamStats();
  if (existing.length) return existing;
  const [artists, releases] = await Promise.all([listLabelApplications(), listLabelReleases()]);
  const signed = artists.filter((artist) => artist.status === "signed");
  const generated: StreamStat[] = [];
  const months = Array.from({ length: 6 }, (_, i) => {
    const date = new Date();
    date.setMonth(date.getMonth() - (5 - i));
    return date.toISOString().slice(0, 7);
  });

  for (const artist of signed) {
    const artistReleases = releases.filter((release) => release.artistId === artist.id);
    const releaseIds = artistReleases.length ? artistReleases.map((release) => release.id) : [`sim_${artist.id}`];
    for (const releaseId of releaseIds) {
      for (const month of months) {
        for (const platform of platforms) {
          const base = platform === "youtube" ? 4200 : platform === "spotify" ? 2200 : 900;
          const growth = months.indexOf(month) + 1;
          generated.push({
            id: `stat_${artist.id}_${releaseId}_${platform}_${month}`,
            artistId: artist.id,
            releaseId,
            platform,
            month,
            streams: Math.round(base * growth * (0.7 + Math.random() * 0.8)),
            createdAt: new Date().toISOString()
          });
        }
      }
    }
  }

  await writeLabelJson("stream-stats.json", generated);
  return generated;
}

export async function buildRoyaltyReport(artistId: string, split?: Partial<RoyaltySplit>): Promise<RoyaltyReport> {
  const [artists, releases, allStats] = await Promise.all([listLabelApplications(), listLabelReleases(), seedSimulatedStats()]);
  const artist = artists.find((entry) => entry.id === artistId);
  if (!artist) throw new Error("Artist not found.");
  const artistReleases = releases.filter((release) => release.artistId === artist.id);
  const stats = allStats.filter((stat) => stat.artistId === artist.id);
  const finalSplit: RoyaltySplit = {
    artistPct: split?.artistPct ?? artist.revenueSplitArtist ?? 70,
    labelPct: split?.labelPct ?? artist.revenueSplitLabel ?? 30,
    distributionFeePct: split?.distributionFeePct ?? 18
  };
  const lines = calculateRoyaltyLines(stats, finalSplit);
  const months = [...new Set(stats.map((stat) => stat.month))].sort();
  const monthly = months.map((month) => {
    const monthLines = calculateRoyaltyLines(stats.filter((stat) => stat.month === month), finalSplit);
    return {
      month,
      streams: monthLines.reduce((sum, line) => sum + line.streams, 0),
      grossCents: monthLines.reduce((sum, line) => sum + line.grossCents, 0),
      artistCents: monthLines.reduce((sum, line) => sum + line.artistCents, 0),
      labelCents: monthLines.reduce((sum, line) => sum + line.labelCents, 0)
    };
  });
  const lastThree = monthly.slice(-3);
  const averageMonthlyArtist = lastThree.length
    ? lastThree.reduce((sum, month) => sum + month.artistCents, 0) / lastThree.length
    : 0;

  return {
    artist,
    releases: artistReleases,
    split: finalSplit,
    totalStreams: lines.reduce((sum, line) => sum + line.streams, 0),
    grossCents: lines.reduce((sum, line) => sum + line.grossCents, 0),
    netCents: lines.reduce((sum, line) => sum + line.netCents, 0),
    artistCents: lines.reduce((sum, line) => sum + line.artistCents, 0),
    labelCents: lines.reduce((sum, line) => sum + line.labelCents, 0),
    monthly,
    lines,
    annualProjectionCents: cents(averageMonthlyArtist * 12 * 1.18),
    chartJs: {
      labels: monthly.map((month) => month.month),
      datasets: [
        {
          label: "Artist royalties",
          data: monthly.map((month) => month.artistCents / 100),
          borderColor: "#f4c66a",
          backgroundColor: "rgba(244,198,106,0.18)"
        },
        {
          label: "Label share",
          data: monthly.map((month) => month.labelCents / 100),
          borderColor: "#ff4b38",
          backgroundColor: "rgba(255,75,56,0.14)"
        }
      ]
    }
  };
}

export function exportRoyaltyCsv(report: RoyaltyReport) {
  const rows = [
    ["Artist", report.artist.artistName],
    ["Total streams", String(report.totalStreams)],
    ["Gross CAD", (report.grossCents / 100).toFixed(2)],
    ["Net CAD", (report.netCents / 100).toFixed(2)],
    ["Artist CAD", (report.artistCents / 100).toFixed(2)],
    ["Label CAD", (report.labelCents / 100).toFixed(2)],
    [],
    ["Month", "Streams", "Gross CAD", "Artist CAD", "Label CAD"],
    ...report.monthly.map((month) => [
      month.month,
      String(month.streams),
      (month.grossCents / 100).toFixed(2),
      (month.artistCents / 100).toFixed(2),
      (month.labelCents / 100).toFixed(2)
    ])
  ];
  return rows.map((row) => row.map((cell) => `"${String(cell ?? "").replace(/"/g, '""')}"`).join(",")).join("\n");
}

export function exportRoyaltyPdfText(report: RoyaltyReport) {
  return [
    "KAMDRIDI RECORDS ROYALTY REPORT",
    `Artist: ${report.artist.artistName}`,
    `Generated: ${new Date().toISOString()}`,
    `Split: ${report.split.artistPct}% Artist / ${report.split.labelPct}% Label`,
    `Distribution fee: ${report.split.distributionFeePct}%`,
    `Total streams: ${report.totalStreams}`,
    `Gross: $${(report.grossCents / 100).toFixed(2)} CAD`,
    `Artist payable: $${(report.artistCents / 100).toFixed(2)} CAD`,
    `Annual projection: $${(report.annualProjectionCents / 100).toFixed(2)} CAD`
  ].join("\n");
}
