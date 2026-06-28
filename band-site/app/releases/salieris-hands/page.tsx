import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Download, ExternalLink, Play, Radio, Sparkles } from "lucide-react";

const assetBase = "/assets/images/salieris-hands";
const teaserUrl = "https://youtu.be/wDOu7-krT8s";

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

const editions = [
  {
    title: "Digital Album",
    status: "July 2026",
    text: "The complete off-series release with the full main album and bonus works prepared for streaming platforms.",
    image: `${assetBase}/front-cover-approved.png`
  },
  {
    title: "Collector CD",
    status: "In preparation",
    text: "Physical jewelcase concept with official artwork, disc treatment, back cover, and booklet design.",
    image: `${assetBase}/jewelcase-mockup.png`
  },
  {
    title: "Opera Edition",
    status: "Coming soon",
    text: "Expanded theatrical presentation centered on the confession, Vienna, and the grand opera bonus versions.",
    image: `${assetBase}/opera-teaser.png`
  }
];

const merchItems = [
  { title: "Collector Pack", image: `${assetBase}/full-collector-pack.png` },
  { title: "Booklet", image: `${assetBase}/booklet-mockup.png` },
  { title: "Disc Mockup", image: `${assetBase}/disc-mockup.png` },
  { title: "Mini Card", image: `${assetBase}/mini-card-mockup.png` }
];

export const metadata: Metadata = {
  title: "SALIERI'S HANDS - KAMDRIDI",
  description:
    "SALIERI'S HANDS is a special off-series KAMDRIDI release. Vienna, 1791. Faith. Envy. Confession. Coming July 2026."
};

function Eyebrow({ children }: { children: React.ReactNode }) {
  return <p className="text-xs font-semibold uppercase tracking-[0.32em] text-[#c99a52]">{children}</p>;
}

function SectionHeading({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="max-w-3xl">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.1em] text-[#f3d8a7] sm:text-4xl">
        {title}
      </h2>
    </div>
  );
}

function GoldButton({
  href,
  children,
  tone = "solid"
}: {
  href: string;
  children: React.ReactNode;
  tone?: "solid" | "ghost";
}) {
  const classes =
    tone === "solid"
      ? "border-[#d6ad68] bg-[#c49348] text-[#120c08] hover:bg-[#e6c17c]"
      : "border-[#b68b45]/55 bg-black/30 text-[#f4deb8] hover:border-[#e4bd75] hover:text-white";

  return (
    <a
      href={href}
      target={href.startsWith("http") ? "_blank" : undefined}
      rel={href.startsWith("http") ? "noreferrer" : undefined}
      className={`inline-flex min-h-11 items-center justify-center gap-2 border px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] transition ${classes}`}
    >
      {children}
    </a>
  );
}

export default function SalierisHandsPage() {
  return (
    <main className="min-h-screen bg-[#050302] text-stone-100">
      <section className="relative overflow-hidden border-b border-[#8a642f]/25">
        <div className="absolute inset-0 hidden md:block">
          <Image
            src={`${assetBase}/salieri-wide-official.png`}
            alt=""
            fill
            priority
            className="object-cover opacity-38"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,3,2,0.95),rgba(5,3,2,0.7)_48%,rgba(5,3,2,0.9)),linear-gradient(180deg,rgba(5,3,2,0.1),#050302)]" />
        </div>
        <div className="absolute inset-0 md:hidden">
          <Image
            src={`${assetBase}/salieri-vertical-official.png`}
            alt=""
            fill
            priority
            className="object-cover opacity-32"
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(5,3,2,0.42),rgba(5,3,2,0.82)_52%,#050302)]" />
        </div>

        <div className="relative mx-auto grid min-h-[88svh] max-w-7xl items-center gap-8 px-4 py-20 sm:px-6 lg:grid-cols-[0.46fr_0.54fr] lg:py-24">
          <div className="mx-auto w-full max-w-[430px]">
            <div className="relative aspect-square overflow-hidden border border-[#d6ad68]/45 bg-black shadow-[0_34px_120px_rgba(0,0,0,0.72)]">
              <Image
                src={`${assetBase}/front-cover-approved.png`}
                alt="Official SALIERI'S HANDS front cover"
                fill
                priority
                className="object-contain"
                sizes="(max-width: 768px) 92vw, 430px"
              />
            </div>
            <p className="mt-3 text-center text-[10px] uppercase tracking-[0.28em] text-[#c99a52]">
              Official Front Cover
            </p>
          </div>

          <div className="text-center lg:text-left">
            <Eyebrow>KAMDRIDI RECORDS / JULY 2026</Eyebrow>
            <h1 className="mt-4 font-display text-[clamp(3rem,9vw,7.5rem)] uppercase leading-[0.82] tracking-[0.08em] text-[#f5dfb9]">
              SALIERI'S
              <br />
              HANDS
            </h1>
            <p className="mt-5 text-sm font-semibold uppercase tracking-[0.24em] text-[#d7b16a]">
              Vienna, 1791. Faith. Envy. Confession.
            </p>
            <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-300 lg:mx-0">
              A special off-series KAMDRIDI release from the forthcoming KAMDRIDI album TWICE UPON A TIME.
            </p>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:justify-center lg:justify-start">
              <GoldButton href={teaserUrl}>
                <Play className="h-4 w-4" />
                Watch Teaser
              </GoldButton>
              <GoldButton href="#tracklist" tone="ghost">
                <Radio className="h-4 w-4" />
                Tracklist
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.92fr_1.08fr]">
          <div className="relative min-h-[340px] overflow-hidden border border-[#8a642f]/35 bg-black">
            <Image
              src={`${assetBase}/vienna-walking-official.png`}
              alt="Vienna 1791 Salieri walking artwork"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 48vw"
            />
          </div>
          <div className="border border-[#8a642f]/35 bg-[#0b0705]/88 p-6 sm:p-8">
            <SectionHeading eyebrow="Confession" title="The hand that prayed and envied" />
            <p className="mt-6 text-sm leading-8 text-stone-300">
              SALIERI'S HANDS is framed as a dark baroque confession: the composer at the desk, the city outside,
              the candle burning down, and the score becoming testimony. It is not a checkout campaign. It is the
              release page for the album world, with streaming and collector updates held until final links exist.
            </p>
            <p className="mt-4 text-sm leading-8 text-stone-400">
              The presentation stays compact, editorial, and black-gold: official artwork first, story second,
              and every call to action limited to real teaser or coming-soon release information.
            </p>
          </div>
        </div>
      </section>

      <section id="tracklist" className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Complete tracklist" title="Main album and bonus works" />
          <div className="mt-7 grid gap-5 lg:grid-cols-[1fr_0.58fr]">
            <div className="border border-[#8a642f]/35 bg-black/55">
              {mainTracks.map((track, index) => (
                <div
                  key={track}
                  className="grid grid-cols-[54px_1fr] items-center border-b border-white/10 px-4 py-3 last:border-b-0"
                >
                  <span className="font-display text-2xl text-[#c99a52]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="text-sm font-semibold text-stone-100">{track}</span>
                </div>
              ))}
            </div>
            <div className="border border-[#8a642f]/35 bg-[#100b07]/82 p-5">
              <h3 className="text-xs font-bold uppercase tracking-[0.28em] text-[#d7b16a]">Bonus tracks</h3>
              <div className="mt-5 space-y-4">
                {bonusTracks.map((track, index) => (
                  <div key={track} className="grid grid-cols-[44px_1fr] gap-3">
                    <span className="font-display text-xl text-[#c99a52]">{index + 11}</span>
                    <span className="text-sm leading-6 text-stone-200">{track}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.72fr_1fr]">
          <div>
            <SectionHeading eyebrow="Collector edition" title="Physical campaign assets" />
            <p className="mt-5 text-sm leading-8 text-stone-400">
              Collector materials are in preparation. No payment, preorder, or fake checkout is connected.
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="relative aspect-[4/3] overflow-hidden border border-[#8a642f]/35 bg-black">
              <Image src={`${assetBase}/full-collector-pack.png`} alt="SALIERI'S HANDS collector pack" fill className="object-contain p-2" />
            </div>
            <div className="relative aspect-[4/3] overflow-hidden border border-[#8a642f]/35 bg-black">
              <Image src={`${assetBase}/pack-back-front-spine.png`} alt="SALIERI'S HANDS pack front back and spine" fill className="object-contain p-2" />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Editions" title="Release formats" />
          <div className="mt-7 grid gap-5 md:grid-cols-3">
            {editions.map((edition) => (
              <article key={edition.title} className="border border-[#8a642f]/35 bg-black/55">
                <div className="relative aspect-[4/3] border-b border-white/10 bg-[#0b0705]">
                  <Image src={edition.image} alt={edition.title} fill className="object-contain p-3" />
                </div>
                <div className="p-5">
                  <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#c99a52]">{edition.status}</p>
                  <h3 className="mt-3 font-display text-2xl uppercase tracking-[0.08em] text-[#f3d8a7]">
                    {edition.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-stone-400">{edition.text}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto max-w-7xl">
          <SectionHeading eyebrow="Merch / collector" title="In preparation" />
          <div className="mt-7 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {merchItems.map((item) => (
              <article key={item.title} className="border border-[#8a642f]/35 bg-black/55">
                <div className="relative aspect-square bg-[#080503]">
                  <Image src={item.image} alt={`SALIERI'S HANDS ${item.title}`} fill className="object-contain p-4" />
                </div>
                <div className="border-t border-white/10 p-4">
                  <h3 className="text-sm font-bold uppercase tracking-[0.18em] text-stone-100">{item.title}</h3>
                  <p className="mt-2 text-xs uppercase tracking-[0.18em] text-[#c99a52]">Coming soon</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="relative min-h-[330px] overflow-hidden border border-[#8a642f]/35 bg-black">
            <Image src={`${assetBase}/opera-teaser.png`} alt="SALIERI'S HANDS teaser media artwork" fill className="object-cover" />
          </div>
          <div className="border border-[#8a642f]/35 bg-[#0b0705]/88 p-6 sm:p-8">
            <SectionHeading eyebrow="Official teaser" title="Watch the first signal" />
            <p className="mt-5 text-sm leading-8 text-stone-400">
              The teaser is the only live media link on this page until final platform links are confirmed.
            </p>
            <div className="mt-7">
              <GoldButton href={teaserUrl}>
                <ExternalLink className="h-4 w-4" />
                YouTube Teaser
              </GoldButton>
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#8a642f]/25 px-4 py-12 sm:px-6">
        <div className="mx-auto grid max-w-7xl gap-5 md:grid-cols-2">
          <div className="border border-[#8a642f]/35 bg-black/55 p-6">
            <SectionHeading eyebrow="Press / EPK" title="Release notes" />
            <p className="mt-5 text-sm leading-8 text-stone-400">
              Press materials, final cover copy, platform links, and extended EPK assets will be published as the
              July 2026 release campaign approaches.
            </p>
            <div className="mt-7">
              <Link
                href="/contact"
                className="inline-flex min-h-11 items-center gap-2 border border-[#b68b45]/55 px-5 py-3 text-xs font-bold uppercase tracking-[0.2em] text-[#f4deb8] transition hover:border-[#e4bd75]"
              >
                <Download className="h-4 w-4" />
                Press contact
              </Link>
            </div>
          </div>
          <div className="border border-[#8a642f]/35 bg-black/55 p-6">
            <SectionHeading eyebrow="Streaming / follow" title="Coming soon" />
            <div className="mt-6 grid gap-3 text-sm">
              {["Spotify", "Apple Music", "Amazon Music", "Instagram"].map((platform) => (
                <div key={platform} className="flex items-center justify-between border border-white/10 bg-[#0b0705] px-4 py-3">
                  <span className="font-semibold text-stone-100">{platform}</span>
                  <span className="text-xs uppercase tracking-[0.2em] text-[#c99a52]">Coming soon</span>
                </div>
              ))}
            </div>
            <p className="mt-5 flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-stone-500">
              <Sparkles className="h-4 w-4 text-[#c99a52]" />
              No fake streaming, payment, or preorder links are connected.
            </p>
          </div>
        </div>
      </section>

      <section className="px-4 py-12 text-center sm:px-6">
        <p className="text-xs font-bold uppercase tracking-[0.32em] text-[#c99a52]">Release update</p>
        <h2 className="mx-auto mt-3 max-w-4xl font-display text-3xl uppercase tracking-[0.1em] text-[#f3d8a7] sm:text-5xl">
          SALIERI'S HANDS arrives July 2026
        </h2>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-400">
          A special off-series KAMDRIDI release from TWICE UPON A TIME.
        </p>
      </section>
    </main>
  );
}
