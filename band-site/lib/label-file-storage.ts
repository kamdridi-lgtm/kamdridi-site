import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { put } from "@vercel/blob";
import type { LabelDemoFile } from "@/lib/label-storage";

export type LabelFileFolder = "demos" | "masters" | "covers" | "contracts" | "attachments";

function sanitizeName(name: string) {
  const parsed = path.parse(name || "upload.bin");
  const base = parsed.name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "")
    .slice(0, 80);
  const ext = parsed.ext.toLowerCase().replace(/[^.a-z0-9]/g, "") || ".bin";
  return `${base || "upload"}${ext}`;
}

function makeKey(folder: LabelFileFolder, fileName: string) {
  const date = new Date().toISOString().slice(0, 10);
  return `label/${folder}/${date}/${crypto.randomBytes(6).toString("hex")}-${sanitizeName(fileName)}`;
}

export async function storeLabelFile(file: File | null, folder: LabelFileFolder): Promise<LabelDemoFile | null> {
  if (!file || !file.name || file.size <= 0) return null;
  const key = makeKey(folder, file.name);
  const base = {
    name: file.name,
    type: file.type || "application/octet-stream",
    size: file.size,
    storageKey: key
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const buffer = Buffer.from(await file.arrayBuffer());
    const blob = await put(key, buffer, {
      access: "public",
      contentType: file.type || "application/octet-stream",
      addRandomSuffix: false
    });
    return { ...base, url: blob.url, storageMode: "blob" };
  }

  if (process.env.VERCEL !== "1") {
    const target = path.join(process.cwd(), "public", "uploads", key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, Buffer.from(await file.arrayBuffer()));
    return { ...base, url: `/uploads/${key}`, storageMode: "local" };
  }

  return { ...base, url: `simulation://${key}`, storageMode: "simulation" };
}

export async function storeGeneratedLabelFile(input: {
  fileName: string;
  contentType: string;
  body: Buffer | string;
  folder: LabelFileFolder;
}): Promise<LabelDemoFile> {
  const key = makeKey(input.folder, input.fileName);
  const body = typeof input.body === "string" ? Buffer.from(input.body, "utf8") : input.body;
  const base = {
    name: input.fileName,
    type: input.contentType,
    size: body.length,
    storageKey: key
  };

  if (process.env.BLOB_READ_WRITE_TOKEN) {
    const blob = await put(key, body, {
      access: "public",
      contentType: input.contentType,
      addRandomSuffix: false
    });
    return { ...base, url: blob.url, storageMode: "blob" };
  }

  if (process.env.VERCEL !== "1") {
    const target = path.join(process.cwd(), "public", "uploads", key);
    await fs.mkdir(path.dirname(target), { recursive: true });
    await fs.writeFile(target, body);
    return { ...base, url: `/uploads/${key}`, storageMode: "local" };
  }

  return { ...base, url: `simulation://${key}`, storageMode: "simulation" };
}
