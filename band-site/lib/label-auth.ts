import { cookies } from "next/headers";
import { sessionCookie, verifySessionToken } from "@/lib/session";
import { siteMeta } from "@/data/site";

export async function getLabelSession() {
  const cookieStore = await cookies();
  return verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
}

export async function requireLabelSession() {
  const session = await getLabelSession();
  if (!session) throw new Error("Login required.");
  return session;
}

export async function requireLabelAdmin() {
  const session = await requireLabelSession();
  const configured = (process.env.LABEL_ADMIN_EMAILS || siteMeta.email)
    .split(",")
    .map((email) => email.trim().toLowerCase())
    .filter(Boolean);

  if (!configured.includes(session.email.toLowerCase())) {
    throw new Error("Label admin access required.");
  }
  return session;
}
