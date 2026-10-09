import { NextResponse } from "next/server";
import { runOrchestratorCycle } from "@/lib/agents/system";

export async function GET() {
  try {
    return NextResponse.json(await runOrchestratorCycle());
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to run orchestrator cycle." },
      { status: 500 }
    );
  }
}

export async function POST() {
  return GET();
}
