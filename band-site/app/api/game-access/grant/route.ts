import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import {
  createGameAccessToken,
  gameAccessCookie,
  getGameAccessCookieOptions,
  verifyGameAccessToken
} from "@/lib/game-access";

const PRODUCT_UNLOCKS: Record<string, string[]> = {
  "the-gilded-null-license": ["the-gilded-null"],
  "vault-sequence-license": ["vault-sequence"]
};

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const productIds = Array.isArray(body?.productIds) ? (body.productIds as string[]) : [];
  const unlockedGames = productIds.flatMap((productId: string) => PRODUCT_UNLOCKS[productId] ?? []);

  if (!unlockedGames.length) {
    return NextResponse.json({ error: "No supported game access found." }, { status: 400 });
  }

  const cookieStore = await cookies();
  const existing = verifyGameAccessToken(cookieStore.get(gameAccessCookie.name)?.value);
  const token = createGameAccessToken([...existing, ...unlockedGames]);
  const response = NextResponse.json({ ok: true, unlockedGames: [...new Set(unlockedGames)] });
  response.cookies.set(gameAccessCookie.name, token, getGameAccessCookieOptions(request.url));
  return response;
}
