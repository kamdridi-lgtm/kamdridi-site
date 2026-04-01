import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { GlassCard, PageHero, Section, SectionHeading } from "@/components/ui";
import { featuredVideo, socialFeed, socialLinks, streamingLinks } from "@/data/site";

const mediaGallery = [
  {
    image: "/assets/images/gallery/p01_hero.jpg",
    title: "Campaign Hero",
    href: "/who-is-kam-dridi#comic-reader"
  },
  {
    image: "/assets/images/gallery/p03_portrait_mic.jpg",
    title: "Portrait Still",
    href: "/band#members"
  },
  {
    image: "/assets/images/band/live_stage.jpg",
    title: "Live Stage",
    href: "/tour#dates"
  }
];

export const metadata: Metadata = {
  title: "Media",
  description:
    "Official KAMDRIDI media hub with featured video, campaign stills, streaming platforms, and public-facing assets."
};

export default function MediaPage() {
  return (
    <>
      <PageHero
        eyebrow="Media"
        title="Official visuals, featured video, and public media routes"
        description="A distinct media page for the live campaign: official video, approved stills, streaming links, and public-facing updates."
        image="/assets/images/band/live_stage.jpg"
      />

      <Section id="featured-video">
        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
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
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Featured video</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              {featuredVideo.title}
            </h2>
            <p className="mt-5 text-sm leading-8 text-stone-400">{featuredVideo.description}</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/music#videos"
                className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
              >
                Open Music Hub
              </Link>
              <Link
                href="/visual-album"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Visual Album
              </Link>
              <Link
                href="/contact#management"
                className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Press Contact
              </Link>
            </div>
          </GlassCard>
        </div>
      </Section>

      <Section id="press-stills">
        <SectionHeading
          eyebrow="Approved Stills"
          title="Campaign imagery ready for public-facing use"
          description="A tighter media route for featured photography and visual assets, without duplicating the full music and discography page."
        />
        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {mediaGallery.map((item) => (
            <Link key={item.title} href={item.href}>
              <GlassCard className="overflow-hidden p-0 transition hover:-translate-y-1 hover:border-[#f4c66a]/35">
                <div className="relative h-80">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                  <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.72))]" />
                  <div className="absolute inset-x-0 bottom-0 p-5">
                    <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{item.title}</p>
                  </div>
                </div>
              </GlassCard>
            </Link>
          ))}
        </div>
      </Section>

      <Section id="platform-routes">
        <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Platform Routes</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Streaming and social endpoints
            </h2>
            <div className="mt-8 grid gap-3">
              {[...streamingLinks, ...socialLinks].map((link) => (
                <a
                  key={`${link.label}-${link.href}`}
                  href={link.href}
                  target="_blank"
                  rel="noreferrer"
                  className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4 text-sm text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
                >
                  {link.label}
                </a>
              ))}
            </div>
            <div className="mt-8 rounded-[22px] border border-white/10 bg-black/30 p-5 text-sm leading-7 text-stone-400">
              Need press, licensing, or booking materials? Use <Link href="/contact#management" className="text-[#f4c66a] transition hover:text-[#ffd989]">Contact</Link> for the direct route.
            </div>
          </GlassCard>

          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Campaign Feed</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Public-facing update notes
            </h2>
            <div className="mt-8 grid gap-4">
              {socialFeed.map((item) => (
                <div
                  key={`${item.platform}-${item.date}`}
                  className="rounded-[22px] border border-white/10 bg-black/30 p-5"
                >
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">
                    {item.platform}
                  </p>
                  <p className="mt-3 text-sm leading-7 text-stone-300">{item.caption}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.28em] text-stone-500">
                    {item.date}
                  </p>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>
      </Section>
    </>
  );
}
