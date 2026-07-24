import { del } from '@vercel/blob';
import { NextResponse } from 'next/server';
import { requireLabelAdmin } from "@/lib/label-auth";

export async function POST(request: Request) {
  try {
    await requireLabelAdmin();
    
    const { url } = await request.json();
    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 });
    }

    await del(url);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("[Media Delete API] Error:", error);
    return NextResponse.json(
      { error: "Failed to delete file" },
      { status: 500 }
    );
  }
}
