import crypto from "crypto";

const SESSION_COOKIE_NAME = "kamdridi_fan_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 30;
const DEVELOPMENT_FALLBACK_SECRET = "dev-only-fallback-secret-change-me";

type SessionUser = {
  name: string;
  email: string;
};

function getSecret() {
  const configuredSecret = process.env.FAN_CLUB_SESSION_SECRET?.trim();
  if (configuredSecret) {
    return configuredSecret;
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error("FAN_CLUB_SESSION_SECRET must be configured in production.");
  }

  return DEVELOPMENT_FALLBACK_SECRET;
}

function shouldUseSecureCookies() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://");
  }

  return process.env.NODE_ENV === "production" && Boolean(process.env.VERCEL_URL);
}

function sign(value: string) {
  return crypto.createHmac("sha256", getSecret()).update(value).digest("hex");
}

function hasValidSignature(encodedPayload: string, signature: string) {
  const expectedSignature = sign(encodedPayload);
  if (signature.length !== expectedSignature.length) {
    return false;
  }

  try {
    return crypto.timingSafeEqual(
      Buffer.from(signature, "hex"),
      Buffer.from(expectedSignature, "hex")
    );
  } catch {
    return false;
  }
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
  if (!encodedPayload || !signature || !hasValidSignature(encodedPayload, signature)) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as {
      name: string;
      email: string;
      issuedAt?: number;
    };

    if (!payload.name || !payload.email || typeof payload.issuedAt !== "number") {
      return null;
    }

    const now = Date.now();
    const maxAgeMs = SESSION_MAX_AGE_SECONDS * 1000;
    if (payload.issuedAt > now || now - payload.issuedAt > maxAgeMs) {
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
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS
  }
};

export function getSessionCookieOptions(requestUrl?: string) {
  return {
    ...sessionCookie.options,
    secure: requestUrl ? requestUrl.startsWith("https://") : sessionCookie.options.secure
  };
}
