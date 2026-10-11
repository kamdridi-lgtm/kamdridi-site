import { promises as fs } from "fs";
import path from "path";

const dataDir = path.join(process.cwd(), "data", "label");

function supabaseConfig() {
  const url = (process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "").replace(/\/$/, "");
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";
  return url && key ? { url, key } : null;
}

async function supabaseRead<T>(fileName: string, fallback: T): Promise<T> {
  const cfg = supabaseConfig();
  if (!cfg) return fallback;
  const response = await fetch(`${cfg.url}/rest/v1/label_kv_store?key=eq.${encodeURIComponent(fileName)}&select=value&limit=1`, {
    headers: { apikey: cfg.key, Authorization: `Bearer ${cfg.key}` },
    cache: "no-store"
  });
  if (!response.ok) throw new Error(`Label storage read failed (${response.status}).`);
  const rows = (await response.json()) as Array<{ value: T }>;
  return rows[0]?.value ?? fallback;
}

async function supabaseWrite<T>(fileName: string, value: T) {
  const cfg = supabaseConfig();
  if (!cfg) throw new Error("Persistent label storage is not configured.");
  const response = await fetch(`${cfg.url}/rest/v1/label_kv_store?on_conflict=key`, {
    method: "POST",
    headers: {
      apikey: cfg.key,
      Authorization: `Bearer ${cfg.key}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates,return=minimal"
    },
    body: JSON.stringify({ key: fileName, value, updated_at: new Date().toISOString() })
  });
  if (!response.ok) throw new Error(`Label storage write failed (${response.status}).`);
}

export async function readLabelJson<T>(fileName: string, fallback: T): Promise<T> {
  if (supabaseConfig()) return supabaseRead(fileName, fallback);
  if (process.env.VERCEL === "1") return fallback;
  try {
    return JSON.parse(await fs.readFile(path.join(dataDir, fileName), "utf8")) as T;
  } catch {
    return fallback;
  }
}

export async function writeLabelJson<T>(fileName: string, value: T) {
  if (supabaseConfig()) return supabaseWrite(fileName, value);
  if (process.env.VERCEL === "1") throw new Error("Persistent label storage is not configured.");
  await fs.mkdir(dataDir, { recursive: true });
  await fs.writeFile(path.join(dataDir, fileName), JSON.stringify(value, null, 2), "utf8");
}

export function money(cents: number, currency = "CAD") {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency }).format(cents / 100);
}

export function slugify(value: string) {
  return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

export function nowIso() { return new Date().toISOString(); }
