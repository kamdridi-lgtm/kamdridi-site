import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  CalendarClock,
  CassetteTape,
  Disc3,
  ExternalLink,
  Film,
  Globe2,
  Music2,
  Package,
  Play,
  Radio,
  Share2,
  Sparkles,
  Star,
  Youtube
} from "lucide-react";
import { FirstKnightEasterEgg } from "@/components/first-knight-easter-egg";
import { Section } from "@/components/ui";
import { featuredVideo, siteMeta, socialFeed, streamingLinks } from "@/data/site";

const albumCover = "/assets/images/releases/echoes-unearthed-cover.jpg";
const warMachinesCover = "/assets/images/releases/war-machines-cover.png";
const collectorCdImage = "/store/cd-product.jpg";
const vinylImage = "/store/vinyl-product.jpg";
const heroVideo = "/kamdridi-hero.mp4";

const primaryCtas = [
  { label: "Stream Full Album", href: "#listen-now", icon: Music2 },
  { label: "Collector CD", href: "#collector-cd", icon: Package },
  { label: "Special Edition", href: "#special-edition", icon: Star },
  { label: "Japan Page", href: "/app/war-machines-jp", icon: Globe2 }
];

const secondaryCtas = [
  { label: "Watch War Machines", href: "#war-machines-video", icon: Play },
  { label: "Enter the Universe", href: "#universe", icon: Sparkles },
  { label: "Share Album", href: "https://kamdridi.com", icon: Share2 }
];

const listenLinks = [
  ...streamingLinks.filter((link) =>
    ["Spotify", "Apple Music", "Amazon Music"].includes(link.label)
  ),
  {
    label: "YouTube",
    href: "https://youtube.com/@kamdridi",
    note: "KAMDRIDI channel"
  },
  {
    label: "Japan Page",
    href: "/app/war-machines-jp",
    note: "War Machines campaign"
  }
];

const platformIcons: Record<string, React.ReactNode> = {
  Spotify: <Music2 className="h-5 w-5" />,
  "Apple Music": <Play className="h-5 w-5" />,
  "Amazon Music": <Radio className="h-5 w-5" />,
  YouTube: <Youtube className="h-5 w-5" />,
  "Japan Page": <Globe2 className="h-5 w-5" />
};

const tracks = [
  {
    number: "01",
    title: "War Machines",
    description: "Industrial pressure, scorched circuits, and the record's first heavy signal.",
    links: streamingLinks
  },
  {
    number: "02",
    title: "Too Fast Too Young",
    description: "A high-velocity memory piece built from youth, speed, and aftermath."
  },
  {
    number: "03",
    title: "Our Lost Dreams",
    description: "Wide-screen melancholy with the weight of a forgotten city at night."
  },
  {
    number: "04",
    title: "Junction Ahead (New Heaven's Odyssey)",
    description: "A crossroad transmission where the album opens toward its sci-fi horizon."
  },
  {
    number: "05",
    title: "17 For Ever",
    description: "A preserved archive of teenage electricity, damaged hope, and golden light."
  },
  {
    number: "06",
    title: "The Victory Goes On",
    description: "A hard-lit march through endurance, momentum, and cinematic resolve."
  },
  {
    number: "07",
    title: "Alone Apart / One Apart",
    description: "An isolated signal split between distance, identity, and reunion."
  },
  {
    number: "08",
    title: "Michael Remembers",
    description: "A personal recollection rendered as a dark, reverent album passage."
  },
  {
    number: "09",
    title: "The Fall of the First Knight",
    description: "The closing chapter: mythic, heavy, and built like a final frame."
  }
];

const collectorProducts = [
  {
    id: "collector-cd",
    status: "Available Now",
    title: "Echoes Unearthed - Collector CD",
    description: "Physical collector CD edition including 9 official tracks, hidden bonus archive track, premium booklet, and collector artwork.",
    price: "$34",
    image: collectorCdImage,
    button: "Buy Collector CD",
    href: "/store#echoes-unearthed-collector-cd",
    live: true,
    includes: ["9 official tracks", "Hidden bonus archive track", "Premium booklet", "Collector artwork"]
  },
  {
    id: "special-edition",
    status: "Coming Soon",
    title: "Special Collector Edition",
    description: "Expanded collector edition with exclusive archive material and premium physical packaging.",
    button: "Coming Soon",
    live: false,
    includes: ["Alternate mixes", "Extended artwork", "Signed insert", "Numbered edition", "Unreleased archive content"]
  },
  {
    id: "vinyl-edition",
    status: "Coming Soon",
    title: "Echoes Unearthed - Vinyl Edition",
    description: "Collector vinyl edition currently in preparation.",
    image: vinylImage,
    button: "Coming Soon",
    live: false,
    includes: ["Large-format artwork", "Collector vinyl packaging", "Dark metallic presentation"]
  },
  {
    id: "archive-cassette",
    status: "Coming Soon",
    title: "Archive Cassette",
    description: "Limited cassette edition inspired by underground sci-fi rock archive transmissions.",
    button: "Coming Soon",
    live: false,
    includes: ["Retro-futuristic object direction", "Dark archive aesthetic", "Premium artifact packaging"]
  }
];

const universeCards = [
  {
    title: "Visual Album",
    text: "Cinematic fragments and visualizers supporting the album world.",
    href: "/visual-album"
  },
  {
    title: "The Gilded Null",
    text: "Game protocol tied to the fan universe, kept secondary to the music.",
    href: "/games/the-gilded-null"
  },
  {
    title: "The Fall of the First Knight",
    text: "The album's mythic final chapter and hidden archive signal.",
    href: "/visual-album#scene-archive"
  },
  {
    title: "Archive / Comic",
    text: "A smaller lore layer for readers who want the deeper world.",
    href: "/who-is-kam-dridi"
  },
  {
    title: "Fan Club",
    text: "Private updates, collector notices, and early campaign access.",
    href: "/fan-club"
  }
];

export const metadata: Metadata = {
  title: "Echoes Unearthed",
  description:
    "Official KAMDRIDI Echoes Unearthed album headquarters with streaming links, tracklist, collector CD, Japan campaign page, videos, and the cinematic album universe."
};

function PillLink({
  href,
  label,
  icon: Icon,
  tone = "primary"
}: {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  tone?: "primary" | "secondary";
}) {
  const classes =
    tone === "primary"
      ? "border-[#f4c66a]/60 bg-[#f4c66a] text-black shadow-[0_18px_55px_rgba(244,198,106,0.22)] hover:bg-[#ffd989]"
      : "border-white/15 bg-white/[0.035] text-white hover:border-[#f4c66a]/60 hover:text-[#f4c66a]";

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center gap-2 rounded-full border px-5 py-3 text-center text-[11px] font-semibold uppercase tracking-[0.2em] transition hover:-translate-y-0.5 sm:text-xs ${classes}`}
    >
      <Icon className="h-4 w-4" />
      {label}
    </Link>
  );
}

function SectionIntro({
  eyebrow,
  title,
  description,
  center = false
}: {
  eyebrow: string;
  title: string;
  description: string;
  center?: boolean;
}) {
  return (
    <div className={center ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <p className="text-[11px] uppercase tracking-[0.38em] text-[#f4c66a]">{eyebrow}</p>
      <h2 className="mt-3 font-display text-4xl uppercase leading-none tracking-[0.08em] text-white md:text-6xl">
        {title}
      </h2>
      <p className="mt-4 text-sm leading-7 text-stone-400 sm:text-base">{description}</p>
    </div>
  );
}

function CassetteMockup() {
  return (
    <div className="relative mx-auto aspect-[1.58/1] w-full max-w-md overflow-hidden rounded-[24px] border border-[#f4c66a]/20 bg-[linear-gradient(145deg,#15110d,#050505_55%,#22160b)] p-5 shadow-[0_40px_120px_rgba(0,0,0,0.65)]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(244,198,106,0.2),transparent_28%),linear-gradient(90deg,transparent,rgba(255,255,255,0.05),transparent)]" />
      <div className="relative flex h-full flex-col justify-between rounded-[18px] border border-white/10 bg-black/35 p-4">
        <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">
          <span>Archive</span>
          <CassetteTape className="h-4 w-4" />
        </div>
        <div className="grid grid-cols-[1fr_0.8fr_1fr] items-center gap-4">
          <div className="aspect-square rounded-full border border-white/15 bg-black/60 p-5">
            <div className="h-full rounded-full border border-[#f4c66a]/25" />
          </div>
          <div className="h-12 rounded-full border border-white/10 bg-black/70" />
          <div className="aspect-square rounded-full border border-white/15 bg-black/60 p-5">
            <div className="h-full rounded-full border border-[#f4c66a]/25" />
          </div>
        </div>
        <p className="text-center text-[11px] uppercase tracking-[0.28em] text-stone-300">
          Echoes Unearthed / Transmission
        </p>
      </div>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <FirstKnightEasterEgg />
      <section className="relative isolate overflow-hidden border-b border-white/10">
        <div className="absolute inset-0">
          <video
            className="h-full w-full object-cover opacity-48"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            poster="/kamdridi-hero.jpg"
            aria-label="KAMDRIDI cinematic background"
          >
            <source src={heroVideo} type="video/mp4" />
          </video>
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_72%_18%,rgba(244,198,106,0.28),transparent_24%),radial-gradient(circle_at_18%_50%,rgba(194,65,12,0.24),transparent_28%),linear-gradient(90deg,rgba(0,0,0,0.96),rgba(0,0,0,0.64)_46%,rgba(0,0,0,0.9))]" />
          <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#090909] to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-112px)] max-w-7xl items-center gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[0.94fr_0.7fr] lg:py-16">
          <div className="max-w-4xl">
            <div className="inline-flex rounded-full border border-[#f4c66a]/30 bg-black/45 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-[#f4c66a]">
              Stream the full album now
            </div>
            <p className="mt-6 text-sm uppercase tracking-[0.42em] text-stone-300">KAM DRIDI</p>
            <h1 className="mt-3 font-display text-[clamp(3.6rem,12vw,9.8rem)] uppercase leading-[0.82] tracking-[0.04em] text-white drop-shadow-[0_20px_80px_rgba(0,0,0,0.9)]">
              Echoes
              <span className="block text-[#f4c66a]">Unearthed</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-stone-200 sm:text-lg">
              The full cinematic rock album is available now. Stream the record, explore the
              collector editions, and enter the Echoes Unearthed universe.
            </p>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
              Stream the full album now. Explore the official tracklist, collector editions, Japan
              campaign page, and the Echoes Unearthed universe.
            </p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {primaryCtas.map((cta) => (
                <PillLink key={cta.label} href={cta.href} label={cta.label} icon={cta.icon} />
              ))}
            </div>
            <div className="mt-4 flex flex-wrap gap-3">
              {secondaryCtas.map((cta) => (
                <PillLink
                  key={cta.label}
                  href={cta.href}
                  label={cta.label}
                  icon={cta.icon}
                  tone="secondary"
                />
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-md lg:max-w-lg">
            <div className="absolute -inset-6 rounded-full bg-[#f4c66a]/12 blur-3xl" />
            <div className="relative rounded-[28px] border border-[#f4c66a]/25 bg-black/55 p-3 shadow-[0_40px_140px_rgba(0,0,0,0.72)] backdrop-blur">
              <div className="relative aspect-square overflow-hidden rounded-[20px]">
                <Image
                  src={albumCover}
                  alt="Echoes Unearthed album cover"
                  fill
                  priority
                  className="object-cover"
                />
              </div>
              <div className="flex items-center justify-between gap-4 px-2 py-4">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.32em] text-[#f4c66a]">
                    Official Album
                  </p>
                  <p className="mt-1 text-sm text-stone-300">Streaming + collector editions</p>
                </div>
                <BadgeCheck className="h-7 w-7 text-[#f4c66a]" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Section id="listen-now" className="py-14 md:py-20">
        <SectionIntro
          center
          eyebrow="Listen Now"
          title="Official Streaming Hub"
          description="Live platform links only. Buttons open the current KAMDRIDI streaming destinations and campaign pages."
        />
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {listenLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={link.href.startsWith("http") ? "noreferrer" : undefined}
              className="group flex min-h-28 items-center justify-between rounded-[22px] border border-white/10 bg-white/[0.035] p-5 transition hover:-translate-y-1 hover:border-[#f4c66a]/55 hover:bg-[#f4c66a]/8"
            >
              <div>
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-black/40 text-[#f4c66a]">
                  {platformIcons[link.label] ?? <Music2 className="h-5 w-5" />}
                </span>
                <p className="mt-4 text-sm uppercase tracking-[0.24em] text-white">{link.label}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-500">
                  {link.note}
                </p>
              </div>
              <ExternalLink className="h-4 w-4 text-stone-500 transition group-hover:text-[#f4c66a]" />
            </Link>
          ))}
        </div>
      </Section>

      <Section id="tracklist" className="py-14 md:py-20">
        <SectionIntro
          eyebrow="Official Tracklist"
          title="Nine cinematic rock chapters"
          description="Track cards are informational. Local players are only shown when real audio exists, and the current full listening path is through the live streaming links."
        />
        <div className="mt-10 grid gap-4 lg:grid-cols-3">
          {tracks.map((track) => (
            <article
              key={track.number}
              className="rounded-[22px] border border-white/10 bg-[#10100f]/72 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]"
            >
              <div className="flex items-start justify-between gap-4">
                <p className="text-xs uppercase tracking-[0.36em] text-[#f4c66a]">
                  Track {track.number}
                </p>
                <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.18em] text-stone-400">
                  Album
                </span>
              </div>
              <h3 className="mt-4 text-2xl font-semibold text-white">{track.title}</h3>
              <p className="mt-3 text-sm leading-7 text-stone-400">{track.description}</p>
              {track.links ? (
                <div className="mt-5 flex flex-wrap gap-2">
                  {track.links.slice(0, 3).map((link) => (
                    <Link
                      key={link.label}
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full border border-white/10 px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-stone-300 transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              ) : null}
            </article>
          ))}
          <article className="rounded-[22px] border border-[#f4c66a]/30 bg-[#f4c66a]/8 p-5 shadow-[0_24px_70px_rgba(0,0,0,0.32)]">
            <p className="text-xs uppercase tracking-[0.36em] text-[#f4c66a]">Bonus Track</p>
            <h3 className="mt-4 text-2xl font-semibold text-white">Echoes of Our Youth</h3>
            <p className="mt-2 text-xs uppercase tracking-[0.2em] text-stone-300">
              Physical Collector Edition Bonus Track
            </p>
            <p className="mt-3 text-sm leading-7 text-stone-400">
              A hidden archive piece reserved for the physical collector edition.
            </p>
          </article>
        </div>
      </Section>

      <Section id="collector-products" className="py-14 md:py-20">
        <SectionIntro
          eyebrow="Collector Editions"
          title="Physical product hub"
          description="The collector CD is available through the real store flow. Future formats are prepared in the page structure and labeled honestly as coming soon."
        />
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {collectorProducts.map((product) => (
            <article
              key={product.id}
              id={product.id}
              className="scroll-mt-32 overflow-hidden rounded-[26px] border border-white/10 bg-white/[0.035] shadow-[0_35px_100px_rgba(0,0,0,0.45)]"
            >
              <div className="grid min-h-full gap-0 md:grid-cols-[0.9fr_1.1fr]">
                <div className="relative min-h-72 bg-black/45">
                  {product.image ? (
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  ) : product.id === "archive-cassette" ? (
                    <div className="flex h-full items-center p-6">
                      <CassetteMockup />
                    </div>
                  ) : (
                    <div className="flex h-full items-center justify-center p-6">
                      <div className="relative aspect-square w-56 rounded-[28px] border border-[#f4c66a]/20 bg-[radial-gradient(circle_at_50%_35%,rgba(244,198,106,0.22),transparent_34%),linear-gradient(145deg,#17110a,#050505)] p-6">
                        <div className="h-full rounded-[20px] border border-white/10 bg-black/45" />
                        <Sparkles className="absolute right-8 top-8 h-6 w-6 text-[#f4c66a]" />
                      </div>
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <span
                      className={`rounded-full border px-3 py-2 text-[10px] uppercase tracking-[0.22em] ${
                        product.live
                          ? "border-emerald-400/30 bg-emerald-400/10 text-emerald-200"
                          : "border-[#f4c66a]/30 bg-[#f4c66a]/10 text-[#f4c66a]"
                      }`}
                    >
                      {product.status}
                    </span>
                    {"price" in product ? (
                      <span className="text-xl text-[#f4c66a]">{product.price}</span>
                    ) : null}
                  </div>
                  <h3 className="mt-5 font-display text-3xl uppercase tracking-[0.08em] text-white">
                    {product.title}
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-stone-400">{product.description}</p>
                  <div className="mt-6 grid gap-2">
                    {product.includes.map((item) => (
                      <div key={item} className="flex items-start gap-3 text-sm text-stone-300">
                        <BadgeCheck className="mt-0.5 h-4 w-4 text-[#f4c66a]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-7">
                    {product.live && product.href ? (
                      <Link
                        href={product.href}
                        className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-xs font-semibold uppercase tracking-[0.22em] text-black transition hover:bg-[#ffd989]"
                      >
                        {product.button}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.22em] text-stone-300">
                        {product.button}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </Section>

      <Section id="japan-page" className="py-14 md:py-20">
        <div className="grid gap-8 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_78%_28%,rgba(244,198,106,0.16),transparent_28%),rgba(255,255,255,0.035)] p-6 md:grid-cols-[0.85fr_1.15fr] md:p-10">
          <div className="relative min-h-72 overflow-hidden rounded-[22px] border border-white/10">
            <Image src={warMachinesCover} alt="War Machines cover" fill className="object-cover" />
          </div>
          <div className="flex flex-col justify-center">
            <p className="text-[11px] uppercase tracking-[0.38em] text-[#f4c66a]">Japan Campaign</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-6xl">
              War Machines / ウォー・マシーンズ
            </h2>
            <p className="mt-5 max-w-2xl text-sm leading-7 text-stone-400 sm:text-base">
              Official Japanese campaign page for the Echoes Unearthed universe.
            </p>
            <p className="mt-3 text-sm text-stone-300">ダークで映画的なSFロック。</p>
            <div className="mt-8">
              <PillLink href="/app/war-machines-jp" label="Japan Page" icon={Globe2} />
            </div>
          </div>
        </div>
      </Section>

      <Section id="universe" className="py-14 md:py-20">
        <SectionIntro
          eyebrow="Universe"
          title="The album stays at the center"
          description="A compact set of supporting doors for the visual world, games, archive, and fan access."
        />
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {universeCards.map((card) => (
            <Link
              key={card.title}
              href={card.href}
              className="rounded-[22px] border border-white/10 bg-black/30 p-5 transition hover:-translate-y-1 hover:border-[#f4c66a]/50"
            >
              <p className="text-sm uppercase tracking-[0.22em] text-white">{card.title}</p>
              <p className="mt-4 text-sm leading-6 text-stone-400">{card.text}</p>
              <ArrowRight className="mt-5 h-4 w-4 text-[#f4c66a]" />
            </Link>
          ))}
        </div>
      </Section>

      <Section id="war-machines-video" className="py-14 md:py-20">
        <SectionIntro
          eyebrow="News / Video"
          title="Active campaign signal"
          description="War Machines videos, cinematic shorts, and social activity keep the album page alive without turning the music into a side feature."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="overflow-hidden rounded-[26px] border border-white/10 bg-black/40">
            <div className="aspect-video">
              <iframe
                className="h-full w-full"
                src={featuredVideo.embedUrl}
                title={featuredVideo.title}
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
          <div className="grid gap-4">
            {socialFeed.map((item) => (
              <article key={`${item.platform}-${item.date}`} className="rounded-[22px] border border-white/10 bg-white/[0.035] p-5">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-xs uppercase tracking-[0.28em] text-[#f4c66a]">{item.platform}</p>
                  <CalendarClock className="h-4 w-4 text-stone-500" />
                </div>
                <p className="mt-4 text-sm leading-7 text-stone-300">{item.caption}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.18em] text-stone-500">{item.date}</p>
              </article>
            ))}
            <Link
              href="/media"
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
            >
              <Film className="mr-2 h-4 w-4" />
              Open Media Hub
            </Link>
          </div>
        </div>
      </Section>

      <section className="border-t border-white/10 bg-black/45 px-4 py-12 text-center sm:px-6">
        <p className="mx-auto max-w-4xl font-display text-4xl uppercase leading-tight tracking-[0.08em] text-white md:text-6xl">
          Stream the album. Enter the universe. Collect the physical edition.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <PillLink href="#listen-now" label="Stream Album" icon={Music2} />
          <PillLink href="#universe" label="Enter Universe" icon={Sparkles} tone="secondary" />
          <PillLink href="#collector-cd" label="Collector CD" icon={Package} tone="secondary" />
        </div>
      </section>
    </>
  );
}
