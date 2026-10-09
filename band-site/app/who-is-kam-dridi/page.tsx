import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowDown, BookOpen, Disc3, LockKeyhole, Mic2 } from "lucide-react";
import { ComicReader } from "@/components/comic-reader";
import { CTAButton, GlassCard, Section } from "@/components/ui";
import { comicPages } from "@/data/site";

export const metadata: Metadata = {
  title: "Who is Kam Dridi | KAMDRIDI",
  description:
    "Read the cinematic comic origin of Kam Dridi through school days, first riffs, first shows, and the Echoes Unearthed mythology."
};

const storyBeats = [
  {
    label: "1993",
    title: "School hallways",
    copy: "The first jokes, notebooks, band shirts, sketches, and riffs start turning into a private universe.",
    icon: BookOpen
  },
  {
    label: "First show",
    title: "The room wakes up",
    copy: "A small stage becomes the proof that the dream is not just talk anymore. It has volume.",
    icon: Mic2
  },
  {
    label: "Archive",
    title: "Lost dreams",
    copy: "The pages keep the rough edges: garage light, cracked paper, old friends, and the spark before the myth.",
    icon: LockKeyhole
  },
  {
    label: "Now",
    title: "Echoes Unearthed",
    copy: "The comic connects the origin story to the album world, the fan vault, and the visual campaign.",
    icon: Disc3
  }
];

const doors = [
  { href: "/band#biography", label: "Band Story", image: comicPages[1].image },
  { href: "/visual-album", label: "Visual Album", image: comicPages[0].image },
  { href: "/fan-club#vault", label: "Fan Vault", image: comicPages[4].image }
];

export default function WhoIsKamDridiPage() {
  const feature = comicPages[4];

  return (
    <main className="overflow-hidden bg-[#050403] text-white">
      <section className="relative isolate min-h-[92vh] overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <Image
            src={feature.image}
            alt={feature.title}
            fill
            priority
            sizes="100vw"
            className="object-cover opacity-75"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(244,198,106,0.32),transparent_26%),linear-gradient(90deg,rgba(5,4,3,0.96),rgba(5,4,3,0.72)_42%,rgba(5,4,3,0.2)),linear-gradient(180deg,rgba(5,4,3,0.15),#050403_96%)]" />
        </div>

        <div className="relative mx-auto grid min-h-[92vh] max-w-7xl content-end gap-10 px-4 pb-10 pt-28 sm:px-6 lg:grid-cols-[0.95fr_1.05fr] lg:items-end lg:pb-16">
          <div className="max-w-3xl">
            <p className="text-xs uppercase tracking-[0.5em] text-[#f4c66a]">Origin comic</p>
            <h1 className="mt-5 font-display text-5xl uppercase leading-none tracking-[0.08em] text-white sm:text-6xl lg:text-8xl">
              Who is Kam Dridi
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
              A loud, dirty, cinematic memory wall: school corridors, first riffs, first show,
              camera flash, and the moment the Kam Dridi legend starts to feel real.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <CTAButton href="#comic-reader">Open the reader</CTAButton>
              <CTAButton href="#chapter-wall" tone="secondary">
                See all pages
              </CTAButton>
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-5 lg:mb-2">
            {comicPages.map((page, index) => (
              <a
                key={page.id}
                href="#comic-reader"
                className="group relative aspect-[3/4] overflow-hidden rounded-lg border border-white/15 bg-black/50 shadow-[0_24px_60px_rgba(0,0,0,0.45)] transition duration-300 hover:-translate-y-2 hover:border-[#f4c66a]/70"
              >
                <Image
                  src={page.image}
                  alt={page.title}
                  fill
                  sizes="(min-width: 1024px) 12vw, 18vw"
                  className="object-cover transition duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <span className="absolute bottom-3 left-3 text-xs uppercase tracking-[0.3em] text-[#f4c66a]">
                  0{index + 1}
                </span>
              </a>
            ))}
          </div>
        </div>

        <a
          href="#comic-reader"
          className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs uppercase tracking-[0.35em] text-stone-300 md:inline-flex"
        >
          Scroll
          <ArrowDown className="h-4 w-4" />
        </a>
      </section>

      <Section className="grid gap-5 py-14 md:grid-cols-4 md:py-20">
        {storyBeats.map((beat) => {
          const Icon = beat.icon;

          return (
            <div key={beat.title} className="border-l border-white/10 pl-5">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#f4c66a] text-black">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-5 text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{beat.label}</p>
              <h2 className="mt-3 font-display text-2xl uppercase tracking-[0.08em]">{beat.title}</h2>
              <p className="mt-3 text-sm leading-7 text-stone-400">{beat.copy}</p>
            </div>
          );
        })}
      </Section>

      <section className="relative isolate border-y border-white/10 py-20 md:py-28">
        <div className="absolute inset-0">
          <Image
            src={comicPages[2].image}
            alt={comicPages[2].title}
            fill
            sizes="100vw"
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#050403,rgba(5,4,3,0.8),#050403)]" />
        </div>
        <Section className="relative py-0">
          <div className="mb-10 max-w-3xl">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Comic reader</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl">
              Read it like a wall of memory
            </h2>
            <p className="mt-5 text-base leading-8 text-stone-300">
              The page stays dark and cinematic so the art takes over. Switch chapters, scan the
              thumbnails, and let the origin story sit beside the album world.
            </p>
          </div>
          <ComicReader />
        </Section>
      </section>

      <Section id="chapter-wall">
        <div className="mb-10 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Chapter wall</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl">
              Five pages, one origin
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-stone-400">
            Every panel is treated as a poster: big enough to feel collectible, tight enough to
            move fast on desktop and mobile.
          </p>
        </div>

        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
          {comicPages.map((page, index) => (
            <GlassCard key={page.id} className="group overflow-hidden p-0">
              <div className="relative aspect-[3/4] overflow-hidden bg-black">
                <Image
                  src={page.image}
                  alt={page.title}
                  fill
                  sizes="(min-width: 1024px) 18vw, (min-width: 768px) 45vw, 100vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-5">
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Page 0{index + 1}</p>
                  <p className="mt-3 text-sm leading-6 text-stone-200">{page.caption}</p>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </Section>

      <Section id="lore-archive" className="pt-0">
        <div className="grid gap-5 lg:grid-cols-3">
          {doors.map((door) => (
            <Link
              key={door.href}
              href={door.href}
              className="group relative min-h-[320px] overflow-hidden rounded-lg border border-white/10 bg-black"
            >
              <Image
                src={door.image}
                alt={door.label}
                fill
                sizes="(min-width: 1024px) 30vw, 100vw"
                className="object-cover opacity-60 transition duration-500 group-hover:scale-105 group-hover:opacity-80"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/35 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6">
                <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">Enter</p>
                <h3 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white">
                  {door.label}
                </h3>
              </div>
            </Link>
          ))}
        </div>
      </Section>
    </main>
  );
}
