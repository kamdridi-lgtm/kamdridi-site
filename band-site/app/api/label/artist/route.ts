import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication, listLabelReleases } from "@/lib/label-storage";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await requireLabelSession();
    const artist = await getLabelApplication(session.email);
    if (!artist || artist.status !== "signed") {
      return NextResponse.json({ error: "Signed artist access required." }, { status: 403 });
    }
    const releases = (await listLabelReleases()).filter((release) => release.artistId === artist.id);
    return NextResponse.json({ artist, releases });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Artist lookup failed." }, { status: 401 });
  }
}
