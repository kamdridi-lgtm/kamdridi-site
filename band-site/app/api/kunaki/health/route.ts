import { NextResponse } from "next/server";
import { getKunakiIntegrationStatus } from "@/lib/kunaki";

export const dynamic = "force-dynamic";

export async function GET() {
  const status = getKunakiIntegrationStatus();
  return NextResponse.json({
    ok: true,
    provider: "kunaki",
    credentialsConfigured: status.credentialsConfigured,
    liveOrderSubmissionEnabled: status.liveOrderSubmissionEnabled,
    orderSubmissionPolicy: "manual-release-only",
    endpoint: status.endpoint
  });
}
