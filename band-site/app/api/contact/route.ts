import { NextResponse } from "next/server";
import { saveContactSubmission } from "@/lib/storage";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { name, email, subject, message } = body as Record<string, string>;

    if (!name || !email || !subject || !message) {
      return NextResponse.json({ error: "All contact form fields are required." }, { status: 400 });
    }

    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!validEmail.test(email)) {
      return NextResponse.json({ error: "Please enter a valid email address." }, { status: 400 });
    }

    await saveContactSubmission({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subject: subject.trim(),
      message: message.trim()
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit the form." },
      { status: 500 }
    );
  }
}
