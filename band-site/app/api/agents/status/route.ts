import { NextResponse } from "next/server";
import { getAgentStatus } from "@/lib/agents/system";

export async function GET() {
  try {
    return NextResponse.json(await getAgentStatus());
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Unable to load agent status." },
      { status: 500 }
    );
  }
}
