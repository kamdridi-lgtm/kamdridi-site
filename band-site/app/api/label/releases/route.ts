import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { submitManagedRelease } from "@/label/releases/manager";
import { sendLabelEmail } from "@/label/notifications/email_system";
import { storeLabelFile } from "@/lib/label-file-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await requireLabelSession();
    const artist = await getLabelApplication(session.email);
    if (!artist || artist.status !== "signed") {
      return NextResponse.json({ error: "Signed artist access required." }, { status: 403 });
    }

    const form = await request.formData();
    const wav = await storeLabelFile(form.get("wav") as File | null, "masters");
    const cover = await storeLabelFile(form.get("cover") as File | null, "covers");
    const title = String(form.get("title") || "").trim();
    const isrc = String(form.get("isrc") || "").trim();
    const upc = String(form.get("upc") || "").trim();
    const releaseDate = String(form.get("releaseDate") || "").trim();
    const genre = String(form.get("genre") || "Cinematic Metal").trim();
    const featuring = String(form.get("featuring") || "").trim();
    const bpm = Number(form.get("bpm") || 0) || undefined;
    const musicalKey = String(form.get("musicalKey") || "").trim();

    if (!title || !releaseDate || !wav || !cover) {
      return NextResponse.json({ error: "Title, release date, WAV, and cover are required." }, { status: 400 });
    }

    const release = await submitManagedRelease({
      artistId: artist.id,
      artistName: artist.artistName,
      title,
      isrc,
      upc,
      releaseDate,
      wav,
      cover,
      genre,
      featuring,
      bpm,
      musicalKey
    });
    await sendLabelEmail({ event: "release_submitted", to: process.env.LABEL_ADMIN_EMAILS?.split(",")[0] || "contact@kamdridi.com" });
    return NextResponse.json({ release });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Release submission failed." }, { status: 500 });
  }
}
