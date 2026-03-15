import Image from "next/image";
import { GlassCard, Section, SectionHeading } from "@/components/ui";
import { albumTimeline, featuredVideo } from "@/data/site";

const galleryImages = [
  "/assets/images/gallery/p01_hero.jpg",
  "/assets/images/gallery/p02_live.jpg",
  "/assets/images/gallery/p03_portrait_mic.jpg",
  "/assets/images/gallery/p04_portrait_leather.jpg",
  "/assets/images/band/live1.jpg",
  "/assets/images/band/live3.jpg"
];

export function MusicHub() {
  return (
    <>
      <Section id="videos">
        <SectionHeading
          eyebrow="Music and Video"
          title="The sound and image core of Echoes Unearthed"
          description="A premium music hub for official video, visual world-building, gallery imagery, and the release timeline that anchors the KAMDRIDI universe."
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
