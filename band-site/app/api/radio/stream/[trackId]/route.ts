import { get } from "@vercel/blob";
import { NextRequest, NextResponse } from "next/server";
import { getRadioTrack } from "@/lib/radio-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const forwardHeaders = ["accept-ranges", "content-length", "content-range", "content-type"];

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackId: string }> }
) {
  const { trackId } = await params;
  const track = getRadioTrack(trackId);

  if (!track) {
    return NextResponse.json({ error: "Unknown radio station." }, { status: 404 });
  }

  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Radio storage is not configured." }, { status: 503 });
  }

  try {
    const range = request.headers.get("range");
    const file = await get(track.pathname, {
      access: "private",
      headers: range ? { range } : undefined
    });

    if (!file || file.statusCode !== 200) {
      return NextResponse.json({ error: "Radio file is unavailable." }, { status: 404 });
    }

    const headers = new Headers();
    for (const header of forwardHeaders) {
      const value = file.headers.get(header);
      if (value) headers.set(header, value);
    }
    headers.set("Content-Disposition", "inline");
    headers.set("Cache-Control", "private, no-store");

    return new Response(file.stream, {
      status: file.headers.get("content-range") ? 206 : 200,
      headers
    });
  } catch (error) {
    console.error("[Signal Radio] stream failure", error);
    return NextResponse.json({ error: "Radio station is temporarily unavailable." }, { status: 503 });
  }
}
