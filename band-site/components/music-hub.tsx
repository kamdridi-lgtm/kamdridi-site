import Image from "next/image";
import { Disc3, Music2, Play, Radio } from "lucide-react";
import { GlassCard, Section, SectionHeading } from "@/components/ui";
import { albumTimeline, featuredVideo, streamingLinks } from "@/data/site";

const galleryImages = [
  "/assets/images/gallery/p01_hero.jpg",
  "/assets/images/gallery/p02_live.jpg",
  "/assets/images/gallery/p03_portrait_mic.jpg",
  "/assets/images/gallery/p04_portrait_leather.jpg",
  "/assets/images/band/live1.jpg",
  "/assets/images/band/live3.jpg"
];

const streamIcons: Record<string, React.ReactNode> = {
  Spotify: <Music2 className="h-5 w-5" />,
  "Apple Music": <Play className="h-5 w-5" />,
  "Amazon Music": <Radio className="h-5 w-5" />,
  Deezer: <Disc3 className="h-5 w-5" />
};

export function MusicHub() {
  return (
    <>
      <Section id="listen-now">
        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Listen Now</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              War Machines is live
            </h2>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Stream the current KAMDRIDI single across the official platform links below.
            </p>
          </GlassCard>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {streamingLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between rounded-[28px] border border-white/10 bg-white/[0.04] p-6 shadow-[0_35px_80px_rgba(0,0,0,0.35)] backdrop-blur transition hover:-translate-y-1 hover:border-[#f4c66a]/40"
              >
                <div className="flex items-center gap-4">
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/30">
                    {streamIcons[link.label] ?? <Music2 className="h-5 w-5" />}
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{link.label}</p>
                    <p className="mt-2 text-sm text-white">{link.note}</p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </Section>

      <Section id="videos">
        <SectionHeading
          eyebrow="Music and Video"
          title="The sound and image core of Echoes Unearthed"
          description="A premium music hub for official audio, visual world-building, gallery imagery, and the release timeline that anchors the KAMDRIDI universe."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <GlassCard className="overflow-hidden p-0">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </GlassCard>
          <GlassCard className="flex flex-col justify-center">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Now playing</p>
            <h2 className="mt-4 text-4xl text-white">{featuredVideo.title}</h2>
            <p className="mt-5 text-sm leading-8 text-stone-400">{featuredVideo.description}</p>
          </GlassCard>
        </div>
      </Section>

      <Section id="gallery">
        <SectionHeading
          eyebrow="Gallery"
          title="Frames from the campaign world"
          description="Photography, live capture, and artist imagery presented as a visual archive instead of a generic media dump."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image) => (
            <GlassCard key={image} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image
                  src={image}
                  alt="KAMDRIDI gallery image"
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="discography">
        <SectionHeading
          eyebrow="Discography"
          title="Albums, singles, and timeline"
          description="The release history underneath the campaign, from the first fragments to the full Echoes Unearthed rollout."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {albumTimeline.map((album) => (
            <GlassCard key={album.title} className="grid gap-6 md:grid-cols-[0.45fr_0.55fr]">
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image src={album.art} alt={album.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                  {album.year} · {album.type}
                </p>
                <h3 className="mt-4 text-3xl text-white">{album.title}</h3>
                <p className="mt-4 text-sm leading-7 text-stone-400">{album.description}</p>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>
    </>
  );
}
