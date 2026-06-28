import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type GeneratedCode = {
  id: string;
  type: "ISRC" | "UPC";
  value: string;
  artistId?: string;
  releaseId?: string;
  createdAt: string;
};

function now() {
  return new Date().toISOString();
}

async function listCodes() {
  return readLabelJson<GeneratedCode[]>("generated-codes.json", []);
}

async function saveCodes(codes: GeneratedCode[]) {
  await writeLabelJson("generated-codes.json", codes);
}

function upcCheckDigit(firstTwelve: string) {
  const sum = firstTwelve
    .split("")
    .map(Number)
    .reduce((total, digit, index) => total + digit * (index % 2 === 0 ? 1 : 3), 0);
  return String((10 - (sum % 10)) % 10);
}

export async function generateISRC(input: { artistId?: string; releaseId?: string; registrantCode?: string; year?: number }) {
  const codes = await listCodes();
  const year = String(input.year ?? new Date().getFullYear()).slice(-2);
  const registrant = (input.registrantCode || process.env.LABEL_ISRC_REGISTRANT || "KDR").toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 3).padEnd(3, "X");
  const prefix = `CA-${registrant}-${year}`;
  const sequence = codes.filter((code) => code.type === "ISRC" && code.value.startsWith(prefix)).length + 1;
  const value = `${prefix}-${String(sequence).padStart(5, "0")}`;
  if (codes.some((code) => code.value === value)) throw new Error("Generated ISRC collision.");
  const record: GeneratedCode = {
    id: `code_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: "ISRC",
    value,
    artistId: input.artistId,
    releaseId: input.releaseId,
    createdAt: now()
  };
  codes.unshift(record);
  await saveCodes(codes);
  return record;
}

export async function generateUPC(input: { artistId?: string; releaseId?: string; prefix?: string }) {
  const codes = await listCodes();
  const prefix = (input.prefix || process.env.LABEL_UPC_PREFIX || "628011").replace(/\D/g, "").slice(0, 6).padEnd(6, "0");
  const sequence = String(codes.filter((code) => code.type === "UPC").length + 1).padStart(6, "0");
  const firstTwelve = `${prefix}${sequence}`.slice(0, 12);
  const value = `${firstTwelve}${upcCheckDigit(firstTwelve)}`;
  if (codes.some((code) => code.value === value)) throw new Error("Generated UPC collision.");
  const record: GeneratedCode = {
    id: `code_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    type: "UPC",
    value,
    artistId: input.artistId,
    releaseId: input.releaseId,
    createdAt: now()
  };
  codes.unshift(record);
  await saveCodes(codes);
  return record;
}

export async function exportCodesCsv() {
  const codes = await listCodes();
  return [
    "type,value,artistId,releaseId,createdAt",
    ...codes.map((code) => [code.type, code.value, code.artistId || "", code.releaseId || "", code.createdAt].map((cell) => `"${cell}"`).join(","))
  ].join("\n");
}
