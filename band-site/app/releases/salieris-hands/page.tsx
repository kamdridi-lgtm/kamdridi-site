import type { Metadata } from "next";
import Image from "next/image";
import { Disc3, ListMusic, Package, Play, Shirt, Sparkles } from "lucide-react";

const assetBase = "/assets/images/salieris-hands";
const teaserUrl = "https://youtu.be/wDOu7-krT8s";

const assets = {
  hero: `${assetBase}/salieri-opera-hall-hero.png`,
  frontCover: `${assetBase}/front-cover-approved.png`,
  collectorPack: `${assetBase}/full-collector-pack.png`,
  booklet: `${assetBase}/booklet-mockup.png`,
  jewelcase: `${assetBase}/jewelcase-mockup.png`,
  operaTeaser: `${assetBase}/opera-teaser.png`,
  wide: `${assetBase}/salieri-wide-official.png`,
  vienna: `${assetBase}/vienna-walking-official.png`
};

const mainTracks = [
  "Requiem",
  "Shadows of Vienna",
  "The Gift Was Not Mine",
  "Divine Jealousy",
  "Mozart's Ghost",
  "Invidia",
  "Confession in C Minor",
  "The Face of My Prayer",
  "Fugue for the Unchosen",
  "Salieri's Hands"
];

const bonusTracks = [
  "Salieri's Hands - Classical Version",
  "The Fall of the First Knight - Grand Opera Version",
  "The Prism - Grand Opera Version"
];

const editionCards = [
  {
    title: "Digital Release",
    status: "Teaser out now",
    text: "High-resolution audio and digital booklet prepared for the July 2026 release.",
    image: assets.frontCover,
    alt: "Official album front cover artwork"
  },
  {
    title: "Collector CD",
    status: "Pre-order soon",
    text: "Digipak / jewel case concept with printed booklet, disc art, and back cover treatment.",
    image: assets.jewelcase,
    alt: "Collector CD jewel case concept"
  },
  {
    title: "Vinyl Edition",
    status: "Coming soon",
    text: "Premium vinyl release concept for the physical campaign."
  },
  {
    title: "Hardcover Booklet",
    status: "In preparation",
    text: "Liner notes and story presentation by KAMDRIDI.",
    image: assets.booklet,
    alt: "Hardcover booklet concept"
  },
  {
    title: "Special Edition Box",
    status: "Pre-order soon",
    text: "Collector package concept including CD, booklet, art print, and premium packaging.",
    image: assets.collectorPack,
    alt: "Special edition collector package concept"
  },
  {
    title: "Collector Coin",
    status: "Collector item",
    text: "Antique bronze finish collector item for the special edition world."
  }
];

const merchItems = ["Tee", "Hoodie", "Mug", "Poster", "Collector Bundle"];
const streamingItems = ["Spotify", "Apple Music", "Amazon", "Instagram"];

export const metadata: Metadata = {
  title: "Salieri's Hands - KAMDRIDI",
  description:
    "Salieri's Hands is a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Album release: July 2026."
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-[11px] font-bold uppercase tracking-[0.34em] text-[#e3b86a]">{children}</p>;
}

function SectionIntro({
  title,
  children,
  align = "left"
}: {
  title: string;
  children?: React.ReactNode;
  align?: "left" | "center";
}) {
  return (
    <div className={align === "center" ? "mx-auto max-w-3xl text-center" : "max-w-3xl"}>
      <h2 className="font-serif text-[clamp(2rem,5vw,3.6rem)] uppercase leading-[0.95] text-[#ffe3ad]">
        {title}
      </h2>
      {children ? <div className="mt-4 text-sm leading-7 text-[#ead4ad] sm:text-base">{children}</div> : null}
    </div>
  );
}

function ActionLink({
  href,
  children,
  tone = "solid"
}: {
  href: string;
  children: React.ReactNode;
  tone?: "solid" | "ghost";
}) {
  const isExternal = href.startsWith("http");
  const classes =
    tone === "solid"
      ? "border-[#efc36f] bg-[#e2ad52] text-[#140b05] shadow-[0_20px_56px_rgba(226,173,82,0.22)] hover:bg-[#ffd98b]"
      : "border-[#d7a75d]/70 bg-black/34 text-[#ffe7bd] hover:border-[#ffd98b] hover:bg-[#e2ad52]/10 hover:text-white";

  return (
    <a
      href={href}
      target={isExternal ? "_blank" : undefined}
      rel={isExternal ? "noreferrer" : undefined}
      className={`inline-flex min-h-12 items-center justify-center gap-2 border px-4 py-3 text-center text-[11px] font-bold uppercase tracking-[0.16em] transition duration-300 hover:-translate-y-0.5 ${classes}`}
    >
      {children}
    </a>
  );
}

function ImagePanel({
  src,
  alt,
  contain = false,
  priority = false
}: {
  src: string;
  alt: string;
  contain?: boolean;
  priority?: boolean;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      priority={priority}
      className={contain ? "object-contain p-4" : "object-cover"}
      sizes="(max-width: 768px) 100vw, 45vw"
    />
  );
}

function TextOnlyCard({ title, status, text }: { title: string; status: string; text: string }) {
  return (
    <article className="flex min-h-[230px] flex-col justify-between border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_20%_0%,rgba(255,210,126,0.15),transparent_38%),linear-gradient(180deg,rgba(28,16,8,0.94),rgba(9,5,3,0.96))] p-5 shadow-[inset_0_1px_0_rgba(255,235,185,0.1)]">
      <div>
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e3b86a]">{status}</p>
        <h3 className="mt-4 font-serif text-2xl uppercase leading-tight text-[#ffe0aa]">{title}</h3>
        <p className="mt-4 text-sm leading-7 text-[#d9c09a]">{text}</p>
      </div>
    </article>
  );
}

function EditionCard({
  title,
  status,
  text,
  image,
  alt
}: {
  title: string;
  status: string;
  text: string;
  image?: string;
  alt?: string;
}) {
  if (!image || !alt) {
    return <TextOnlyCard title={title} status={status} text={text} />;
  }

  return (
    <article className="group overflow-hidden border border-[#bd8b45]/45 bg-[#0d0704]/78 shadow-[inset_0_1px_0_rgba(255,235,185,0.08)] transition duration-300 hover:-translate-y-1 hover:border-[#efc36f]/80">
      <div className="relative aspect-[4/3] border-b border-[#bd8b45]/25 bg-[#090604]">
        <ImagePanel src={image} alt={alt} contain />
      </div>
      <div className="p-5">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e3b86a]">{status}</p>
        <h3 className="mt-3 font-serif text-2xl uppercase leading-tight text-[#ffe0aa]">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-[#d9c09a]">{text}</p>
      </div>
    </article>
  );
}

export default function SalierisHandsPage() {
  return (
    <main className="salieri-page overflow-hidden bg-[#070403] text-[#f7e7c8]">
      <style>{`
        .salieri-page {
          --salieri-gold: #e2ad52;
          --salieri-ivory: #ffe3ad;
          font-family: "Segoe UI", system-ui, sans-serif;
        }

        .salieri-hero-title,
        .salieri-animated-word {
          font-family: Georgia, "Times New Roman", serif;
        }

        .salieri-hero-image {
          filter: brightness(1.1) contrast(1.08) saturate(1.08);
          transform: scale(1.03);
          animation: salieriBreath 18s ease-in-out infinite;
        }

        .salieri-candle-glow {
          animation: salieriCandle 5.8s ease-in-out infinite;
        }

        .salieri-animated-word {
          position: absolute;
          inset: 0;
          display: flex;
          align-items: center;
          opacity: 0;
          transform: translateY(22px);
          filter: blur(10px);
          color: #ffe8bd;
          text-transform: uppercase;
          text-shadow: 0 0 18px rgba(226, 173, 82, 0.28), 0 18px 54px rgba(0, 0, 0, 0.88);
          animation: salieriWordCycle 19s cubic-bezier(0.16, 1, 0.3, 1) infinite;
        }

        .salieri-animated-word:nth-child(2) { animation-delay: 3.4s; }
        .salieri-animated-word:nth-child(3) { animation-delay: 6.8s; }
        .salieri-animated-word:nth-child(4) { animation-delay: 10.2s; }
        .salieri-animated-word:nth-child(5) { animation-delay: 13.6s; }

        @keyframes salieriBreath {
          0%, 100% { transform: scale(1.03); filter: brightness(1.06) contrast(1.08) saturate(1.06); }
          50% { transform: scale(1.085) translate3d(-0.8%, -0.5%, 0); filter: brightness(1.18) contrast(1.1) saturate(1.12); }
        }

        @keyframes salieriCandle {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          44% { opacity: 0.78; transform: scale(1.08); }
          52% { opacity: 0.55; transform: scale(1.02); }
          62% { opacity: 0.72; transform: scale(1.06); }
        }

        @keyframes salieriWordCycle {
          0% { opacity: 0; transform: translateY(24px); filter: blur(10px); }
          8%, 18% { opacity: 1; transform: translateY(0); filter: blur(0); }
          28%, 100% { opacity: 0; transform: translateY(-16px); filter: blur(8px); }
        }

        @media (prefers-reduced-motion: reduce) {
          .salieri-hero-image,
          .salieri-candle-glow,
          .salieri-animated-word {
            animation: none !important;
          }

          .salieri-animated-word {
            display: none;
          }
        }
      `}</style>

      <section className="relative isolate min-h-[82svh] overflow-hidden border-b border-[#a67938]/35 bg-black">
        <Image src={assets.hero} alt="Conductor and orchestra in a dark opera hall" fill priority className="salieri-hero-image object-cover object-center" sizes="100vw" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_58%_44%,rgba(255,215,138,0.18),transparent_34%),linear-gradient(90deg,rgba(0,0,0,0.62),rgba(0,0,0,0.22)_52%,rgba(0,0,0,0.3)),linear-gradient(180deg,rgba(0,0,0,0.04),rgba(0,0,0,0.18)_62%,#070403_100%)]" />
        <div className="salieri-candle-glow absolute left-[8%] top-[24%] h-48 w-48 rounded-full bg-[#f2b45b]/18 blur-3xl" />
        <div className="relative z-10 flex min-h-[82svh] items-end px-4 pb-12 pt-28 sm:px-6 lg:items-center lg:pb-20">
          <div className="mx-auto w-full max-w-7xl">
            <div className="max-w-4xl border-l border-[#e2ad52]/60 bg-gradient-to-r from-black/48 via-black/18 to-transparent px-5 py-6 sm:px-8 sm:py-8">
              <Eyebrow>New Release</Eyebrow>
              <div className="relative mt-5 h-[88px] sm:h-[124px] lg:h-[146px]">
                <div className="salieri-animated-word text-[clamp(2.7rem,10vw,7rem)] leading-none">Envy</div>
                <div className="salieri-animated-word text-[clamp(2.45rem,9vw,6.4rem)] leading-none">Jealousy</div>
                <div className="salieri-animated-word text-[clamp(2.1rem,8vw,5.7rem)] leading-none">Confession</div>
                <div className="salieri-animated-word text-[clamp(2rem,7.4vw,5.2rem)] leading-none">Vienna, 1791</div>
                <div className="salieri-animated-word text-[clamp(2rem,7.4vw,5.2rem)] leading-none">Salieri&apos;s Hands</div>
              </div>
              <h1 className="salieri-hero-title text-[clamp(3rem,10vw,7.6rem)] uppercase leading-[0.9] text-[#ffe3ad] drop-shadow-[0_18px_48px_rgba(0,0,0,0.86)]">
                Salieri&apos;s Hands
              </h1>
              <div className="mt-5 grid max-w-2xl gap-1 text-sm font-semibold uppercase tracking-[0.16em] text-[#ffe7bd] sm:text-base">
                <p>A special off-series KAMDRIDI release</p>
                <p>Limited release</p>
                <p>Vienna, 1791</p>
                <p>Faith. Envy. Confession.</p>
                <p>Album release: July 2026</p>
              </div>
              <div className="mt-7 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <ActionLink href={teaserUrl}>
                  <Play className="h-4 w-4" />
                  Watch Teaser
                </ActionLink>
                <ActionLink href="#tracklist" tone="ghost">
                  <ListMusic className="h-4 w-4" />
                  Tracklist
                </ActionLink>
                <ActionLink href="#collector-editions" tone="ghost">
                  <Package className="h-4 w-4" />
                  Collector Edition
                </ActionLink>
                <ActionLink href="#merch" tone="ghost">
                  <Shirt className="h-4 w-4" />
                  Merch
                </ActionLink>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="teaser" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Official Teaser" align="center">
            <p>Watch the first glimpse.</p>
          </SectionIntro>
          <a href={teaserUrl} target="_blank" rel="noreferrer" className="group relative mt-9 block min-h-[320px] overflow-hidden border border-[#bd8b45]/55 bg-black shadow-[0_34px_110px_rgba(0,0,0,0.5)] sm:min-h-[500px]">
            <ImagePanel src={assets.operaTeaser} alt="Official teaser still with conductor and orchestra" priority />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.32)),radial-gradient(circle_at_50%_44%,transparent,rgba(0,0,0,0.32)_74%)]" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="inline-flex h-24 w-24 items-center justify-center rounded-full border border-[#ffd98b]/80 bg-black/40 text-[#ffe7bd] shadow-[0_0_64px_rgba(226,173,82,0.34)] transition group-hover:scale-105 group-hover:border-[#ffe2a6]">
                <Play className="ml-1 h-10 w-10 fill-current" />
              </span>
            </div>
            <span className="absolute bottom-5 left-5 inline-flex border border-[#efc36f]/70 bg-black/50 px-4 py-3 text-[11px] font-bold uppercase tracking-[0.18em] text-[#ffe7bd]">
              Watch Teaser
            </span>
          </a>
        </div>
      </section>

      <section className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-stretch">
          <div className="relative min-h-[360px] overflow-hidden border border-[#bd8b45]/45 bg-black sm:min-h-[460px]">
            <ImagePanel src={assets.wide} alt="Hands over manuscript in warm candlelight" />
          </div>
          <div className="flex flex-col justify-center border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_12%_0%,rgba(255,210,126,0.16),transparent_36%),linear-gradient(180deg,rgba(28,16,8,0.94),rgba(9,5,3,0.96))] p-6 sm:p-9">
            <SectionIntro title="A Confession Written In Silence">
              <p>Vienna, 1791. In the shadow of genius, faith turns into envy. A man writes not for glory, but for absolution.</p>
              <p className="mt-4">Dark orchestration. Haunting choirs. Crushing riffs. A requiem for the man history misunderstood.</p>
            </SectionIntro>
          </div>
        </div>
      </section>

      <section id="tracklist" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Full Tracklist" />
          <div className="mt-8 grid gap-6 lg:grid-cols-[1fr_0.54fr]">
            <div className="overflow-hidden border border-[#bd8b45]/45 bg-[#0d0704]/78">
              {mainTracks.map((track, index) => (
                <div key={track} className="grid grid-cols-[56px_1fr] items-center border-b border-[#bd8b45]/18 px-4 py-4 last:border-b-0 sm:grid-cols-[78px_1fr]">
                  <span className="font-serif text-2xl text-[#e3b86a] sm:text-3xl">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-base font-semibold text-[#f9e3bd]">{track}</span>
                </div>
              ))}
            </div>
            <div className="border border-[#bd8b45]/45 bg-[linear-gradient(180deg,rgba(28,16,8,0.92),rgba(10,6,4,0.96))] p-5 sm:p-6">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[#e3b86a]">Bonus tracks</h3>
              <div className="mt-5 space-y-5">
                {bonusTracks.map((track, index) => (
                  <div key={track} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="font-serif text-2xl text-[#e3b86a]">{index + 11}</span>
                    <span className="text-sm leading-6 text-[#f1d8ac]">{track}</span>
                  </div>
                ))}
              </div>
              <p className="mt-7 border-t border-[#bd8b45]/22 pt-5 text-sm leading-7 text-[#d9c09a]">
                Bonus tracks include material connected to the forthcoming KAMDRIDI album TWICE UPON A TIME.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="collector-editions" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Collector Editions" align="center">
            <p>Physical concepts prepared for the July 2026 campaign.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {editionCards.map((edition) => (
              <EditionCard key={edition.title} {...edition} />
            ))}
          </div>
        </div>
      </section>

      <section id="merch" className="border-b border-[#a67938]/25 px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto max-w-7xl">
          <SectionIntro title="Merch" align="center">
            <p>Campaign items in preparation.</p>
          </SectionIntro>
          <div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-5">
            {merchItems.map((item) => (
              <article key={item} className="min-h-[190px] border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_28%_0%,rgba(255,210,126,0.14),transparent_40%),linear-gradient(180deg,rgba(27,15,8,0.94),rgba(9,5,3,0.96))] p-5">
                <Shirt className="h-5 w-5 text-[#e3b86a]" />
                <h3 className="mt-8 font-serif text-2xl uppercase leading-tight text-[#ffe0aa]">{item}</h3>
                <p className="mt-5 inline-flex border border-[#e3b86a]/40 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e3b86a]">
                  Coming soon
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-12 sm:px-6 md:py-16">
        <div className="mx-auto grid max-w-7xl gap-5 lg:grid-cols-[0.7fr_1fr]">
          <div className="relative min-h-[340px] overflow-hidden border border-[#bd8b45]/45 bg-black sm:min-h-[440px]">
            <ImagePanel src={assets.vienna} alt="Vienna 1791 figure walking through the street" />
          </div>
          <div className="border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_12%_0%,rgba(255,210,126,0.16),transparent_34%),linear-gradient(180deg,rgba(28,16,8,0.94),rgba(8,5,3,0.97))] p-6 sm:p-8">
            <SectionIntro title="Release Updates">
              <p>Official teaser out now.</p>
              <p>Album release: July 2026.</p>
            </SectionIntro>
            <div className="mt-7 flex flex-wrap gap-3">
              <ActionLink href={teaserUrl}>
                <Play className="h-4 w-4" />
                YouTube
              </ActionLink>
            </div>
            <div className="mt-8 grid gap-3">
              {streamingItems.map((platform) => (
                <div key={platform} className="flex items-center justify-between gap-4 border border-[#bd8b45]/28 bg-black/30 px-4 py-3">
                  <span className="text-sm font-semibold text-[#f9e3bd]">{platform}</span>
                  <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em] text-[#e3b86a]">
                    <Sparkles className="h-3.5 w-3.5" />
                    Coming soon
                  </span>
                </div>
              ))}
              <a href={teaserUrl} target="_blank" rel="noreferrer" className="flex items-center justify-between gap-4 border border-[#efc36f]/55 bg-[#e2ad52]/10 px-4 py-3 text-sm font-semibold text-[#ffe7bd] transition hover:border-[#ffd98b]">
                <span>YouTube</span>
                <span className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.22em]">
                  Teaser live <Disc3 className="h-4 w-4" />
                </span>
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
