import crypto from "crypto";
import type { LabelApplication } from "@/lib/label-storage";
import { readLabelJson, writeLabelJson } from "@/label/core/json_store";
import { storeGeneratedLabelFile } from "@/lib/label-file-storage";

export type ContractType = "distribution" | "license_exclusive" | "license_non_exclusive" | "split_sheet" | "nda";

export type ContractTemplate = {
  type: ContractType;
  title: string;
  defaultTermMonths: number;
  territories: string[];
  body: string;
};

export type SignedContract = {
  id: string;
  artistId: string;
  type: ContractType;
  title: string;
  html: string;
  fileUrl?: string;
  storageKey?: string;
  accepted: boolean;
  acceptedAt: string;
  ipHash: string;
  expiresAt: string;
};

export const contractTemplates: Record<ContractType, ContractTemplate> = {
  distribution: {
    type: "distribution",
    title: "KAMDRIDI RECORDS Distribution Agreement",
    defaultTermMonths: 24,
    territories: ["Worldwide"],
    body: "Artist grants KAMDRIDI RECORDS the right to distribute the approved release catalog during the term."
  },
  license_exclusive: {
    type: "license_exclusive",
    title: "Exclusive License Agreement",
    defaultTermMonths: 36,
    territories: ["Worldwide"],
    body: "Artist grants an exclusive license for the listed masters, visuals, and campaign assets."
  },
  license_non_exclusive: {
    type: "license_non_exclusive",
    title: "Non-Exclusive License Agreement",
    defaultTermMonths: 12,
    territories: ["Worldwide"],
    body: "Artist grants a non-exclusive license for selected distribution and promotion channels."
  },
  split_sheet: {
    type: "split_sheet",
    title: "Split Sheet",
    defaultTermMonths: 0,
    territories: ["Worldwide"],
    body: "Contributors confirm master and publishing shares for the named work."
  },
  nda: {
    type: "nda",
    title: "Non-Disclosure Agreement",
    defaultTermMonths: 24,
    territories: ["Worldwide"],
    body: "Parties agree to keep unreleased music, visuals, campaign plans, and financial data confidential."
  }
};

export function renderAdvancedContract(input: {
  artist: LabelApplication;
  type: ContractType;
  artistPct?: number;
  labelPct?: number;
  termMonths?: number;
  territories?: string[];
  contributors?: Array<{ name: string; pct: number }>;
}) {
  const template = contractTemplates[input.type];
  const artistPct = input.artistPct ?? input.artist.revenueSplitArtist;
  const labelPct = input.labelPct ?? input.artist.revenueSplitLabel;
  const termMonths = input.termMonths ?? template.defaultTermMonths;
  const territories = input.territories || template.territories;
  const contributorRows = (input.contributors || [{ name: input.artist.artistName, pct: 100 }])
    .map((contributor) => `<li>${contributor.name}: ${contributor.pct}%</li>`)
    .join("");
  return `
    <html><body>
      <h1>${template.title}</h1>
      <p><strong>Artist:</strong> ${input.artist.artistName} (${input.artist.legalName})</p>
      <p><strong>Email:</strong> ${input.artist.email}</p>
      <p><strong>Territories:</strong> ${territories.join(", ")}</p>
      <p><strong>Term:</strong> ${termMonths ? `${termMonths} months` : "Per release / work"}</p>
      <p><strong>Revenue split:</strong> ${artistPct}% Artist / ${labelPct}% Label after distributor fees.</p>
      <p>${template.body}</p>
      <h2>Contributors</h2><ul>${contributorRows}</ul>
      <p>Digital acceptance is recorded with timestamp and IP hash.</p>
    </body></html>
  `;
}

export async function signAdvancedContract(input: {
  artist: LabelApplication;
  type: ContractType;
  ipAddress: string;
  accepted: boolean;
}) {
  if (!input.accepted) throw new Error("Contract must be accepted before signing.");
  const html = renderAdvancedContract({ artist: input.artist, type: input.type });
  const template = contractTemplates[input.type];
  const acceptedAt = new Date().toISOString();
  const expires = new Date();
  expires.setMonth(expires.getMonth() + template.defaultTermMonths);
  const record: SignedContract = {
    id: `contract_${Date.now()}_${Math.random().toString(16).slice(2)}`,
    artistId: input.artist.id,
    type: input.type,
    title: template.title,
    html,
    accepted: true,
    acceptedAt,
    ipHash: crypto.createHash("sha256").update(input.ipAddress).digest("hex"),
    expiresAt: expires.toISOString()
  };
  const stored = await storeGeneratedLabelFile({
    fileName: `${input.artist.artistName}-${input.type}-contract.html`,
    contentType: "text/html; charset=utf-8",
    body: html,
    folder: "contracts"
  });
  record.fileUrl = stored.url;
  record.storageKey = stored.storageKey;
  const contracts = await readLabelJson<SignedContract[]>("signed-contracts.json", []);
  contracts.unshift(record);
  await writeLabelJson("signed-contracts.json", contracts);
  return record;
}

export async function listContractRenewalAlerts(days = 30) {
  const contracts = await readLabelJson<SignedContract[]>("signed-contracts.json", []);
  const limit = Date.now() + days * 24 * 60 * 60 * 1000;
  return contracts.filter((contract) => new Date(contract.expiresAt).getTime() <= limit);
}
