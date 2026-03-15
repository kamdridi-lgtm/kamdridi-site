import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { sessionCookie, verifySessionToken } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);

  return NextResponse.json({ user: session });
}

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete(sessionCookie.name);
  return NextResponse.json({ ok: true });
}
