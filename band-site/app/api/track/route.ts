import { NextResponse } from "next/server";
import { logVisit } from "@/lib/tracker";

function decodeHeaderValue(value: string | null) {
  if (!value) return "Unknown";
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

export async function POST(req: Request) {
  try {
    const country = req.headers.get("x-vercel-ip-country") || "Unknown";
    const city = decodeHeaderValue(req.headers.get("x-vercel-ip-city"));
    const body = await req.json().catch(() => ({ path: "/" }));
    const rawPath = typeof body.path === "string" ? body.path : "/";
    const path = rawPath.slice(0, 255) || "/";

    // Data minimization: geographic aggregates and visited path are sufficient
    // for the current demographics dashboard. Raw visitor IPs are deliberately
    // not read, transmitted to storage, or retained for new visits.
    await logVisit(country, city, path);
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ ok: false });
  }
}
