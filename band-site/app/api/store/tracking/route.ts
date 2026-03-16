import { NextResponse } from "next/server";
import { getPrintfulTrackingForSession } from "@/lib/printful";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("session_id");

  if (!sessionId) {
    return NextResponse.json({ error: "Missing session_id." }, { status: 400 });
  }

  try {
    const result = await getPrintfulTrackingForSession(sessionId);
    return NextResponse.json(result);
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Tracking lookup failed." },
      { status: 500 }
    );
  }
}
