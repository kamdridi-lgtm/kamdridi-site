import crypto from "crypto";

const GAME_ACCESS_COOKIE_NAME = "kamdridi_game_access";

type GameAccessPayload = {
  games: string[];
  issuedAt: number;
};

function getSecret() {
  return process.env.GAME_ACCESS_SECRET || "dev-game-access-secret-change-me";
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

export function createGameAccessToken(games: string[]) {
  const payload: GameAccessPayload = {
    games: [...new Set(games)].filter(Boolean),
    issuedAt: Date.now()
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString("base64url");
  const signature = sign(encodedPayload);
  return `${encodedPayload}.${signature}`;
}

export function verifyGameAccessToken(token: string | undefined | null) {
  if (!token) {
    return [];
  }

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature || sign(encodedPayload) !== signature) {
    return [];
  }

  try {
    const payload = JSON.parse(Buffer.from(encodedPayload, "base64url").toString("utf8")) as GameAccessPayload;
    return Array.isArray(payload.games) ? payload.games.filter((value) => typeof value === "string") : [];
  } catch {
    return [];
  }
}

export function hasGameAccess(token: string | undefined | null, gameId: string) {
  return verifyGameAccessToken(token).includes(gameId);
}

export const gameAccessCookie = {
  name: GAME_ACCESS_COOKIE_NAME,
  options: {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: shouldUseSecureCookies(),
    path: "/",
    maxAge: 60 * 60 * 24 * 30
  }
};

export function getGameAccessCookieOptions(requestUrl?: string) {
  return {
    ...gameAccessCookie.options,
    secure: requestUrl ? requestUrl.startsWith("https://") : gameAccessCookie.options.secure
  };
}
