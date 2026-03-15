import crypto from "crypto";

const SESSION_COOKIE_NAME = "kamdridi_fan_session";

type SessionUser = {
  name: string;
  email: string;
};

function getSecret() {
  return process.env.FAN_CLUB_SESSION_SECRET || "dev-fallback-secret-change-me";
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

export function createSessionToken(user: SessionUser) {
  const payload = JSON.stringify({
    ...user,
    issuedAt: Date.now()
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      name: string;
      email: string;
    };

    if (!payload.name || !payload.email) {
      return null;
    }

    return {
      name: payload.name,
      email: payload.email
    };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: SESSION_COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }
};
