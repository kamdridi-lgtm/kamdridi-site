import type { Metadata } from "next";
import type { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Apple,
  ArrowRight,
  Box,
  Disc3,
  Eye,
  Film,
  Music2,
  Play,
  Radio,
  Share2,
  Sparkles,
  Youtube
} from "lucide-react";
import { FirstKnightEasterEgg } from "@/components/first-knight-easter-egg";
import { featuredVideo, gameExperiences, socialFeed, streamingLinks, visualAlbumScenes } from "@/data/site";

const albumCover = "/assets/images/releases/echoes-unearthed-cover.jpg";
const albumCoverPng = "/assets/images/releases/echoes-unearthed-cover.png";
const warMachinesCover = "/assets/images/releases/war-machines-cover.png";
const collectorCdImage = "/store/cd-product.jpg";
const vinylImage = "/store/vinyl-product.jpg";
const cassetteImage = "/store/war-machines-helmet.jpg";
const japanHref = "/app/war-machines-jp";

const tracks = [
  ["01", "War Machines", "The battle begins. Machines awaken."],
  ["02", "Too Fast Too Young", "Time burns everything."],
  ["03", "Our Lost Dreams", "Echoes of what we could not save."],
  ["04", "Junction Ahead (New Heaven's Odyssey)", "A door opens beyond the stars."],
  ["05", "17 For Ever", "Seventeen and immortal."],
  ["06", "The Victory Goes On", "The fight remains."],
  ["07", "Alone Apart / One Apart", "Two souls, one silence."],
  ["08", "Michael Remembers", "He remembers everything."],
  ["09", "The Fall of the First Knight", "The legend dies. The story begins."]
];

const universeCards = [
  {
    title: "Visual Album",
    text: "Watch the cinematic experience.",
    image: visualAlbumScenes[0]?.image || warMachinesCover,
    href: "/visual-album"
  },
  {
    title: "The Gilded Null",
    text: "Discover the story and the game.",
    image: gameExperiences[0]?.poster || "/official-game-poster.png",
    href: "/games/the-gilded-null"
  },
  {
    title: "The Fall of the First Knight",
    text: "The novel rescue story.",
    image: "/first-knight.jpg",
    href: "/who-is-kam-dridi"
  },
  {
    title: "Archive / Comic",
    text: "Comics, archive and lore.",
    image: "/assets/images/comic/page-grunge-split.png",
    href: "/who-is-kam-dridi#comic-reader"
  },
  {
    title: "Fan Club",
    text: "Join the community and get exclusive access.",
    image: "/assets/images/gallery/p04_portrait_leather.jpg",
    href: "/fan-club"
  }
];

const products = [
  {
    status: "Available now",
    title: "Echoes Unearthed - Collector CD",
    text: "Physical collector CD edition with 9 official tracks, hidden bonus archive track, premium booklet, and collector artwork.",
    price: "$34",
    image: collectorCdImage,
    href: "/store",
    cta: "Buy Collector CD",
    live: true
  },
  {
    status: "Coming soon",
    title: "Special Collector Edition",
    text: "Expanded collector edition with exclusive archive material and premium physical packaging.",
    price: "Future edition",
    image: albumCoverPng,
    href: "/store",
    cta: "Coming Soon",
    live: false
  },
  {
    status: "Coming soon",
    title: "Echoes Unearthed - Vinyl Edition",
    text: "Collector vinyl edition currently in preparation. No preorder, stock count, or release date is shown until confirmed.",
    price: "Future edition",
    image: vinylImage,
    href: "/store",
    cta: "Coming Soon",
    live: false
  },
  {
    status: "Coming soon",
    title: "Archive Cassette",
    text: "Limited cassette edition inspired by underground sci-fi rock archive transmissions.",
    price: "Future edition",
    image: cassetteImage,
    href: "/store",
    cta: "Coming Soon",
    live: false
  }
];

const platformIcons: Record<string, ReactNode> = {
  Spotify: <Music2 className="h-5 w-5" />,
  "Apple Music": <Apple className="h-5 w-5" />,
  "Amazon Music": <Radio className="h-5 w-5" />,
  Deezer: <Disc3 className="h-5 w-5" />
};

export const metadata: Metadata = {
  title: "Echoes Unearthed - Official Album Hub",
  description:
    "Official KAMDRIDI album headquarters for Echoes Unearthed with streaming links, tracklist, collector editions, video, and the cinematic universe."
};

function PremiumButton({
  href,
  children,
  tone = "primary"
}: {
  href: string;
  children: ReactNode;
  tone?: "primary" | "secondary" | "red";
}) {
  const classes = {
    primary:
      "border-[#f4a33f]/70 bg-[linear-gradient(180deg,#d66a16,#8f3208)] text-white shadow-[0_18px_55px_rgba(201,82,16,0.32)] hover:border-[#ffd18a]",
    secondary:
      "border-[#c57b32]/45 bg-black/35 text-stone-100 hover:border-[#f4c66a]/70 hover:text-[#f4c66a]",
    red: "border-red-500/50 bg-[linear-gradient(180deg,#d71920,#8d0508)] text-white shadow-[0_18px_55px_rgba(170,10,10,0.3)] hover:border-red-300"
  };

  return (
    <Link
      href={href}
      className={`inline-flex min-h-12 items-center justify-center border px-5 py-3 text-center text-xs font-semibold uppercase tracking-[0.18em] transition duration-300 hover:-translate-y-0.5 sm:px-7 ${classes[tone]}`}
    >
      {children}
    </Link>
  );
}

function SectionTitle({ eyebrow, title }: { eyebrow?: string; title: string }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      {eyebrow ? <p className="text-xs uppercase tracking-[0.38em] text-[#c98542]">{eyebrow}</p> : null}
      <h2 className="font-display text-3xl uppercase tracking-[0.12em] text-[#e8b777] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

export default function HomePage() {
  return (
    <>
      <FirstKnightEasterEgg />
      <div className="relative overflow-hidden bg-[#050403] text-white">
        <div className="pointer-events-none fixed inset-0 z-0 opacity-55">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_18%_20%,rgba(209,91,18,0.18),transparent_30%),radial-gradient(circle_at_86%_12%,rgba(244,198,106,0.13),transparent_28%),linear-gradient(180deg,#050403,#090604_42%,#030303)]" />
          <div className="absolute inset-0 bg-[url('/assets/images/band/live_stage.jpg')] bg-cover bg-fixed bg-center opacity-[0.16]" />
        </div>

        <section className="relative z-10 border-b border-[#a86225]/25">
          <div className="absolute inset-0">
            <Image src={albumCover} alt="" fill priority className="object-cover opacity-20 blur-[1px]" />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(4,3,2,0.94),rgba(4,3,2,0.72),rgba(4,3,2,0.92)),radial-gradient(circle_at_82%_82%,rgba(220,91,18,0.32),transparent_34%)]" />
          </div>
          <div className="relative mx-auto grid min-h-[calc(100svh-140px)] max-w-7xl items-center gap-8 px-4 py-10 sm:px-6 lg:grid-cols-[0.9fr_1.1fr] lg:py-16">
            <div className="mx-auto w-full max-w-[360px] lg:max-w-[500px]">
              <div className="relative aspect-square border border-[#d08a43]/35 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.68)]">
                <Image src={albumCover} alt="Echoes Unearthed album cover" fill priority className="object-cover" />
              </div>
            </div>
            <div className="text-center lg:text-left">
              <p className="font-display text-4xl uppercase tracking-[0.18em] text-[#d47b2f] sm:text-5xl">
                KAM DRIDI
              </p>
              <h1 className="mt-4 font-display text-[clamp(3.2rem,10vw,8.8rem)] uppercase leading-[0.78] tracking-[0.08em] text-stone-100">
                Echoes
                <br />
                Unearthed
              </h1>
              <p className="mt-6 max-w-2xl text-base font-semibold leading-8 text-stone-200 sm:text-lg">
                The full cinematic rock album is available now. Stream the record, enter the Echoes
                Unearthed universe, and collect the physical edition.
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-stone-400">
                Stream the full album now. Explore the official tracklist, collector editions,
                Japan campaign page, and the Echoes Unearthed universe.
              </p>
              <div className="mt-8 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                <PremiumButton href="#listen-now">Stream Full Album</PremiumButton>
                <PremiumButton href="#collector-products" tone="secondary">
                  Collector CD
                </PremiumButton>
                <PremiumButton href="#collector-products" tone="secondary">
                  Special Edition
                </PremiumButton>
                <PremiumButton href={japanHref} tone="red">
                  Japan Page
                </PremiumButton>
              </div>
              <div className="mt-7 grid gap-3 text-xs uppercase tracking-[0.2em] text-stone-300 sm:grid-cols-3">
                <Link href="#video" className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]">
                  <Play className="h-4 w-4" /> Watch War Machines
                </Link>
                <Link href="#universe" className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]">
                  <Eye className="h-4 w-4" /> Enter the Universe
                </Link>
                <a
                  href="https://kamdridi.com"
                  className="inline-flex items-center justify-center gap-3 py-2 hover:text-[#f4c66a]"
                >
                  <Share2 className="h-4 w-4" /> Share Album
                </a>
              </div>
            </div>
          </div>
        </section>

        <section id="listen-now" className="relative z-10 border-b border-[#a86225]/20 px-4 py-9 sm:px-6">
          <SectionTitle title="Listen Now" />
          <div className="mx-auto mt-7 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {streamingLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="flex min-h-16 items-center justify-center gap-3 border border-white/10 bg-black/45 px-5 text-lg font-semibold text-stone-100 shadow-[0_18px_60px_rgba(0,0,0,0.28)] transition hover:-translate-y-0.5 hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                {platformIcons[link.label] ?? <Music2 className="h-5 w-5" />}
                {link.label}
              </a>
            ))}
          </div>
        </section>

        <section id="tracklist" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle title="Tracklist" />
          <div className="mx-auto mt-8 max-w-7xl overflow-hidden border border-[#8f5728]/35 bg-black/48">
            {tracks.map(([number, title, description]) => (
              <div
                key={number}
                className="grid gap-3 border-b border-white/10 px-4 py-4 last:border-b-0 sm:grid-cols-[70px_1.1fr_1.4fr_auto] sm:items-center"
              >
                <span className="font-display text-2xl text-[#c98542]">{number}</span>
                <h3 className="font-semibold text-stone-100">{title}</h3>
                <p className="text-sm text-stone-400">{description}</p>
                <div className="flex items-center gap-3 text-stone-500">
                  <span className="rounded-full border border-white/10 px-3 py-1 text-[10px] uppercase tracking-[0.2em]">
                    Album
                  </span>
                  <Share2 className="h-4 w-4" />
                </div>
              </div>
            ))}
            <div className="grid gap-3 bg-[#140d08] px-4 py-5 sm:grid-cols-[70px_1.1fr_1.4fr_auto] sm:items-center">
              <span className="font-display text-2xl text-[#f4c66a]">Bonus</span>
              <h3 className="font-semibold text-stone-100">Echoes of Our Youth</h3>
              <p className="text-sm text-stone-400">Physical Collector Edition Bonus Track.</p>
              <span className="rounded-full border border-[#f4c66a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">
                Collector only
              </span>
            </div>
          </div>
        </section>

        <section id="collector-products" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle eyebrow="Official Store" title="Collector Products" />
          <div className="mx-auto mt-9 grid max-w-7xl gap-5 lg:grid-cols-4">
            {products.map((product) => (
              <article key={product.title} className="border border-[#8f5728]/35 bg-black/52">
                <div className="relative aspect-[4/3] overflow-hidden border-b border-white/10 bg-[#120b07]">
                  <Image src={product.image} alt={product.title} fill className="object-cover" />
                </div>
                <div className="p-5">
                  <p className={product.live ? "text-xs uppercase tracking-[0.25em] text-[#f4c66a]" : "text-xs uppercase tracking-[0.25em] text-stone-500"}>
                    {product.status}
                  </p>
                  <h3 className="mt-3 min-h-16 font-display text-2xl uppercase tracking-[0.08em] text-stone-100">
                    {product.title}
                  </h3>
                  <p className="mt-3 min-h-28 text-sm leading-6 text-stone-400">{product.text}</p>
                  <p className="mt-5 text-lg font-semibold text-[#e8b777]">{product.price}</p>
                  <div className="mt-5">
                    {product.live ? (
                      <PremiumButton href={product.href}>{product.cta}</PremiumButton>
                    ) : (
                      <span className="inline-flex min-h-12 items-center justify-center border border-white/10 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-500">
                        {product.cta}
                      </span>
                    )}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        <section className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <div className="mx-auto grid max-w-7xl items-center gap-6 overflow-hidden border border-[#8f5728]/35 bg-black/50 p-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-[#c98542]">Japan Campaign</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.1em] text-stone-100 sm:text-5xl">
                War Machines / ウォー・マシーンズ
              </h2>
              <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300">
                Official Japanese campaign page for the Echoes Unearthed universe.
              </p>
              <p className="mt-2 text-sm text-stone-500">ダークで映画的なSFロック。</p>
              <div className="mt-7">
                <PremiumButton href={japanHref} tone="red">
                  Japan Page
                </PremiumButton>
              </div>
            </div>
            <div className="relative min-h-72 overflow-hidden">
              <Image src="/assets/images/gallery/p03_portrait_mic.jpg" alt="War Machines Japan campaign" fill className="object-cover" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,transparent,rgba(0,0,0,0.78))]" />
            </div>
          </div>
        </section>

        <section id="universe" className="relative z-10 border-b border-[#a86225]/20 px-4 py-10 sm:px-6">
          <SectionTitle title="Enter The Echoes Unearthed Universe" />
          <div className="mx-auto mt-8 grid max-w-7xl gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {universeCards.map((card) => (
              <Link
                key={card.title}
                href={card.href}
                className="group overflow-hidden border border-white/10 bg-black/50 transition hover:-translate-y-1 hover:border-[#f4c66a]/50"
              >
                <div className="relative aspect-[16/10]">
                  <Image src={card.image} alt={card.title} fill className="object-cover transition duration-500 group-hover:scale-105" />
                </div>
                <div className="p-4 text-center">
                  <h3 className="font-display text-xl uppercase tracking-[0.08em] text-[#e8b777]">{card.title}</h3>
                  <p className="mt-2 text-sm leading-6 text-stone-400">{card.text}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>

        <section id="video" className="relative z-10 px-4 py-10 sm:px-6">
          <SectionTitle eyebrow="News / Video" title="Active Signals" />
          <div className="mx-auto mt-8 grid max-w-7xl gap-6 lg:grid-cols-[1.25fr_0.75fr]">
            <div className="overflow-hidden border border-[#8f5728]/35 bg-black/55">
              <div className="aspect-video">
                <iframe
                  className="h-full w-full"
                  src={featuredVideo.embedUrl}
                  title={featuredVideo.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="grid gap-4">
              {socialFeed.map((item) => (
                <div key={`${item.platform}-${item.date}`} className="border border-white/10 bg-black/50 p-5">
                  <div className="flex items-center gap-3 text-[#f4c66a]">
                    {item.platform === "YouTube" ? <Youtube className="h-5 w-5" /> : item.platform === "TikTok" ? <Film className="h-5 w-5" /> : <Sparkles className="h-5 w-5" />}
                    <p className="text-xs uppercase tracking-[0.28em]">{item.platform}</p>
                  </div>
                  <p className="mt-4 text-sm leading-7 text-stone-300">{item.caption}</p>
                  <p className="mt-3 text-xs uppercase tracking-[0.22em] text-stone-600">{item.date}</p>
                </div>
              ))}
              <Link
                href="/news"
                className="inline-flex items-center justify-center gap-3 border border-[#8f5728]/45 bg-black/50 px-5 py-4 text-xs font-semibold uppercase tracking-[0.22em] text-stone-200 transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                News / Video <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="relative z-10 border-t border-[#a86225]/20 px-4 py-12 text-center sm:px-6">
          <div className="mx-auto flex max-w-5xl flex-col items-center gap-5 sm:flex-row sm:justify-center">
            <PremiumButton href="#listen-now">Stream the Album</PremiumButton>
            <PremiumButton href="#universe" tone="secondary">
              Enter the Universe
            </PremiumButton>
            <PremiumButton href="#collector-products" tone="secondary">
              <Box className="mr-2 h-4 w-4" /> Collect the Physical Edition
            </PremiumButton>
          </div>
        </section>
      </div>
    </>
  );
}
