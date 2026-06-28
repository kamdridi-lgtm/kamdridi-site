import { NextResponse } from "next/server";
import { requireLabelSession } from "@/lib/label-auth";
import { getLabelApplication } from "@/lib/label-storage";
import { buildRoyaltyReport, exportRoyaltyCsv, exportRoyaltyPdfText } from "@/label/analytics/advanced_stats";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: Request, { params }: { params: Promise<{ artistId: string }> }) {
  try {
    const session = await requireLabelSession();
    const { artistId } = await params;
    const artist = await getLabelApplication(artistId);
    const isAdmin = (process.env.LABEL_ADMIN_EMAILS || "contact@kamdridi.com").toLowerCase().split(",").includes(session.email.toLowerCase());
    if (!artist || (!isAdmin && artist.email.toLowerCase() !== session.email.toLowerCase())) {
      return NextResponse.json({ error: "Access denied." }, { status: 403 });
    }
    const report = await buildRoyaltyReport(artistId);
    const format = new URL(request.url).searchParams.get("format");
    if (format === "csv") {
      return new Response(exportRoyaltyCsv(report), {
        headers: {
          "Content-Type": "text/csv; charset=utf-8",
          "Content-Disposition": `attachment; filename="${artist.artistName}-royalties.csv"`
        }
      });
    }
    if (format === "pdf") {
      return new Response(exportRoyaltyPdfText(report), {
        headers: {
          "Content-Type": "application/pdf",
          "Content-Disposition": `attachment; filename="${artist.artistName}-royalties.pdf"`
        }
      });
    }
    return NextResponse.json({ report });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : "Analytics failed." }, { status: 500 });
  }
}
