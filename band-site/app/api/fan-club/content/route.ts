import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { privateVault } from "@/data/site";
import { sessionCookie, verifySessionToken } from "@/lib/session";

export async function GET() {
  const cookieStore = await cookies();
  const session = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);

  if (!session) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  return NextResponse.json(privateVault);
}
