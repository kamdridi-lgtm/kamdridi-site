import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export type LabelApplicationStatus = "awaiting_payment" | "pending_review" | "signed" | "refused";
export type LabelReleaseStatus =
  | "draft"
  | "submitted"
  | "under_review"
  | "approved"
  | "scheduled"
  | "released"
  | "in_review"
  | "distributed"
  | "live";

export type LabelDemoFile = {
  name: string;
  type: string;
  size: number;
  url?: string;
  storageKey?: string;
  storageMode?: "blob" | "local" | "simulation";
};

export type LabelApplication = {
  id: string;
  artistName: string;
  legalName: string;
  email: string;
  bio: string;
  links: string;
  demos: LabelDemoFile[];
  status: LabelApplicationStatus;
  paymentStatus: "simulated" | "unpaid" | "paid";
  stripeSessionId?: string;
  stripeAccountId?: string;
  contractAccepted: boolean;
  revenueSplitArtist: number;
  revenueSplitLabel: number;
  generatedRoyaltiesCents: number;
  payableRoyaltiesCents: number;
  createdAt: string;
  updatedAt: string;
};

export type LabelRelease = {
  id: string;
  artistId: string;
  title: string;
  isrc: string;
  upc: string;
  releaseDate: string;
  wav: LabelDemoFile;
  cover: LabelDemoFile;
  status: LabelReleaseStatus;
  featuring?: string;
  genre?: string;
  bpm?: number;
  musicalKey?: string;
  qualityReport?: {
    loudnessLufs: number;
    truePeakDb: number;
    passed: boolean;
    notes: string[];
  };
  createdAt: string;
};

const root = process.cwd();
const dataDir = path.join(root, "data");
const applicationsPath = path.join(dataDir, "label-applications.json");
const releasesPath = path.join(dataDir, "label-releases.json");

function now() {
  return new Date().toISOString();
}

function id(prefix: string) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function sqlClient() {
  const url = getDatabaseUrl();
  return url ? neon(url) : null;
}

async function readJson<T>(filePath: string, fallback: T): Promise<T> {
  try {
    return JSON.parse(await fs.readFile(filePath, "utf8")) as T;
  } catch {
    return fallback;
  }
}

async function writeJson<T>(filePath: string, value: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function ensureTables() {
  const sql = sqlClient();
  if (!sql) return;

  await sql`
    CREATE TABLE IF NOT EXISTS label_applications (
      id TEXT PRIMARY KEY,
      artist_name TEXT NOT NULL,
      legal_name TEXT NOT NULL,
      email TEXT NOT NULL,
      bio TEXT NOT NULL,
      links TEXT NOT NULL,
      demos JSONB NOT NULL,
      status TEXT NOT NULL,
      payment_status TEXT NOT NULL,
      stripe_session_id TEXT,
      stripe_account_id TEXT,
      contract_accepted BOOLEAN NOT NULL,
      revenue_split_artist INTEGER NOT NULL,
      revenue_split_label INTEGER NOT NULL,
      generated_royalties_cents INTEGER NOT NULL,
      payable_royalties_cents INTEGER NOT NULL,
      created_at TIMESTAMPTZ NOT NULL,
      updated_at TIMESTAMPTZ NOT NULL
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS label_releases (
      id TEXT PRIMARY KEY,
      artist_id TEXT NOT NULL,
      title TEXT NOT NULL,
      isrc TEXT NOT NULL,
      upc TEXT NOT NULL,
      release_date TEXT NOT NULL,
      wav JSONB NOT NULL,
      cover JSONB NOT NULL,
      status TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL
    );
  `;
}

function mapApplication(row: Record<string, unknown>): LabelApplication {
  return {
    id: String(row.id),
    artistName: String(row.artist_name),
    legalName: String(row.legal_name),
    email: String(row.email),
    bio: String(row.bio),
    links: String(row.links),
    demos: row.demos as LabelDemoFile[],
    status: row.status as LabelApplicationStatus,
    paymentStatus: row.payment_status as LabelApplication["paymentStatus"],
    stripeSessionId: row.stripe_session_id ? String(row.stripe_session_id) : undefined,
    stripeAccountId: row.stripe_account_id ? String(row.stripe_account_id) : undefined,
    contractAccepted: Boolean(row.contract_accepted),
    revenueSplitArtist: Number(row.revenue_split_artist),
    revenueSplitLabel: Number(row.revenue_split_label),
    generatedRoyaltiesCents: Number(row.generated_royalties_cents),
    payableRoyaltiesCents: Number(row.payable_royalties_cents),
    createdAt: String(row.created_at),
    updatedAt: String(row.updated_at)
  };
}

function mapRelease(row: Record<string, unknown>): LabelRelease {
  return {
    id: String(row.id),
    artistId: String(row.artist_id),
    title: String(row.title),
    isrc: String(row.isrc),
    upc: String(row.upc),
    releaseDate: String(row.release_date),
    wav: row.wav as LabelDemoFile,
    cover: row.cover as LabelDemoFile,
    status: row.status as LabelReleaseStatus,
    createdAt: String(row.created_at)
  };
}

export async function listLabelApplications() {
  const sql = sqlClient();
  if (!sql) return readJson<LabelApplication[]>(applicationsPath, []);
  await ensureTables();
  const rows = await sql`SELECT * FROM label_applications ORDER BY created_at DESC`;
  return rows.map((row) => mapApplication(row as Record<string, unknown>));
}

export async function getLabelApplication(idOrEmail: string) {
  const key = idOrEmail.toLowerCase();
  const apps = await listLabelApplications();
  return apps.find((app) => app.id === idOrEmail || app.email.toLowerCase() === key) ?? null;
}

export async function createLabelApplication(input: {
  artistName: string;
  legalName: string;
  email: string;
  bio: string;
  links: string;
  demos: LabelDemoFile[];
  contractAccepted: boolean;
  paymentStatus: LabelApplication["paymentStatus"];
  status: LabelApplicationStatus;
}) {
  const app: LabelApplication = {
    id: id("label_app"),
    artistName: input.artistName,
    legalName: input.legalName,
    email: input.email.toLowerCase(),
    bio: input.bio,
    links: input.links,
    demos: input.demos,
    status: input.status,
    paymentStatus: input.paymentStatus,
    contractAccepted: input.contractAccepted,
    revenueSplitArtist: 70,
    revenueSplitLabel: 30,
    generatedRoyaltiesCents: 0,
    payableRoyaltiesCents: 0,
    createdAt: now(),
    updatedAt: now()
  };

  const sql = sqlClient();
  if (!sql) {
    const apps = await listLabelApplications();
    apps.unshift(app);
    await writeJson(applicationsPath, apps);
    return app;
  }

  await ensureTables();
  await sql`
    INSERT INTO label_applications (
      id, artist_name, legal_name, email, bio, links, demos, status, payment_status,
      contract_accepted, revenue_split_artist, revenue_split_label,
      generated_royalties_cents, payable_royalties_cents, created_at, updated_at
    )
    VALUES (
      ${app.id}, ${app.artistName}, ${app.legalName}, ${app.email}, ${app.bio}, ${app.links},
      ${JSON.stringify(app.demos)}::jsonb, ${app.status}, ${app.paymentStatus},
      ${app.contractAccepted}, ${app.revenueSplitArtist}, ${app.revenueSplitLabel},
      ${app.generatedRoyaltiesCents}, ${app.payableRoyaltiesCents}, ${app.createdAt}, ${app.updatedAt}
    )
  `;
  return app;
}

export async function updateLabelApplication(idValue: string, patch: Partial<LabelApplication>) {
  const current = await getLabelApplication(idValue);
  if (!current) throw new Error("Application not found.");
  const next = { ...current, ...patch, updatedAt: now() };

  const sql = sqlClient();
  if (!sql) {
    const apps = await listLabelApplications();
    await writeJson(
      applicationsPath,
      apps.map((app) => (app.id === idValue ? next : app))
    );
    return next;
  }

  await ensureTables();
  await sql`
    UPDATE label_applications SET
      artist_name=${next.artistName}, legal_name=${next.legalName}, email=${next.email},
      bio=${next.bio}, links=${next.links}, demos=${JSON.stringify(next.demos)}::jsonb,
      status=${next.status}, payment_status=${next.paymentStatus},
      stripe_session_id=${next.stripeSessionId ?? null}, stripe_account_id=${next.stripeAccountId ?? null},
      contract_accepted=${next.contractAccepted}, revenue_split_artist=${next.revenueSplitArtist},
      revenue_split_label=${next.revenueSplitLabel}, generated_royalties_cents=${next.generatedRoyaltiesCents},
      payable_royalties_cents=${next.payableRoyaltiesCents}, updated_at=${next.updatedAt}
    WHERE id=${idValue}
  `;
  return next;
}

export async function listLabelReleases() {
  const sql = sqlClient();
  if (!sql) return readJson<LabelRelease[]>(releasesPath, []);
  await ensureTables();
  const rows = await sql`SELECT * FROM label_releases ORDER BY created_at DESC`;
  return rows.map((row) => mapRelease(row as Record<string, unknown>));
}

export async function createLabelRelease(input: Omit<LabelRelease, "id" | "createdAt" | "status">) {
  const release: LabelRelease = {
    ...input,
    id: id("rel"),
    status: "in_review",
    createdAt: now()
  };

  const sql = sqlClient();
  if (!sql) {
    const releases = await listLabelReleases();
    releases.unshift(release);
    await writeJson(releasesPath, releases);
    return release;
  }

  await ensureTables();
  await sql`
    INSERT INTO label_releases (id, artist_id, title, isrc, upc, release_date, wav, cover, status, created_at)
    VALUES (
      ${release.id}, ${release.artistId}, ${release.title}, ${release.isrc}, ${release.upc},
      ${release.releaseDate}, ${JSON.stringify(release.wav)}::jsonb,
      ${JSON.stringify(release.cover)}::jsonb, ${release.status}, ${release.createdAt}
    )
  `;
  return release;
}

export async function updateLabelRelease(idValue: string, patch: Partial<LabelRelease>) {
  const releases = await listLabelReleases();
  const current = releases.find((release) => release.id === idValue);
  if (!current) throw new Error("Release not found.");
  const next = { ...current, ...patch };

  const sql = sqlClient();
  if (!sql) {
    await writeJson(
      releasesPath,
      releases.map((release) => (release.id === idValue ? next : release))
    );
    return next;
  }

  await ensureTables();
  await sql`
    UPDATE label_releases SET
      title=${next.title}, isrc=${next.isrc}, upc=${next.upc}, release_date=${next.releaseDate},
      wav=${JSON.stringify(next.wav)}::jsonb, cover=${JSON.stringify(next.cover)}::jsonb,
      status=${next.status}
    WHERE id=${idValue}
  `;
  return next;
}
