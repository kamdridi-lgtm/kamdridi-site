import { NextResponse } from "next/server";
import { storeLabelFile } from "@/lib/label-file-storage";
import { list } from "@vercel/blob";

export async function GET() {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ files: [], message: "No BLOB_READ_WRITE_TOKEN found. Cloud library is empty." });
    }
    
    // We prefix with 'label/' because our storeLabelFile uploads to 'label/...'
    const { blobs } = await list({ prefix: "label/" });
    
    // Map blobs to match the format we expect in the frontend
    const files = blobs.map(blob => {
      // Vercel blob object has url, size, pathname, uploadedAt
      const name = blob.pathname.split('/').pop() || "unknown";
      
      let type = "application/octet-stream";
      if (name.match(/\.(jpg|jpeg|png|gif|webp)$/i)) type = "image/jpeg";
      if (name.match(/\.(mp3|wav|ogg|flac|m4a)$/i)) type = "audio/mpeg";
      if (name.match(/\.(mp4|webm|mov)$/i)) type = "video/mp4";

      return {
        name,
        url: blob.url,
        size: blob.size,
        type,
        uploadedAt: blob.uploadedAt
      };
    });
    
    // Sort by most recent first
    files.sort((a, b) => new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime());

    return NextResponse.json({ files });
  } catch (error) {
    console.error("[Media API] Fetch error:", error);
    return NextResponse.json({ error: "Failed to fetch media library" }, { status: 500 });
  }
}

