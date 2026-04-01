import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ComicReader } from "@/components/comic-reader";
import { CTAButton, GlassCard, Section, SectionHeading } from "@/components/ui";
import { comicPages } from "@/data/site";

export const metadata: Metadata = {
  title: "Who is Kam Dridi",
  description:
    "Read the comic-style archive for Who is Kam Dridi with responsive page navigation and lore framing."
};

const loreRoutes = [
  {
    title: "Band Story",
    description: "Follow the live and recorded project history behind the character framing.",
    href: "/band#biography"
  },
  {
    title: "Visual Album",
    description: "Move from the comic archive into the cinematic scenes driving the campaign world.",
    href: "/visual-album#album-world"
  },
  {
    title: "Fan Vault",
    description: "Private drops, account access, and deeper archive layers continue inside the fan club.",
    href: "/fan-club#vault"
  }
];

export default function WhoIsKamDridiPage() {
  return (
    <>
      <section className="overflow-hidden border-b border-white/10">
        <div className="relative isolate">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-[8%] top-4 hidden h-[84%] w-[24%] rotate-[-7deg] overflow-hidden rounded-[34px] border border-[#f4c66a]/18 opacity-42 shadow-[0_28px_70px_rgba(0,0,0,0.35)] lg:block">
              <Image
                src="/assets/images/comic/page-grunge-split.png"
                alt="Comic collage background panel split"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute left-[14%] top-[-2%] hidden h-[92%] w-[19%] rotate-[-2deg] overflow-hidden rounded-[34px] border border-[#f4c66a]/16 opacity-34 shadow-[0_28px_70px_rgba(0,0,0,0.35)] lg:block">
              <Image
                src="/assets/images/comic/page-studio-victor.png"
                alt="Comic collage background panel studio"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute left-[31%] top-[7%] hidden h-[80%] w-[15%] rotate-[4deg] overflow-hidden rounded-[34px] border border-white/10 opacity-30 shadow-[0_28px_70px_rgba(0,0,0,0.35)] xl:block">
              <video
                className="h-full w-full object-cover"
                autoPlay
                muted
                loop
                playsInline
                preload="metadata"
                aria-label="Comic collage motion panel"
              >
                <source src="/videos/comic_wall_2026-03-31.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute right-[29%] top-6 hidden h-[84%] w-[17%] rotate-[3deg] overflow-hidden rounded-[34px] border border-[#f4c66a]/14 opacity-30 shadow-[0_28px_70px_rgba(0,0,0,0.35)] xl:block">
              <Image
                src={comicPages[0]?.image || "/assets/images/gallery/p01_hero.jpg"}
                alt="Comic collage background panel live show"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-[10%] top-[10%] hidden h-[76%] w-[14%] rotate-[-5deg] overflow-hidden rounded-[34px] border border-white/10 opacity-22 shadow-[0_28px_70px_rgba(0,0,0,0.35)] xl:block">
              <Image
                src={comicPages[1]?.image || "/assets/images/gallery/p02_live.jpg"}
                alt="Comic collage crowd panel"
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute right-[-7%] bottom-4 hidden h-[84%] w-[24%] rotate-[8deg] overflow-hidden rounded-[34px] border border-[#f4c66a]/18 opacity-42 shadow-[0_28px_70px_rgba(0,0,0,0.35)] lg:block">
              <Image
                src={comicPages[1]?.image || "/assets/images/gallery/p02_live.jpg"}
                alt="Comic collage background panel crowd"
                fill
                className="object-cover"
              />
            </div>
          </div>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.14),transparent_24%),linear-gradient(180deg,rgba(0,0,0,0.18),rgba(0,0,0,0.78)_58%,rgba(0,0,0,0.9))]" />
          <Section className="relative py-14 md:py-18">
            <div className="grid gap-10 lg:grid-cols-[0.74fr_1.26fr] lg:items-center">
              <div>
                <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                  Who is Kam Dridi
                </p>
                <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white md:text-7xl">
                  A comic archive inside the Echoes Unearthed world
                </h1>
                <p className="mt-6 max-w-2xl text-base leading-8 text-stone-300">
                  Read through the responsive comic-style presentation and move through the
                  artist mythology with a clean page viewer.
                </p>
                <div className="mt-8 flex flex-wrap gap-4">
                  <CTAButton href="#comic-reader">Open Comic Reader</CTAButton>
                  <CTAButton href="#lore-archive" tone="secondary">
                    Open Lore Archive
                  </CTAButton>
                </div>
              </div>

              <div className="relative">
                <div className="pointer-events-none absolute -left-8 top-8 hidden h-40 w-40 rounded-full bg-[#f4c66a]/10 blur-3xl md:block" />
                <div className="pointer-events-none absolute -right-10 bottom-0 hidden h-56 w-56 rounded-full bg-red-500/10 blur-3xl md:block" />
                <div className="relative overflow-hidden rounded-[36px] border border-white/10 bg-black shadow-[0_45px_110px_rgba(0,0,0,0.55)]">
                  <div className="pointer-events-none absolute left-5 top-5 z-20 rounded-full border border-white/15 bg-black/55 px-4 py-2 text-[11px] uppercase tracking-[0.34em] text-stone-200 backdrop-blur">
                    Motion Archive
                  </div>
                  <div className="relative aspect-[4/5] min-h-[420px] w-full md:aspect-[16/10] lg:aspect-[5/4]">
                    <video
                      className="absolute inset-0 h-full w-full scale-[1.04] object-cover object-center"
                      autoPlay
                      muted
                      loop
                      playsInline
                      preload="metadata"
                      aria-label="Who is Kam Dridi comic hero video"
                    >
                      <source src="/videos/comic_wall_2026-03-31.mp4" type="video/mp4" />
                    </video>
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_34%,rgba(0,0,0,0.18)_72%,rgba(0,0,0,0.48)_100%)]" />
                    <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.14),rgba(0,0,0,0.02)_32%,rgba(0,0,0,0.12)_62%,rgba(0,0,0,0.72))]" />
                    <div className="absolute inset-x-0 bottom-0 h-28 bg-[linear-gradient(180deg,rgba(0,0,0,0),rgba(0,0,0,0.88))]" />
                    <div className="pointer-events-none absolute inset-0 opacity-[0.08] mix-blend-screen [background-image:linear-gradient(rgba(255,255,255,0.7)_1px,transparent_1px)] [background-size:100%_16px]" />
                    <div className="absolute inset-x-0 bottom-0 z-20 p-6 md:p-8">
                      <p className="text-xs uppercase tracking-[0.42em] text-[#f4c66a]">
                        Who is Kam Dridi
                      </p>
                      <p className="mt-3 max-w-xl text-sm leading-7 text-stone-200">
                        Comic-world motion fragment, framed as a cinematic prelude before the
                        reader opens.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Section>
        </div>
      </section>

      <Section id="comic-reader" className="relative overflow-hidden">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(244,198,106,0.08),transparent_26%),linear-gradient(180deg,rgba(10,8,6,0.2),rgba(10,8,6,0.88))]" />
          <div className="absolute left-[-6%] top-12 hidden h-[78%] w-[28%] rotate-[-7deg] overflow-hidden rounded-[30px] border border-white/10 opacity-32 shadow-[0_30px_70px_rgba(0,0,0,0.4)] lg:block">
            <Image
              src="/assets/images/comic/page-studio-victor.png"
              alt="Comic collage panel studio"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute left-[35%] top-6 hidden h-[74%] w-[24%] rotate-[-1.5deg] overflow-hidden rounded-[30px] border border-white/10 opacity-24 shadow-[0_30px_70px_rgba(0,0,0,0.38)] lg:block">
            <video
              className="h-full w-full object-cover"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Comic collage center motion panel"
            >
              <source src="/videos/comic_top_2026-03-30.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="absolute right-[24%] top-16 hidden h-[70%] w-[18%] rotate-[4deg] overflow-hidden rounded-[30px] border border-white/10 opacity-18 shadow-[0_30px_70px_rgba(0,0,0,0.36)] xl:block">
            <Image
              src={comicPages[1]?.image || "/assets/images/gallery/p02_live.jpg"}
              alt="Comic collage side panel"
              fill
              className="object-cover"
            />
          </div>
          <div className="absolute right-[-5%] top-16 hidden h-[76%] w-[29%] rotate-[6deg] overflow-hidden rounded-[30px] border border-white/10 opacity-32 shadow-[0_30px_70px_rgba(0,0,0,0.4)] lg:block">
            <Image
              src="/assets/images/comic/page-grunge-split.png"
              alt="Comic collage panel band split"
              fill
              className="object-cover"
            />
          </div>
        </div>

        <div className="relative">
          <SectionHeading
            eyebrow="Comic Reader"
            title="Who is Kam Dridi"
            description="A responsive reader layout with sequential navigation, built to support the comic pages already tied into the project structure."
          />
          <div className="mt-12">
            <ComicReader />
          </div>
        </div>
      </Section>

      <Section id="lore-archive" className="pt-0">
        <SectionHeading
          eyebrow="Lore Archive"
          title="Signal fragments around the character"
          description="The comic archive now connects directly to the live campaign layers already present on the site instead of ending on an empty promise."
        />
        <div className="mt-12 grid gap-6 lg:grid-cols-[1.02fr_0.98fr]">
          <div className="grid gap-6">
            {comicPages.map((page) => (
              <GlassCard key={page.id} className="grid gap-6 md:grid-cols-[0.3fr_0.7fr]">
                <div className="relative h-48 overflow-hidden rounded-2xl">
                  <Image src={page.image} alt={page.title} fill className="object-cover" />
                </div>
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{page.title}</p>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{page.caption}</p>
                </div>
              </GlassCard>
            ))}
          </div>
          <GlassCard>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Connected Routes</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Move deeper into the archive
            </h2>
            <div className="mt-8 grid gap-3">
              {loreRoutes.map((route) => (
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
        </div>
      </Section>
    </>
  );
}
