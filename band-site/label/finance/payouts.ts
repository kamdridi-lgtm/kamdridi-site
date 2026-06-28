import { getLabelApplication, updateLabelApplication } from "@/lib/label-storage";
import { buildRoyaltyReport } from "@/label/analytics/advanced_stats";
import { payArtistRoyalties } from "@/label/connect/payouts";
import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type PayoutRecord = {
  id: string;
  artistId: string;
  amountCents: number;
  thresholdCents: number;
  status: "blocked_threshold" | "simulated" | "paid";
  transferId?: string;
  receiptNumber: string;
  createdAt: string;
};

export async function calculateArtistPayable(artistId: string) {
  const artist = await getLabelApplication(artistId);
  if (!artist) throw new Error("Artist not found.");
  const report = await buildRoyaltyReport(artistId);
  const payableCents = Math.max(artist.payableRoyaltiesCents, report.artistCents);
  return { artist, report, payableCents };
}

export async function processArtistPayout(artistId: string, thresholdCents = Number(process.env.LABEL_PAYOUT_THRESHOLD_CENTS || 5000)) {
  const { artist, payableCents } = await calculateArtistPayable(artistId);
  const createdAt = new Date().toISOString();
  const record: PayoutRecord = {
    id: `payout_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    artistId,
    amountCents: payableCents,
    thresholdCents,
    status: payableCents >= thresholdCents ? "simulated" : "blocked_threshold",
    receiptNumber: `KDR-${createdAt.slice(0, 10).replace(/-/g, "")}-${artist.id.slice(-5).toUpperCase()}`,
    createdAt
  };

  if (payableCents >= thresholdCents) {
    const payout = await payArtistRoyalties(artistId);
    record.transferId = payout.transferId;
    record.status = payout.mode === "stripe" ? "paid" : "simulated";
    await updateLabelApplication(artistId, { payableRoyaltiesCents: 0, generatedRoyaltiesCents: Math.max(artist.generatedRoyaltiesCents, payableCents) });
  }

  const history = await readLabelJson<PayoutRecord[]>("payout-history.json", []);
  history.unshift(record);
  await writeLabelJson("payout-history.json", history);
  return record;
}

export async function listPayoutHistory() {
  return readLabelJson<PayoutRecord[]>("payout-history.json", []);
}

export async function exportPayoutsCsv() {
  const payouts = await listPayoutHistory();
  return [
    "receiptNumber,artistId,amountCAD,status,transferId,createdAt",
    ...payouts.map((payout) =>
      [payout.receiptNumber, payout.artistId, (payout.amountCents / 100).toFixed(2), payout.status, payout.transferId || "", payout.createdAt]
        .map((cell) => `"${cell}"`)
        .join(",")
    )
  ].join("\n");
}
