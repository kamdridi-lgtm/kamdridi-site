import crypto from "crypto";

const SESSION_COOKIE_NAME = "kamdridi_fan_session";
const DEVELOPMENT_SESSION_SECRET = "dev-fallback-secret-change-me";

type SessionUser = {
  name: string;
  email: string;
};

function getSecret(): string | null {
  const configuredSecret = process.env.FAN_CLUB_SESSION_SECRET?.trim();
  if (configuredSecret) {
    return configuredSecret;
  }

  // A deterministic fallback is convenient for local development only.
  // Production must fail closed rather than mint or trust sessions with a
  // publicly known key.
  if (process.env.NODE_ENV !== "production") {
    return DEVELOPMENT_SESSION_SECRET;
  }

  return null;
}

function shouldUseSecureCookies() {
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.startsWith("https://");
  }

  return process.env.NODE_ENV === "production" && Boolean(process.env.VERCEL_URL);
}

function sign(value: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(value).digest("hex");
}

function signaturesMatch(value: string, signature: string, secret: string) {
  const expectedSignature = sign(value, secret);
  const expectedBuffer = Buffer.from(expectedSignature);
  const receivedBuffer = Buffer.from(signature);

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function createSessionToken(user: SessionUser) {
  const secret = getSecret();
  if (!secret) {
    throw new Error("FAN_CLUB_SESSION_SECRET must be configured in production");
  }

  const payload = JSON.stringify({
    ...user,
    issuedAt: Date.now()
  });
  const encodedPayload = Buffer.from(payload).toString("base64url");
  const signature = sign(encodedPayload, secret);
  return `${encodedPayload}.${signature}`;
}

export function verifySessionToken(token: string | undefined | null): SessionUser | null {
  if (!token) {
    return null;
  }

  const secret = getSecret();
  if (!secret) {
    return null;
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || !signaturesMatch(encodedPayload, signature, secret)) {
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
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }
};

export function getSessionCookieOptions(requestUrl?: string) {
  return {
    ...sessionCookie.options,
    secure: requestUrl ? requestUrl.startsWith("https://") : sessionCookie.options.secure
  };
}
