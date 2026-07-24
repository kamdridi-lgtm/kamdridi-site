import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createSessionToken, getSessionCookieOptions, sessionCookie } from "@/lib/session";
import { siteMeta } from "@/data/site";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, password } = body as Record<string, string>;

    if (!email || !password) {
      return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
    }

    // Default to the siteMeta email if not configured in env
    const adminEmails = (process.env.LABEL_ADMIN_EMAILS || siteMeta.email)
      .split(",")
      .map((e) => e.trim().toLowerCase())
      .filter(Boolean);

    const masterPassword = process.env.LABEL_ADMIN_PASSWORD || "kamdridi2026"; // Fallback password for testing

    if (!adminEmails.includes(email.toLowerCase()) || password !== masterPassword) {
      return NextResponse.json({ error: "Invalid admin credentials." }, { status: 401 });
    }

    // Generate secure session token using the same system as the Fan Club 
    // (so the same auth abstraction works universally)
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      createSessionToken({ name: "Admin", email: email.toLowerCase() }),
      getSessionCookieOptions(request.url)
    );

    return NextResponse.json({
      message: "Login successful.",
    });
  } catch (error) {
    console.error("[Admin Login API] Error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
