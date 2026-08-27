import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AustraliaParallaxBackground } from "@/components/australia-parallax-background";
import { TrackAccessControls } from "@/components/track-access-controls";
import { getPreparedPreview } from "@/lib/master-catalog";

export const metadata: Metadata = {
  title: "17 FOR EVER — Australia",
  description:
    "KAMDRIDI presents 17 FOR EVER, the limited-edition Australian maxi single arriving for the Australian summer in January 2027.",
  openGraph: {
    title: "17 FOR EVER — Australia | KAMDRIDI",
    description:
      "Four versions. One song that never left. The Australian collector campaign begins January 2027.",
    images: [
      {
        url: "/australia/17-for-ever-hero-wide.webp",
        width: 1672,
        height: 941,
        alt: "KAMDRIDI Australia — 17 FOR EVER Limited Edition Maxi Single"
      }
    ]
  }
};

const tracks = [
  { number: "01", title: "17 FOR EVER", version: "Exclusive Australian Version", previewSrc: getPreparedPreview("australia-01-exclusive") },
  { number: "02", title: "17 FOR EVER", version: "Different Mix / Album Version", previewSrc: getPreparedPreview("australia-02-album-mix") },
  { number: "03", title: "17 FOR EVER", version: "Unplugged — UN LIVE IN BRASIL / Night #2 Version", previewSrc: getPreparedPreview("australia-03-unlive-night-two") },
  { number: "04", title: "17 FOR EVER", version: "Demo Version", previewSrc: getPreparedPreview("australia-04-demo") }
];

function ArtworkCard({
  src,
  alt,
  title,
  subtitle,
  aspect = "aspect-square"
}: {
  src: string;
  alt: string;
  title: string;
  subtitle: string;
  aspect?: string;
}) {
  return (
    <figure className="overflow-hidden rounded-[1.75rem] border border-white/20 bg-black/70 shadow-[0_28px_80px_rgba(0,0,0,.5)] backdrop-blur-[2px]">
      <div className={`relative ${aspect} overflow-hidden bg-black/75`}>
        <Image
          src={src}
          alt={alt}
          fill
          sizes="(max-width: 768px) 100vw, 50vw"
          className="object-contain transition duration-700 hover:scale-[1.015]"
        />
      </div>
      <figcaption className="border-t border-white/15 bg-black/78 px-5 py-4">
        <p className="text-sm font-black uppercase tracking-[0.18em] text-white">{title}</p>
        <p className="mt-1 text-xs uppercase tracking-[0.16em] text-stone-400">{subtitle}</p>
      </figcaption>
    </figure>
  );
}

export default function AustraliaPage() {
  return (
    <main className="min-h-screen overflow-x-clip bg-black text-white">
      <section aria-label="17 FOR EVER campaign artwork" className="relative w-full bg-black">
        <div className="relative aspect-[1672/941] w-full">
          <Image
            src="/australia/17-for-ever-hero-wide.webp"
            alt="KAMDRIDI Australia — 17 FOR EVER Limited Edition Maxi Single"
            fill
            priority
            sizes="100vw"
            className="object-cover"
          />
        </div>
      </section>

      <div className="relative isolate bg-[#151515]">
        <AustraliaParallaxBackground />

        <div className="relative z-10 mx-auto max-w-[1280px] border-x border-white/10 bg-black/20 shadow-[0_0_100px_rgba(0,0,0,.9)]">
          <div className="border-y border-white/15 bg-black/72 backdrop-blur-md">
            <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-5 px-5 py-6 sm:px-8 lg:flex-row">
              <div className="text-center lg:text-left">
                <p className="text-[11px] font-black uppercase tracking-[0.36em] text-[#e5d1aa]">
                  Australian Summer Campaign
                </p>
                <p className="mt-2 text-2xl font-black uppercase tracking-[0.16em] text-white sm:text-3xl">
                  January 2027
                </p>
              </div>
              <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
                <Link
                  href="#edition"
                  className="rounded-full border border-white/30 bg-black/35 px-7 py-3.5 text-center text-xs font-black uppercase tracking-[0.22em] text-white transition hover:border-[#e5d1aa] hover:text-[#e5d1aa]"
                >
                  Explore the edition
                </Link>
                <Link
                  href="/store?filter=australia-17-for-ever#17-for-ever-maxi-single"
                  className="rounded-full bg-[#e5d1aa] px-8 py-3.5 text-center text-xs font-black uppercase tracking-[0.22em] text-[#05070b] shadow-[0_0_34px_rgba(229,209,170,.22)] transition hover:bg-white"
                >
                  Collector editions
                </Link>
              </div>
            </div>
          </div>

          <div className="bg-black/[0.08] backdrop-blur-[1px]">
          <section className="mx-auto grid max-w-6xl gap-7 px-5 py-20 sm:px-8 md:py-28 lg:grid-cols-[1fr_310px] lg:items-stretch">
            <div className="rounded-[2rem] border border-white/20 bg-black/68 p-7 shadow-2xl backdrop-blur-[2px] sm:p-10">
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e5d1aa]">Four versions. One story.</p>
              <h1 translate="no" className="notranslate mt-5 font-display text-5xl uppercase leading-[0.92] tracking-[0.06em] sm:text-7xl">
                17 FOR EVER
              </h1>
              <p className="mt-6 max-w-3xl text-base leading-8 text-stone-200 sm:text-lg">
                A song built from teenage memories, first demos and the nights that changed everything.
                For the Australian summer, KAMDRIDI opens the archive and brings every chapter together in
                one limited maxi single.
              </p>
              <div className="mt-8 flex flex-wrap gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-stone-200">
                <span className="rounded-full border border-[#bd1824]/60 bg-[#bd1824]/15 px-4 py-2">Limited edition</span>
                <span className="rounded-full border border-[#2e5f9b]/70 bg-[#2e5f9b]/15 px-4 py-2">Australian exclusive</span>
                <span className="rounded-full border border-white/20 bg-white/5 px-4 py-2">Maxi single</span>
              </div>
            </div>

            <aside className="flex flex-col justify-between rounded-[2rem] border border-[#e5d1aa]/45 bg-black/68 p-7 text-center shadow-2xl backdrop-blur-[2px] sm:p-9">
              <p className="text-[11px] font-black uppercase tracking-[0.34em] text-[#e5d1aa]">Launch window</p>
              <div className="my-8">
                <p className="font-display text-7xl leading-none text-white">01</p>
                <p className="mt-2 text-2xl font-black uppercase tracking-[0.22em] text-white">2027</p>
              </div>
              <p className="text-xs uppercase leading-6 tracking-[0.22em] text-stone-400">
                January<br />Australian summer
              </p>
            </aside>
          </section>

          <section className="mx-auto max-w-5xl px-5 pb-20 sm:px-8 md:pb-28">
            <div className="rounded-[2rem] border border-white/20 bg-black/70 p-7 shadow-2xl backdrop-blur-[2px] sm:p-10 lg:p-12">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e5d1aa]">The Australian tracklist</p>
                <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.06em] sm:text-5xl">Every life of the song</h2>
                <p className="mt-5 text-sm leading-7 text-stone-300">
                  Every 36-second preview stays free. The lock applies only to the complete track.
                </p>
                <div className="mt-8 divide-y divide-white/12 border-y border-white/12">
                  {tracks.map((track) => (
                    <article key={track.number} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-x-4 gap-y-3 py-5 lg:grid-cols-[48px_minmax(0,1fr)_auto]">
                      <span className="font-display text-2xl text-[#e5d1aa]">{track.number}</span>
                      <div>
                        <h3 translate="no" className="notranslate text-sm font-black tracking-[0.11em] text-white">{track.title}</h3>
                        <p className="mt-1.5 text-sm leading-6 text-stone-300">{track.version}</p>
                      </div>
                      <div className="col-start-2 lg:col-start-auto">
                        <TrackAccessControls
                          previewSrc={track.previewSrc ?? undefined}
                          previewLabel="Free preview"
                          previewPendingLabel="Preview after mastering"
                          fullTrackLabel="Full track locked"
                          theme="australia"
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <section id="edition" className="mx-auto max-w-6xl scroll-mt-40 px-5 pb-20 sm:px-8 md:pb-28">
            <div className="mb-10 rounded-[2rem] border border-white/20 bg-black/68 px-7 py-8 text-center shadow-2xl backdrop-blur-[2px] sm:px-10">
              <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e5d1aa]">Explore the edition</p>
              <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.07em] sm:text-6xl">Built to be held</h2>
              <p className="mx-auto mt-5 max-w-2xl text-base leading-8 text-stone-300">
                The complete physical world of 17 FOR EVER — artwork, disc, booklet, studio memories and
                the special collector cassette.
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              <ArtworkCard
                src="/australia/17-for-ever-front-cover.webp"
                alt="17 FOR EVER limited maxi single front cover"
                title="Limited Maxi Single"
                subtitle="Australian front cover"
              />
              <ArtworkCard
                src="/australia/17-for-ever-cassette-mockup.webp"
                alt="17 FOR EVER special cassette collector edition"
                title="Special Cassette Edition"
                subtitle="Limited collector release"
              />
              <ArtworkCard
                src="/australia/17-for-ever-disc.webp"
                alt="17 FOR EVER limited edition compact disc artwork"
                title="Limited Edition CD"
                subtitle="Australian disc face"
              />
              <ArtworkCard
                src="/australia/17-for-ever-tray-card.webp"
                alt="17 FOR EVER CD tray card and four-version tracklist"
                title="The Four Versions"
                subtitle="Tray card and complete tracklist"
                aspect="aspect-[1772/1385]"
              />
            </div>

            <div className="mt-6 grid gap-6 md:grid-cols-2">
              <ArtworkCard
                src="/australia/17-for-ever-scrapbook.webp"
                alt="17 FOR EVER scrapbook booklet artwork"
                title="Summer of ’01"
                subtitle="Scrapbook page"
              />
              <ArtworkCard
                src="/australia/17-for-ever-studio.webp"
                alt="17 FOR EVER studio booklet artwork"
                title="Inside the Studio"
                subtitle="The song behind the release"
              />
            </div>
          </section>

          <section className="mx-auto max-w-6xl px-5 pb-24 sm:px-8 md:pb-32">
            <div className="grid overflow-hidden rounded-[2rem] border border-[#e5d1aa]/40 bg-black/70 shadow-[0_35px_100px_rgba(0,0,0,.6)] backdrop-blur-[2px] lg:grid-cols-[minmax(0,.72fr)_minmax(0,1.28fr)]">
              <div className="flex flex-col justify-center border-b border-white/15 p-8 sm:p-11 lg:border-b-0 lg:border-r lg:p-12">
                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e5d1aa]">January 2027</p>
                <div className="mt-7 grid gap-3 text-xs font-black uppercase tracking-[0.2em] text-white">
                  <Link
                    href="/store#17-for-ever-limited-cd"
                    className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 transition hover:border-[#e5d1aa] hover:text-[#e5d1aa]"
                  >
                    Limited Edition CD · Made to order · CA$39
                  </Link>
                  <Link
                    href="/store#17-for-ever-maxi-single"
                    className="rounded-full border border-[#e5d1aa]/70 bg-[#e5d1aa]/12 px-5 py-3 text-[#f5dfb7] transition hover:bg-[#e5d1aa] hover:text-black"
                  >
                    12-inch Collector Maxi · Made to order · CA$159
                  </Link>
                  <Link
                    href="/store#17-for-ever-special-cassette"
                    className="rounded-full border border-white/20 bg-white/[0.06] px-5 py-3 transition hover:border-[#e5d1aa] hover:text-[#e5d1aa]"
                  >
                    Special Cassette · Made to order · CA$49
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-center p-8 sm:p-11 lg:p-14">
                <p className="text-xs font-black uppercase tracking-[0.34em] text-[#e5d1aa]">The Australian drop</p>
                <h2 className="mt-5 font-display text-5xl uppercase leading-[0.94] tracking-[0.05em]">Own the memory</h2>
                <p className="mt-6 text-base leading-8 text-stone-300">
                  The CD, 12-inch collector maxi and special cassette are made to order after payment. Production and delivery can take several weeks. Supplier submission remains manual; no supplier order is placed automatically.
                </p>
                <Link
                  href="/store?filter=australia-17-for-ever#17-for-ever-maxi-single"
                  className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#e5d1aa] px-8 py-4 text-center text-xs font-black uppercase tracking-[0.23em] text-black transition hover:bg-white sm:w-auto"
                >
                  Order collector editions
                </Link>
              </div>
            </div>
          </section>
          </div>
        </div>
      </div>

      <section className="relative isolate overflow-hidden border-t border-white/10 bg-[#020306] px-5 py-28 text-center sm:px-8 md:py-40">
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_50%_50%,rgba(42,58,96,.22),transparent_38%),radial-gradient(circle_at_45%_70%,rgba(117,20,28,.18),transparent_34%)]" />
        <p className="text-xs font-black uppercase tracking-[0.42em] text-[#e5d1aa]">After 17 FOR EVER</p>
        <p className="mt-7 text-xs uppercase tracking-[0.32em] text-stone-500">Official Album II</p>
        <h2 translate="no" className="notranslate mx-auto mt-5 max-w-5xl font-display text-5xl uppercase leading-none tracking-[0.06em] text-white sm:text-7xl md:text-8xl">
          TWICE UPON A TIME
        </h2>
        <div className="mx-auto mt-8 h-px w-28 bg-gradient-to-r from-transparent via-[#e5d1aa] to-transparent" />
        <p className="mx-auto mt-8 max-w-xl text-base leading-8 text-stone-400">
          The second official KAMDRIDI album. The next chapter begins after the Australian summer.
        </p>
      </section>
    </main>
  );
}
