import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { createFanClubUser } from "@/lib/storage";
import { createSessionToken, sessionCookie } from "@/lib/session";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, email, password } = body as Record<string, string>;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required." }, { status: 400 });
  }

  try {
    const user = await createFanClubUser(name, email, password);
    const cookieStore = await cookies();
    cookieStore.set(
      sessionCookie.name,
      createSessionToken({ name: user.name, email: user.email }),
      sessionCookie.options
    );

    return NextResponse.json({
      message: "Account created successfully.",
      user: { name: user.name, email: user.email }
    });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Signup failed." },
      { status: 400 }
    );
  }
}
