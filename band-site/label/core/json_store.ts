import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data", "label");

export async function readLabelJson<T>(fileName: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, fileName), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeLabelJson<T>(fileName: string, value: T) {
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(value, null, 2), "utf8");
}

export function money(cents: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100);
}

export function slugify(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function nowIso() {
  return new Date().toISOString();
}
