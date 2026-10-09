import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { cookies } from "next/headers";
import { CTAButton, Section } from "@/components/ui";
import { gameAccessCookie, hasGameAccess } from "@/lib/game-access";
import { sessionCookie, verifySessionToken } from "@/lib/session";

export const metadata: Metadata = {
  title: "Vault Sequence",
  description:
    "Preview or unlock Vault Sequence, the Chapter II game protocol inside the KAMDRIDI universe."
};

export const dynamic = "force-dynamic";

export default async function VaultSequencePage() {
  const cookieStore = await cookies();
  const fan = verifySessionToken(cookieStore.get(sessionCookie.name)?.value);
  const purchased = hasGameAccess(cookieStore.get(gameAccessCookie.name)?.value, "vault-sequence");
  const hasFullAccess = Boolean(fan) || purchased;
  const iframeSrc = `/api/games/vault-sequence?mode=${hasFullAccess ? "full" : "preview"}`;

  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <Section className="py-14 md:py-18">
          <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.82fr_1.18fr] lg:items-center">
            <div className="relative min-h-[520px] overflow-hidden rounded-[34px] border border-[#f4c66a]/20 bg-black shadow-[0_35px_90px_rgba(0,0,0,0.45)]">
              <Image
                src="/assets/images/games/vault-sequence-poster.png"
                alt="Vault Sequence poster"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.38))]" />
            </div>

            <div>
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                Vault Sequence
              </p>
              <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
                The Gilded Null Part II
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
                Chapter II opens the archive corridor: 10 memory fragments, Monster System pressure,
                and a deeper run through the Echoes Unearthed game layer.
              </p>
              <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
                <span className="rounded-full border border-[#f4c66a]/40 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
                  {hasFullAccess ? "Full Access Active" : "Preview Mode"}
                </span>
                <span className="rounded-full border border-white/10 px-4 py-2">10 Memory Fragments</span>
                <span className="rounded-full border border-white/10 px-4 py-2">Monster System</span>
                {fan ? (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                    Fan Club Session
                  </span>
                ) : null}
                {purchased ? (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                    Chapter II Purchased
                  </span>
                ) : null}
              </div>
              <div className="mt-8 flex flex-wrap gap-4">
                {!hasFullAccess ? <CTAButton href="/fan-club#membership">Unlock Via Fan Club</CTAButton> : null}
                {!hasFullAccess ? (
                  <CTAButton href="/store#vault-sequence-license" tone="secondary">
                    Buy Chapter II
                  </CTAButton>
                ) : (
                  <CTAButton href="/games" tone="secondary">
                    Back To Games
                  </CTAButton>
                )}
                <CTAButton href="/visual-album#scene-archive" tone="secondary">
                  View Visual Album
                </CTAButton>
              </div>
            </div>
          </div>
        </Section>
      </section>

      <Section>
        <div className="overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-black shadow-[0_30px_90px_rgba(0,0,0,0.45)]">
          <div className="border-b border-white/10 px-6 py-4 text-xs uppercase tracking-[0.35em] text-stone-400">
            {hasFullAccess
              ? "Full chapter build loaded from the current local install"
              : "Preview chapter build loaded from the current local install"}
          </div>
          <div className="relative aspect-[16/10] w-full bg-black">
            <iframe
              src={iframeSrc}
              title="Vault Sequence"
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
                Open the new Chapter II build in preview mode before the lock screen takes over.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Fan Club</p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Fan Club access opens the full Vault Sequence build directly from this page.
              </p>
            </div>
            <div className="rounded-[24px] border border-white/10 bg-black/30 p-5">
              <p className="text-xs uppercase tracking-[0.32em] text-[#f4c66a]">Chapter II License</p>
              <p className="mt-3 text-sm leading-7 text-stone-400">
                Buying the Chapter II license from the store unlocks this game in the current browser after checkout.
              </p>
            </div>
          </div>
        ) : null}

        <div className="mt-8 text-sm leading-7 text-stone-500">
          Need a different access route? Go to{" "}
          <Link href="/fan-club#membership" className="text-[#f4c66a] transition hover:text-[#ffd989]">
            Fan Club
          </Link>{" "}
          or{" "}
          <Link href="/store#vault-sequence-license" className="text-[#f4c66a] transition hover:text-[#ffd989]">
            Store
          </Link>, or{" "}
          <Link href="/visual-album#scene-archive" className="text-[#f4c66a] transition hover:text-[#ffd989]">
            Visual Album
          </Link>.
        </div>
      </Section>
    </>
  );
}
