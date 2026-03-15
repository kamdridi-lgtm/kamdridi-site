import type { Metadata } from "next";
import Image from "next/image";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { albumTimeline, featuredVideo } from "@/data/site";

const galleryImages = [
  "/assets/images/gallery/p01_hero.jpg",
  "/assets/images/gallery/p02_live.jpg",
  "/assets/images/gallery/p03_portrait_mic.jpg",
  "/assets/images/gallery/p04_portrait_leather.jpg",
  "/assets/images/band/live1.jpg",
  "/assets/images/band/live3.jpg"
];

export const metadata: Metadata = {
  title: "Media",
  description: "Watch KAMDRIDI videos, browse imagery, and explore the Echoes Unearthed discography."
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Videos, gallery, albums, and discography"
        description="A full media hub for official visual assets, photo galleries, album art, and embedded video playback."
        image="/assets/images/gallery/p01_hero.jpg"
      />

      <Section id="videos">
        <SectionHeading
          eyebrow="Music Videos"
          title="Embedded official video player"
          description="Use this section for singles, live sessions, trailers, lyric videos, and short-form content highlights."
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
          eyebrow="Photo Gallery"
          title="Press-ready photography"
          description="Placeholder images are included so the gallery looks complete immediately after installation."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {galleryImages.map((image) => (
            <GlassCard key={image} className="overflow-hidden p-0">
              <div className="relative h-80">
                <Image src={image} alt="KAMDRIDI gallery image" fill className="object-cover transition duration-500 hover:scale-105" />
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="discography">
        <SectionHeading
          eyebrow="Discography"
          title="Albums and release timeline"
          description="Pair release art with descriptions, credits, platform links, and collector formats."
        />
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {albumTimeline.map((album) => (
            <GlassCard key={album.title} className="grid gap-6 md:grid-cols-[0.45fr_0.55fr]">
              <div className="relative h-64 overflow-hidden rounded-2xl">
                <Image src={album.art} alt={album.title} fill className="object-cover" />
              </div>
              <div>
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{album.year} · {album.type}</p>
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
