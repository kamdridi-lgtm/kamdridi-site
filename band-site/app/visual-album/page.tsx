import type { Metadata } from "next";
import Image from "next/image";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { visualAlbumScenes } from "@/data/site";

export const metadata: Metadata = {
  title: "Visual Album",
  description:
    "Explore the cinematic visual album world of Echoes Unearthed through scenes, imagery, and campaign fragments."
};

export default function VisualAlbumPage() {
  return (
    <>
      <PageHero
        eyebrow="Visual Album"
        title="The cinematic body of Echoes Unearthed"
        description="A scene archive built around heavy imagery, campaign stills, and the visual storytelling that runs through the album."
        image="/assets/images/releases/echoes-unearthed-cover.jpg"
      />

      <Section id="album-world">
        <SectionHeading
          eyebrow="Album World"
          title="A visual experience built around weight, signal, and atmosphere"
          description="The visual album is treated like a world to move through, not a gallery of disconnected stills."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {visualAlbumScenes.map((scene) => (
            <GlassCard key={scene.id} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image src={scene.image} alt={scene.title} fill className="object-cover" />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{scene.title}</p>
                <p className="mt-4 text-sm leading-7 text-stone-400">{scene.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="scene-archive">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Scene Archive</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Visual fragments, collector mood, and campaign texture
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-400">
              This section is tuned for expansion with future clips, hidden scene unlocks,
              collector-only cuts, and fan-club gated visual material.
            </p>
          </GlassCard>
          <GlassCard className="panel-grid">
            <div className="grid gap-4 sm:grid-cols-3">
              {visualAlbumScenes.map((scene) => (
                <div key={`${scene.id}-mini`} className="rounded-2xl border border-white/10 bg-black/20 p-4">
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{scene.title}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{scene.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
