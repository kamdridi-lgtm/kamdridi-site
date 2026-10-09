import crypto from "crypto";
import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type ActivityLog = {
  id: string;
  actor: string;
  action: string;
  target: string;
  ipHash: string;
  createdAt: string;
};

export async function logLabelActivity(input: { actor: string; action: string; target: string; ip?: string }) {
  const logs = await readLabelJson<ActivityLog[]>("activity-log.json", []);
  const record: ActivityLog = {
    id: `act_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    actor: input.actor,
    action: input.action,
    target: input.target,
    ipHash: crypto.createHash("sha256").update(input.ip || "unknown").digest("hex"),
    createdAt: new Date().toISOString()
  };
  logs.unshift(record);
  await writeLabelJson("activity-log.json", logs.slice(0, 1000));
  return record;
}

export function encryptSensitiveValue(value: string, secret = process.env.LABEL_ENCRYPTION_SECRET || "kamdridi-simulation-secret") {
  const key = crypto.createHash("sha256").update(secret).digest();
  const iv = crypto.randomBytes(12);
  const cipher = crypto.createCipheriv("aes-256-gcm", key, iv);
  const encrypted = Buffer.concat([cipher.update(value, "utf8"), cipher.final()]);
  const tag = cipher.getAuthTag();
  return `${iv.toString("hex")}:${tag.toString("hex")}:${encrypted.toString("hex")}`;
}

export function decryptSensitiveValue(payload: string, secret = process.env.LABEL_ENCRYPTION_SECRET || "kamdridi-simulation-secret") {
  const [ivHex, tagHex, encryptedHex] = payload.split(":");
  const key = crypto.createHash("sha256").update(secret).digest();
  const decipher = crypto.createDecipheriv("aes-256-gcm", key, Buffer.from(ivHex, "hex"));
  decipher.setAuthTag(Buffer.from(tagHex, "hex"));
  return Buffer.concat([decipher.update(Buffer.from(encryptedHex, "hex")), decipher.final()]).toString("utf8");
}

export async function checkRateLimit(key: string, limit = 100, windowMs = 60 * 60 * 1000) {
  const entries = await readLabelJson<Array<{ key: string; ts: number }>>("rate-limit.json", []);
  const now = Date.now();
  const active = entries.filter((entry) => now - entry.ts < windowMs);
  const count = active.filter((entry) => entry.key === key).length;
  if (count >= limit) return { allowed: false, remaining: 0 };
  active.push({ key, ts: now });
  await writeLabelJson("rate-limit.json", active);
  return { allowed: true, remaining: limit - count - 1 };
}

export async function createDailyBackupSnapshot() {
  const files = ["stream-stats.json", "generated-codes.json", "payout-history.json", "signed-contracts.json", "messages.json", "activity-log.json"];
  const snapshot: Record<string, unknown> = {};
  for (const file of files) snapshot[file] = await readLabelJson(file, []);
  const name = `backup-${new Date().toISOString().slice(0, 10)}.json`;
  await writeLabelJson(name, snapshot);
  return { name, files: files.length, createdAt: new Date().toISOString() };
}

export function verifyRecaptchaSimulation(token?: string) {
  if (process.env.LABEL_RECAPTCHA_MODE === "production") return Boolean(token && token.length > 20);
  return true;
}

export function requireAdmin2FA(code?: string) {
  if (process.env.LABEL_2FA_MODE !== "production") return true;
  return Boolean(code && code === process.env.LABEL_ADMIN_2FA_CODE);
}
