import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { generateISRC, generateUPC, exportCodesCsv } from "@/label/codes/isrc_generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    await requireLabelSession();
    if (new URL(request.url).searchParams.get("format") === "csv") {
      return new Response(await exportCodesCsv(), { headers: { "Content-Type": "text/csv; charset=utf-8" } });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Login required." }, { status: 401 });
  }
}

export async function POST(request: Request) {
  try {
    await requireLabelSession();
    const body = (await request.json()) as { type: "ISRC" | "UPC"; artistId?: string; releaseId?: string };
    const code = body.type === "UPC" ? await generateUPC(body) : await generateISRC(body);
    return NextResponse.json({ code });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Code generation failed.";
    const status = /login|required|access/i.test(message) ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
