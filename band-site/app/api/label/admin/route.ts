import crypto from "crypto";
import { NextResponse } from "next/server";
import { createFanClubUser } from "@/lib/storage";
import { requireLabelAdmin } from "@/lib/label-auth";
import { getLabelApplication, updateLabelApplication } from "@/lib/label-storage";
import { processArtistPayout } from "@/label/finance/payouts";
import { sendLabelEmail } from "@/label/notifications/email_system";
import { logLabelActivity } from "@/label/security/backup";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    await requireLabelAdmin();
    const { action, artistId } = (await request.json()) as { action: string; artistId: string };
    const app = await getLabelApplication(artistId);
    if (!app) return NextResponse.json({ error: "Artist not found." }, { status: 404 });

    if (action === "sign") {
      const tempPassword = `Kamdridi-${crypto.randomBytes(5).toString("hex")}!`;
      try {
        await createFanClubUser(app.artistName, app.email, tempPassword);
      } catch {
        // Existing fan-club account is acceptable; access is controlled by signed label status.
      }
      const signed = await updateLabelApplication(app.id, {
        status: "signed",
        paymentStatus: app.paymentStatus === "unpaid" ? "simulated" : app.paymentStatus,
        generatedRoyaltiesCents: Math.max(app.generatedRoyaltiesCents, 12500),
        payableRoyaltiesCents: Math.max(app.payableRoyaltiesCents, 8750)
      });
      await sendLabelEmail({ event: "welcome_signed_artist", to: app.email, params: { artistName: app.artistName } });
      await logLabelActivity({ actor: "label-admin", action: "sign_artist", target: app.id, ip: request.headers.get("x-forwarded-for") || undefined });
      return NextResponse.json({ artist: signed, tempPassword });
    }

    if (action === "refuse") {
      await sendLabelEmail({ event: "application_refused", to: app.email, params: { artistName: app.artistName } });
      await logLabelActivity({ actor: "label-admin", action: "refuse_artist", target: app.id, ip: request.headers.get("x-forwarded-for") || undefined });
      return NextResponse.json({ artist: await updateLabelApplication(app.id, { status: "refused" }) });
    }

    if (action === "payout") {
      const payout = await processArtistPayout(app.id);
      await sendLabelEmail({ event: "royalties_available", to: app.email, params: { artistName: app.artistName } });
      await logLabelActivity({ actor: "label-admin", action: "payout_artist", target: app.id, ip: request.headers.get("x-forwarded-for") || undefined });
      return NextResponse.json({ payout });
    }

    return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Admin action failed." }, { status: 500 });
  }
}
