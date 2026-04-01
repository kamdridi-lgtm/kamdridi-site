import { NextResponse } from "next/server";
import { resetAgent } from "@/lib/agents/system";

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const agentId = String(payload.agent_id || "").trim();

    if (!agentId) {
      return NextResponse.json({ ok: false, error: "agent_id is required" }, { status: 400 });
    }

    const requeuedTasks = await resetAgent(agentId);
    return NextResponse.json({
      ok: true,
      agent_id: agentId,
      requeued_tasks: requeuedTasks
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to restart agent." },
      { status: 500 }
    );
  }
}
