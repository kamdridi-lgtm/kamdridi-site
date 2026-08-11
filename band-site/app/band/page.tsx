import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { bandBio } from "@/data/site";

export const metadata: Metadata = {
  title: "KAM DRIDI — Artist Biography & Live Project",
  description:
    "Official KAM DRIDI artist biography, creative identity, live direction, music links, booking, press, and licensing information."
};

export default function BandPage() {
  return (
    <>
      <PageHero
        eyebrow="Artist"
        title="KAM DRIDI"
        description="The official artist story behind Echoes Unearthed, War Machines, the live project, and the wider cinematic universe."
        image="/assets/images/band/live_stage.jpg"
      />

      <Section id="biography">
        <SectionHeading
          eyebrow="Artist Biography"
          title="Built for records, films, and cinematic stages"
          description="The music, live direction, and visual identity behind KAM DRIDI."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="grid gap-5 text-sm leading-8 text-stone-300">
            {bandBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-3">
              <CTAButton href="/music#discography">Open Music</CTAButton>
              <CTAButton href="/who-is-kam-dridi#lore-archive" tone="secondary">
                Artist Story
              </CTAButton>
            </div>
          </GlassCard>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative h-full min-h-96">
              <Image
                src="/assets/images/gallery/p02_live.jpg"
                alt="KAM DRIDI performing live"
                fill
                className="object-cover"
              />
            </div>
          </GlassCard>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Link
            href="/music#videos"
            className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
          >
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Music</span>
            <span className="mt-3 block leading-7">Listen to the current releases and open the official video hub.</span>
          </Link>
          <Link
            href="/tour#dates"
            className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
          >
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Live</span>
            <span className="mt-3 block leading-7">Current and future live information for the KAM DRIDI project.</span>
          </Link>
          <Link
            href="/contact#management"
            className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
          >
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Professional</span>
            <span className="mt-3 block leading-7">Booking, press, management, and licensing inquiries.</span>
          </Link>
        </div>
      </Section>
    </>
  );
}
