import { NextResponse } from "next/server";
import { createAgentTaskFromPayload } from "@/lib/agents/system";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const task = await createAgentTaskFromPayload(payload);
    return NextResponse.json({ ok: true, task });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to create agent task." },
      { status: 500 }
    );
  }
}
