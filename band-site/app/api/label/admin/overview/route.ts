import { NextResponse } from "next/server";
import { requireLabelAdmin } from "@/lib/label-auth";
import { listLabelApplications, listLabelReleases } from "@/lib/label-storage";
import { buildRoyaltyReport, seedSimulatedStats } from "@/label/analytics/advanced_stats";
import { buildEditorialCalendar } from "@/label/releases/manager";
import { listPayoutHistory } from "@/label/finance/payouts";
import { listContractRenewalAlerts } from "@/label/legal/advanced_contracts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireLabelAdmin();
    const [applications, releases, stats, payouts, contractAlerts] = await Promise.all([
      listLabelApplications(),
      listLabelReleases(),
      seedSimulatedStats(),
      listPayoutHistory(),
      listContractRenewalAlerts()
    ]);
    const signed = applications.filter((app) => app.status === "signed");
    const reports = await Promise.all(signed.map((artist) => buildRoyaltyReport(artist.id).catch(() => null)));
    const cleanReports = reports.filter(Boolean);
    const totalRevenueCents = cleanReports.reduce((sum, report) => sum + (report?.grossCents || 0), 0);
    const topArtists = cleanReports
      .map((report) => ({ artistId: report!.artist.id, artistName: report!.artist.artistName, streams: report!.totalStreams, artistCents: report!.artistCents }))
      .sort((a, b) => b.streams - a.streams)
      .slice(0, 5);

    return NextResponse.json({
      overview: {
        signedArtists: signed.length,
        pendingArtists: applications.filter((app) => app.status === "pending_review").length,
        releasesThisMonth: releases.filter((release) => release.releaseDate.startsWith(new Date().toISOString().slice(0, 7))).length,
        totalRevenueCents,
        totalStreams: stats.reduce((sum, stat) => sum + stat.streams, 0),
        payoutsPendingCents: signed.reduce((sum, artist) => sum + artist.payableRoyaltiesCents, 0),
        topArtists,
        contractAlerts,
        payouts,
        calendar: buildEditorialCalendar(releases)
      }
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Overview failed.";
    const status = /login|required|access/i.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
