import { createHash, timingSafeEqual } from "crypto";
import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { radioTracks } from "@/lib/radio-catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// This is the SHA-256 digest of a one-time credential kept outside the repository.
// It is removed after the initial radio library upload is complete.
const oneTimeCredentialHash = "920f5e93e9d89d2051aca9fdb23fc3de4c73cc064d96113b4dd91c749e5125d7";
const allowedPathnames = new Set(radioTracks.map((track) => track.pathname));

function isAuthorized(request: Request) {
  const token = request.headers.get("authorization")?.replace(/^Bearer\\s+/i, "") ?? "";
  if (token.length < 48) return false;

  const candidateHash = createHash("sha256").update(token).digest("hex");
  return timingSafeEqual(Buffer.from(candidateHash, "utf8"), Buffer.from(oneTimeCredentialHash, "utf8"));
}

export async function POST(request: Request) {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ error: "Radio storage is not configured." }, { status: 503 });
  }

  try {
    const body = (await request.json()) as HandleUploadBody;

    if (body.type === "blob.generate-client-token" && !isAuthorized(request)) {
      return NextResponse.json({ error: "Unauthorized radio upload." }, { status: 401 });
    }

    const response = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        if (!allowedPathnames.has(pathname)) {
          throw new Error("This radio upload path is not allowed.");
        }

        return {
          allowedContentTypes: ["audio/mpeg"],
          maximumSizeInBytes: 20 * 1024 * 1024,
          validUntil: Date.now() + 15 * 60 * 1000,
          addRandomSuffix: false,
          allowOverwrite: true,
          cacheControlMaxAge: 60
        };
      },
      onUploadCompleted: async () => {
        // The track map is fixed in source; no database write is required.
      }
    });

    return NextResponse.json(response);
  } catch (error) {
    console.error("[Signal Radio] upload failure", error);
    return NextResponse.json({ error: "Radio upload could not be completed." }, { status: 400 });
  }
}
