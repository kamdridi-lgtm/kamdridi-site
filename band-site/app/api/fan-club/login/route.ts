import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { validateFanClubUser } from "@/lib/storage";
import { createSessionToken, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json();
  const { email, password } = body as Record<string, string>;

  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await validateFanClubUser(email, password);

  if (!user) {
    return NextResponse.json({ error: "Invalid credentials." }, { status: 401 });
  }

  const cookieStore = await cookies();
  cookieStore.set(
    sessionCookie.name,
    createSessionToken({ name: user.name, email: user.email }),
    sessionCookie.options
  );

  return NextResponse.json({
    message: "Login successful.",
    user: { name: user.name, email: user.email }
  });
}
