import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlassCard, Section, SectionHeading } from "@/components/ui";
import { featuredVideo, visualAlbumScenes } from "@/data/site";

export const metadata: Metadata = {
  title: "Visual Album",
  description:
    "Explore the cinematic visual album world of Echoes Unearthed through scenes, imagery, and campaign fragments."
};

const visualRoutes = [
  {
    title: "Music Hub",
    description: "Open the official video, discography, and release timeline that feeds the visual campaign.",
    href: "/music#videos"
  },
  {
    title: "Media",
    description: "Use the media page for the featured video, gallery stills, and public visual assets.",
    href: "/media#featured-video"
  },
  {
    title: "Games",
    description: "Follow the visual-album branch into the active game layer through The Gilded Null protocol.",
    href: "/games#the-gilded-null"
  },
  {
    title: "Fan Club",
    description: "Private clips, archive notes, and deeper world-building stay routed through the member area.",
    href: "/fan-club#vault"
  }
];

export default function VisualAlbumPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <video
            className="h-[58vh] w-full object-cover brightness-[1.1] contrast-[1.06] saturate-[1.04] md:h-[72vh]"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/assets/images/releases/echoes-unearthed-cover.jpg"
            aria-label="KAMDRIDI visual album trailer"
          >
            <source src="/videos/visual_album_top_2026-03-30.mp4" type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.22))]" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.12),transparent_30%)]" />
        </div>

        <Section className="py-12 md:py-16">
          <div className="mx-auto max-w-4xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Visual Album</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
              The cinematic body of Echoes Unearthed
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
              A scene archive built around heavy imagery, campaign stills, and the visual
              storytelling that runs through the album.
            </p>
          </div>
        </Section>
      </section>

      <Section id="featured-sequence">
        <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="w-full aspect-video">
              <iframe
                className="h-full w-full rounded-xl"
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </GlassCard>
          <GlassCard className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Featured Sequence</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Current visual centerpiece
            </h2>
            <p className="mt-5 text-sm leading-8 text-stone-400">
              The visual album now runs through the live campaign assets already on site: the War
              Machines feature, the Echoes Unearthed cover world, and the stage transmission layer.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/music#videos"
                className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
              >
                Open Music Hub
              </Link>
              <Link
                href="/media#featured-video"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Open Media
              </Link>
              <Link
                href="/games#the-gilded-null"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Enter Games
              </Link>
            </div>
          </GlassCard>
        </div>
      </Section>

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
        <div className="grid gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Scene Archive</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Visual fragments, collector mood, and campaign texture
            </h2>
            <p className="mt-5 text-sm leading-7 text-stone-400">
              This page now anchors the real visual material already present in the project:
              featured video, release art, stage imagery, and connected routes into the media and
              fan-club layers.
            </p>
            <div className="mt-8 grid gap-3">
              {visualRoutes.map((route) => (
                <Link
                  key={route.title}
                  href={route.href}
                  className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
                >
                  <span className="block text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                    {route.title}
                  </span>
                  <span className="mt-3 block leading-7">{route.description}</span>
                </Link>
              ))}
            </div>
          </GlassCard>
          <GlassCard className="panel-grid">
            <div className="grid gap-4 sm:grid-cols-3">
              {visualAlbumScenes.map((scene) => (
                <Link
                  key={`${scene.id}-mini`}
                  href={scene.href || "/visual-album#album-world"}
                  className="rounded-2xl border border-white/10 bg-black/20 p-4"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{scene.title}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-300">{scene.description}</p>
                </Link>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
