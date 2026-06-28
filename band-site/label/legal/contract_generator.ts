import type { LabelApplication } from "@/lib/label-storage";

function esc(value: string) {
  return value.replace(/[()\\]/g, "\\$&");
}

export function generateContractText(app: LabelApplication) {
  return [
    "KAMDRIDI RECORDS - ARTIST AGREEMENT",
    "",
    `Artist name: ${app.artistName}`,
    `Legal name: ${app.legalName}`,
    `Email: ${app.email}`,
    "",
    "Agreement summary:",
    "The artist grants KAMDRIDI RECORDS the right to review, package, promote, and distribute approved submitted recordings.",
    `Revenue split: ${app.revenueSplitArtist}% Artist / ${app.revenueSplitLabel}% Label.`,
    "Term: 24 months from signature date unless replaced by a signed long-form agreement.",
    "Artist keeps authorship ownership unless a separate written agreement says otherwise.",
    "Label accounting is tracked in the KAMDRIDI RECORDS dashboard.",
    "",
    `Digital acceptance: ${app.contractAccepted ? "Accepted" : "Not accepted"}`,
    `Generated: ${new Date().toISOString()}`
  ].join("\n");
}

export function generateContractPdfBuffer(app: LabelApplication) {
  const lines = generateContractText(app).split("\n");
  const textOps = lines
    .map((line, index) => `BT /F1 10 Tf 52 ${760 - index * 18} Td (${esc(line)}) Tj ET`)
    .join("\n");

  const objects = [
    "1 0 obj << /Type /Catalog /Pages 2 0 R >> endobj",
    "2 0 obj << /Type /Pages /Kids [3 0 R] /Count 1 >> endobj",
    "3 0 obj << /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Resources << /Font << /F1 4 0 R >> >> /Contents 5 0 R >> endobj",
    "4 0 obj << /Type /Font /Subtype /Type1 /BaseFont /Helvetica >> endobj",
    `5 0 obj << /Length ${Buffer.byteLength(textOps)} >> stream\n${textOps}\nendstream endobj`
  ];

  let body = "%PDF-1.4\n";
  const offsets = [0];
  for (const obj of objects) {
    offsets.push(Buffer.byteLength(body));
    body += `${obj}\n`;
  }
  const xrefStart = Buffer.byteLength(body);
  body += `xref\n0 ${objects.length + 1}\n0000000000 65535 f \n`;
  for (let i = 1; i <= objects.length; i += 1) {
    body += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }
  body += `trailer << /Size ${objects.length + 1} /Root 1 0 R >>\nstartxref\n${xrefStart}\n%%EOF`;
  return Buffer.from(body, "utf8");
}
