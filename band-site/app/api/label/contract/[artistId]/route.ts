import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { generateContractPdfBuffer } from "@/label/legal/contract_generator";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(_request: Request, { params }: { params: Promise<{ artistId: string }> }) {
  try {
    const session = await requireLabelSession();
    const { artistId } = await params;
    const app = await getLabelApplication(artistId);
    if (!app) return NextResponse.json({ error: "Artist not found." }, { status: 404 });
    if (app.email !== session.email && !process.env.LABEL_ADMIN_EMAILS?.toLowerCase().includes(session.email.toLowerCase())) {
      return NextResponse.json({ error: "Contract access denied." }, { status: 403 });
    }
    const buffer = generateContractPdfBuffer(app);
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="kamdridi-records-${app.artistName.replace(/[^a-z0-9]/gi, "-").toLowerCase()}-contract.pdf"`
      }
    });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Contract generation failed." }, { status: 500 });
  }
}
