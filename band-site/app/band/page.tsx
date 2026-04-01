import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { CTAButton, GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { albumTimeline, bandBio, members } from "@/data/site";

export const metadata: Metadata = {
  title: "Band",
  description: "Read the KAMDRIDI biography, member profiles, and the release timeline around Echoes Unearthed."
};

export default function BandPage() {
  return (
    <>
      <PageHero
        eyebrow="Band"
        title="The story, the members, and the records"
        description="The official KAMDRIDI story page, built around the biography, live roles, and release timeline behind Echoes Unearthed."
        image="/assets/images/band/live_stage.jpg"
      />

      <Section id="biography">
        <SectionHeading
          eyebrow="Band History"
          title="Built for records, films, and cinematic stages"
          description="The project history, sonic identity, and visual direction that shape KAMDRIDI as a single coherent universe."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="grid gap-5 text-sm leading-8 text-stone-300">
            {bandBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
            <div className="flex flex-wrap gap-3 pt-3">
              <CTAButton href="/music#discography">Open Music</CTAButton>
              <CTAButton href="/who-is-kam-dridi#lore-archive" tone="secondary">
                Open Lore
              </CTAButton>
            </div>
          </GlassCard>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative h-full min-h-96">
              <Image src="/assets/images/gallery/p02_live.jpg" alt="KAMDRIDI live" fill className="object-cover" />
            </div>
          </GlassCard>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-3">
          <Link href="/music#videos" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Music</span>
            <span className="mt-3 block leading-7">Follow the project from band story into the current featured release and video hub.</span>
          </Link>
          <Link href="/tour#dates" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Tour</span>
            <span className="mt-3 block leading-7">Move from the artist profile into the live campaign dates and VIP routes.</span>
          </Link>
          <Link href="/contact#management" className="rounded-[24px] border border-white/10 bg-black/30 p-5 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]">
            <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Contact</span>
            <span className="mt-3 block leading-7">Booking, press, and licensing requests continue through the direct contact page.</span>
          </Link>
        </div>
      </Section>

      <Section id="members">
        <SectionHeading
          eyebrow="Members"
          title="Profiles for the live and creative roles"
          description="Core identities, collaborators, and performance roles that carry the project on stage and in production."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {members.map((member) => (
            <GlassCard key={member.name} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image src={member.image} alt={member.name} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{member.role}</p>
                <h3 className="mt-3 text-2xl text-white">{member.name}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{member.bio}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="timeline">
        <SectionHeading
          eyebrow="Discography"
          title="Discography milestones"
          description="From the earlier fragments to the Echoes Unearthed rollout and the War Machines campaign centerpiece."
        />
        <div className="mt-12 grid gap-6">
          {albumTimeline.map((album) => (
            <GlassCard key={`${album.year}-${album.title}`} className="grid gap-6 lg:grid-cols-[0.2fr_0.35fr_1fr] lg:items-center">
              <div>
                <p className="font-display text-4xl uppercase tracking-[0.15em] text-[#f4c66a]">{album.year}</p>
              </div>
              <div className="relative h-40 overflow-hidden rounded-2xl">
                <Image src={album.art} alt={album.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{album.type}</p>
                <h3 className="mt-3 text-3xl text-white">{album.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{album.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
    </>
  );
}
