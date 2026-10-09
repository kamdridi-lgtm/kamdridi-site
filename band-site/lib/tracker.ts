import { neon } from "@neondatabase/serverless";

function getDb() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) return null;
  return neon(url);
}

export async function logVisit(ip: string, country: string, city: string, path: string) {
  const sql = getDb();
  if (!sql) return;
  try {
    await sql`
      CREATE TABLE IF NOT EXISTS site_visits (
        id SERIAL PRIMARY KEY,
        ip VARCHAR(255),
        country VARCHAR(100),
        city VARCHAR(100),
        path VARCHAR(255),
        visited_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await sql`INSERT INTO site_visits (ip, country, city, path) VALUES (${ip}, ${country}, ${city}, ${path})`;
  } catch (e) {
    console.error("Failed to log visit:", e);
  }
}

export async function getDemographics() {
  const sql = getDb();
  if (!sql) return { countries: [], recent: [], total: 0 };
  try {
    const countries = await sql`
      SELECT country, COUNT(*) as count 
      FROM site_visits 
      GROUP BY country 
      ORDER BY count DESC 
      LIMIT 10
    `;
    const recent = await sql`
      SELECT ip, country, city, path, visited_at 
      FROM site_visits 
      ORDER BY visited_at DESC 
      LIMIT 20
    `;
    const totalRes = await sql`SELECT COUNT(*) as total FROM site_visits`;
    return {
      countries: countries as any[],
      recent: recent as any[],
      total: Number(totalRes[0]?.total || 0)
    };
  } catch (e) {
    console.error("Failed to get demographics:", e);
    return { countries: [], recent: [], total: 0 };
  }
}
