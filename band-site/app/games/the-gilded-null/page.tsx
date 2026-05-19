import type { Metadata } from "next";
import Link from "next/link";
import { CTAButton, Section } from "@/components/ui";

export const metadata: Metadata = {
  title: "The Gilded Null",
  description:
    "Play The Gilded Null inside the KAMDRIDI games protocol."
};

export default function TheGildedNullPage() {
  const iframeSrc = "/play/the-gilded-null/index.html";

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
              The playable browser build is now hosted directly on kamdridi.com as a Canvas 2D
              corridor protocol.
            </p>
            <div className="mt-8 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
              <span className="rounded-full border border-[#f4c66a]/40 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
                Playable Build Live
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                Canvas 2D
              </span>
              <span className="rounded-full border border-white/10 px-4 py-2 text-white">
                Web Audio
              </span>
            </div>
            <div className="mt-8 flex flex-wrap gap-4">
              <CTAButton href="/games" tone="secondary">
                Back To Games
              </CTAButton>
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
            The Gilded Null playable web build loaded from kamdridi.com
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

        <div className="mt-8 text-sm leading-7 text-stone-500">
          Explore the full universe from <Link href="/games" className="text-[#f4c66a] transition hover:text-[#ffd989]">Games</Link>,{" "}
          <Link href="/fan-club#membership" className="text-[#f4c66a] transition hover:text-[#ffd989]">Fan Club</Link>, or{" "}
          <Link href="/visual-album#featured-sequence" className="text-[#f4c66a] transition hover:text-[#ffd989]">Visual Album</Link>.
        </div>
      </Section>
    </>
  );
}
