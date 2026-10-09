import { handleUpload, type HandleUploadBody } from "@vercel/blob/client";
import { NextResponse } from "next/server";
import { requireLabelAdmin } from "@/lib/label-auth";

export async function POST(request: Request): Promise<NextResponse> {
  const body = (await request.json()) as HandleUploadBody;

  try {
    // Only admins can upload files
    await requireLabelAdmin();

    const jsonResponse = await handleUpload({
      body,
      request,
      onBeforeGenerateToken: async (pathname) => {
        // Determine the folder based on file extension
        let folder = "attachments";
        if (pathname.match(/\.(jpg|jpeg|png|gif|webp)$/i)) folder = "covers";
        if (pathname.match(/\.(mp3|wav|ogg|flac|m4a)$/i)) folder = "masters";
        
        // Return allowed configurations
        return {
          allowedContentTypes: [
            "image/jpeg", "image/png", "image/gif", "image/webp",
            "audio/mpeg", "audio/wav", "audio/ogg", "audio/x-m4a",
            "video/mp4", "video/webm", "video/quicktime",
            "application/pdf", "application/zip", "application/octet-stream"
          ],
          tokenPayload: JSON.stringify({
            folder
          }),
        };
      },
      onUploadCompleted: async ({ blob, tokenPayload }) => {
        // We do not need a webhook side effect since we just list() the bucket on demand
        console.log("Client upload completed:", blob.url);
      },
    });

    return NextResponse.json(jsonResponse);
  } catch (error) {
    console.error("[Media Upload API] Error:", error);
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 400 } // Vercel Blob client expects 400 for config errors
    );
  }
}
