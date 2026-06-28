import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { createArtistConnectAccount } from "@/label/connect/payouts";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const session = await requireLabelSession();
    const artist = await getLabelApplication(session.email);
    if (!artist || artist.status !== "signed") {
      return NextResponse.json({ error: "Signed artist access required." }, { status: 403 });
    }

    return NextResponse.json(await createArtistConnectAccount(artist.id, new URL(request.url).origin));
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Connect setup failed." }, { status: 500 });
  }
}
