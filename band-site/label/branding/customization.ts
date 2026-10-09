import { readLabelJson, writeLabelJson } from "@/label/core/json_store";

export type LabelBranding = {
  logoUrl: string;
  primary: string;
  secondary: string;
  publicHeadline: string;
  emailFooter: string;
  updatedAt: string;
};

export const defaultBranding: LabelBranding = {
  logoUrl: "/assets/images/kamdridi-logo.png",
  primary: "#f4c66a",
  secondary: "#ff4b38",
  publicHeadline: "KAMDRIDI RECORDS",
  emailFooter: "KAMDRIDI RECORDS - Echoes Unearthed Universe",
  updatedAt: new Date(0).toISOString()
};

export async function getLabelBranding() {
  return readLabelJson<LabelBranding>("branding.json", defaultBranding);
}

export async function updateLabelBranding(patch: Partial<LabelBranding>) {
  const current = await getLabelBranding();
  const next = { ...current, ...patch, updatedAt: new Date().toISOString() };
  await writeLabelJson("branding.json", next);
  return next;
}

export function getBrandingCss(branding: LabelBranding) {
  return `:root{--label-primary:${branding.primary};--label-secondary:${branding.secondary};}`;
}
