import { promises as fs } from "fs";
import path from "path";
import crypto from "crypto";
import { neon } from "@neondatabase/serverless";

export type FanClubUser = {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: string;
};

const root = process.cwd();
const fanClubPath = path.join(root, "data", "fan-club-users.json");
const contactPath = path.join(root, "data", "contact-submissions.json");

function getDatabaseUrl() {
  return process.env.DATABASE_URL || process.env.POSTGRES_URL || "";
}

function hasDatabaseConfig() {
  return Boolean(getDatabaseUrl());
}

function getSqlClient() {
  const databaseUrl = getDatabaseUrl();
  if (!databaseUrl) {
    return null;
  }

  return neon(databaseUrl);
}

async function readJsonFile<T>(filePath: string, fallback: T): Promise<T> {
  try {
    const content = await fs.readFile(filePath, "utf8");
    return JSON.parse(content) as T;
  } catch {
    return fallback;
  }
}

async function writeJsonFile<T>(filePath: string, value: T) {
  await fs.mkdir(path.dirname(filePath), { recursive: true });
  await fs.writeFile(filePath, JSON.stringify(value, null, 2), "utf8");
}

async function ensureTables() {
  const sql = getSqlClient();
  if (!sql) {
    return;
  }

  await sql`
    CREATE TABLE IF NOT EXISTS fan_club_users (
      email TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      password_hash TEXT NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;

  await sql`
    CREATE TABLE IF NOT EXISTS contact_submissions (
      id BIGSERIAL PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      subject TEXT NOT NULL,
      message TEXT NOT NULL,
      received_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `;
}

export async function getFanClubUsers() {
  if (!hasDatabaseConfig()) {
    return readJsonFile<FanClubUser[]>(fanClubPath, []);
  }

  const sql = getSqlClient();
  await ensureTables();
  const rows = await sql!`
    SELECT email, name, password_hash, created_at
    FROM fan_club_users
    ORDER BY created_at DESC
  `;

  return rows.map((row) => ({
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    createdAt: String(row.created_at)
  }));
}

export async function createFanClubUser(name: string, email: string, password: string) {
  const normalizedEmail = email.toLowerCase();
  const passwordHash = await hashPassword(password);

  if (!hasDatabaseConfig()) {
    const users = await getFanClubUsers();

    if (users.some((user) => user.email === normalizedEmail)) {
      throw new Error("An account with that email already exists.");
    }

    const nextUser: FanClubUser = {
      name,
      email: normalizedEmail,
      passwordHash,
      createdAt: new Date().toISOString()
    };

    users.push(nextUser);
    await writeJsonFile(fanClubPath, users);
    return nextUser;
  }

  const sql = getSqlClient();
  await ensureTables();
  const existing = await sql!`
    SELECT email FROM fan_club_users WHERE email = ${normalizedEmail} LIMIT 1
  `;

  if (existing.length) {
    throw new Error("An account with that email already exists.");
  }

  const inserted = await sql!`
    INSERT INTO fan_club_users (email, name, password_hash)
    VALUES (${normalizedEmail}, ${name}, ${passwordHash})
    RETURNING email, name, password_hash, created_at
  `;

  const row = inserted[0];
  return {
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    createdAt: String(row.created_at)
  };
}

export async function validateFanClubUser(email: string, password: string) {
  const normalizedEmail = email.toLowerCase();

  if (!hasDatabaseConfig()) {
    const users = await getFanClubUsers();
    const user = users.find((entry) => entry.email === normalizedEmail);
    if (!user) {
      return null;
    }

    const isValid = await verifyPassword(password, user.passwordHash);
    return isValid ? user : null;
  }

  const sql = getSqlClient();
  await ensureTables();
  const rows = await sql!`
    SELECT email, name, password_hash, created_at
    FROM fan_club_users
    WHERE email = ${normalizedEmail}
    LIMIT 1
  `;

  const row = rows[0];
  if (!row) {
    return null;
  }

  const isValid = await verifyPassword(password, String(row.password_hash));
  if (!isValid) {
    return null;
  }

  return {
    email: String(row.email),
    name: String(row.name),
    passwordHash: String(row.password_hash),
    createdAt: String(row.created_at)
  };
}

export async function saveContactSubmission(payload: Record<string, string>) {
  if (!hasDatabaseConfig()) {
    const submissions = await readJsonFile<Record<string, string>[]>(contactPath, []);
    submissions.push({
      ...payload,
      receivedAt: new Date().toISOString()
    });
    await writeJsonFile(contactPath, submissions);
    return;
  }

  const sql = getSqlClient();
  await ensureTables();
  await sql!`
    INSERT INTO contact_submissions (name, email, subject, message)
    VALUES (${payload.name}, ${payload.email}, ${payload.subject}, ${payload.message})
  `;
}

async function scryptAsync(value: string, salt: string) {
  return new Promise<Buffer>((resolve, reject) => {
    crypto.scrypt(value, salt, 64, (error, derivedKey) => {
      if (error) {
        reject(error);
        return;
      }
      resolve(derivedKey as Buffer);
    });
  });
}

export async function hashPassword(value: string) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derived = await scryptAsync(value, salt);
  return `${salt}:${derived.toString("hex")}`;
}

export async function verifyPassword(value: string, storedValue: string) {
  const [salt, originalHash] = storedValue.split(":");
  if (!salt || !originalHash) {
    return false;
  }

  const derived = await scryptAsync(value, salt);
  return crypto.timingSafeEqual(Buffer.from(originalHash, "hex"), derived);
}
