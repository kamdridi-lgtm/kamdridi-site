import type { Metadata } from "next";
import Link from "next/link";
import { cookies } from "next/headers";
import { CTAButton, Section } from "@/components/ui";
import { gameAccessCookie, hasGameAccess } from "@/lib/game-access";
import { sessionCookie, verifySessionToken } from "@/lib/session";

export const metadata: Metadata = {
  title: "The Gilded Null",
  description:
    "Preview or unlock The Gilded Null inside the KAMDRIDI games protocol."
};

export const dynamic = "force-dynamic";

export default async function TheGildedNullPage() {
  const cookieStore = await cookies();
  const fan = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  const purchased = hasGameAccess(
    cookieStore.get(gameAccessCookie.name)?.value,
    "the-gilded-null"
  );
  const hasFullAccess = Boolean(fan) || purchased;
  const iframeSrc = `/api/games/the-gilded-null?mode=${hasFullAccess ? "full" : "preview"}`;

  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <Section className="py-14 md:py-18">
          <div className="mx-auto max-w-5xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
              Corridor Protocol
            </p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              The Gilded Null
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
              Public visitors get a time-limited preview. Fan Club members and players who buy the
              game unlock the full browser build.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
              <span className="rounded-full border border-[#f4c66a]/40 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
                {hasFullAccess ? "Full Access Active" : "Preview Mode"}
              </span>
              {fan ? (
                <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                  Fan Club Session
                </span>
              ) : null}
              {purchased ? (
                <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                  Purchased License
                </span>
              ) : null}
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              {!hasFullAccess ? <CTAButton href="/fan-club#membership">Unlock Via Fan Club</CTAButton> : null}
              {!hasFullAccess ? (
                <CTAButton href="/store#the-gilded-null-license" tone="secondary">
                  Buy The License
                </CTAButton>
              ) : (
                <CTAButton href="/games" tone="secondary">
                  Back To Games
                </CTAButton>
              )}
              <CTAButton href="/visual-album#featured-sequence" tone="secondary">
                View Visual Album
              </CTAButton>
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <div className="overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.35em] text-stone-400">
            {hasFullAccess
              ? "Full protocol build loaded from the current local install"
              : "Preview build loaded from the current local install"}
          </div>
          <div className="relative aspect-[16/10] w-full bg-black">
            <iframe
              src={iframeSrc}
              title="The Gilded Null"
              className="absolute inset-0 h-full w-full border-0"
              allow="fullscreen"
            />
          </div>
        </div>

        {!hasFullAccess ? (
          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Public Preview</p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                This route gives a clean preview of the new build before the lock screen appears.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Fan Club</p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Any active fan account can open the full version directly from this page.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Game Purchase</p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Buying the protocol license from the store unlocks the full build in this browser after checkout.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 text-sm leading-7 text-stone-500">
          Need a different access route? Go to <Link href="/fan-club#membership" className="text-[#f4c66a] transition hover:text-[#ffd989]">Fan Club</Link>,{" "}
          <Link href="/store#the-gilded-null-license" className="text-[#f4c66a] transition hover:text-[#ffd989]">Store</Link>, or{" "}
          <Link href="/visual-album#featured-sequence" className="text-[#f4c66a] transition hover:text-[#ffd989]">Visual Album</Link>.
        </div>
      </Section>
    </>
  );
}
