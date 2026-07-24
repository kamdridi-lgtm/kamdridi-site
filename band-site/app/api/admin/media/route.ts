import { NextResponse } from "next/server";
import { storeLabelFile } from "@/lib/label-file-storage";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    // Determine the folder based on file type
    const type = file.type;
    let folder: "demos" | "masters" | "covers" | "contracts" | "attachments" = "attachments";
    if (type.startsWith("image/")) folder = "covers";
    if (type.startsWith("audio/")) folder = "masters";

    // Use the existing label-file-storage logic which handles Vercel Blob 
    // when BLOB_READ_WRITE_TOKEN is present in env.
    const result = await storeLabelFile(file, folder);

    if (!result) {
      return NextResponse.json({ error: "Failed to store file" }, { status: 500 });
    }

    return NextResponse.json({
      success: true,
      url: result.url,
      name: result.name,
      size: result.size,
      storageMode: result.storageMode
    });
  } catch (error) {
    console.error("[Media API] Upload error:", error);
    return NextResponse.json(
      { error: "Internal server error during file upload" },
      { status: 500 }
    );
  }
}
