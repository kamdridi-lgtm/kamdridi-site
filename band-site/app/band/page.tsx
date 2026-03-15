import type { Metadata } from "next";
import Image from "next/image";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
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
        description="A professional biography page that balances press-ready storytelling with fan-focused detail."
        image="/assets/images/band/live_stage.jpg"
      />

      <Section id="biography">
        <SectionHeading
          eyebrow="Band History"
          title="Built for records, films, and cinematic stages"
          description="Tell the origin story, define the sound, and position the artist like a serious modern entertainment project."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="grid gap-5 text-sm leading-8 text-stone-300">
            {bandBio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </GlassCard>
          <GlassCard className="overflow-hidden p-0">
            <div className="relative h-full min-h-96">
              <Image src="/assets/images/gallery/p02_live.jpg" alt="KAMDRIDI live" fill className="object-cover" />
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="members">
        <SectionHeading
          eyebrow="Members"
          title="Profiles for the live and creative roles"
          description="Feature core identities, collaborators, and live-performance contributors."
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
          eyebrow="Timeline of Albums"
          title="Discography milestones"
          description="Map the journey from earlier releases to Echoes Unearthed and the War Machines campaign."
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
