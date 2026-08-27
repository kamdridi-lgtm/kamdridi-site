import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Disc3, ShieldCheck } from "lucide-react";
import { EchoesUnearthedDirectSales } from "@/components/echoes-unearthed-direct-sales";

const cover = "/assets/images/releases/echoes-unearthed-cover.jpg";
const spotifyAlbumHref =
  "https://open.spotify.com/album/4rrOMu0BIhzJt1ElOfgXZu?si=a6eAct6jQl6BapO1_Zm4gA";

export const metadata: Metadata = {
  title: "Echoes Unearthed — Direct HD Album",
  description:
    "Buy ECHOES UNEARTHED directly from KAM DRIDI: nine verified 24-bit / 48 kHz WAV tracks, individual track purchases, and direct artist support.",
  openGraph: {
    title: "KAM DRIDI — Echoes Unearthed",
    description:
      "Nine-track HD digital album. Buy the album or individual tracks directly from KAM DRIDI.",
    images: [cover]
  }
};

export default function EchoesUnearthedReleasePage() {
  return (
    <main className="min-h-screen bg-[#050403] text-white">
      <section className="relative overflow-hidden border-b border-[#a86225]/25">
        <div className="pointer-events-none absolute inset-0">
          <Image
            src={cover}
            alt=""
            fill
            priority
            className="object-cover opacity-[0.12] blur-2xl scale-110"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(244,198,106,0.16),transparent_30%),linear-gradient(180deg,rgba(5,4,3,0.5),#050403_82%)]" />
        </div>

        <div className="relative mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:py-16 lg:grid-cols-[0.78fr_1.22fr] lg:items-center">
          <div className="mx-auto w-full max-w-[520px]">
            <div className="relative aspect-square overflow-hidden border border-[#c98542]/30 bg-black shadow-[0_35px_100px_rgba(0,0,0,0.5)]">
              <Image
                src={cover}
                alt="KAM DRIDI — Echoes Unearthed album cover"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 1024px) 90vw, 42vw"
              />
            </div>
          </div>

          <div>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-stone-500 transition hover:text-[#f4c66a]"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              KAM DRIDI
            </Link>

            <p className="mt-8 text-xs font-bold uppercase tracking-[0.34em] text-[#c98542]">
              Official album · direct artist store
            </p>
            <h1 className="mt-4 font-display text-[clamp(3rem,7vw,6.6rem)] uppercase leading-[0.86] tracking-[0.06em] text-[#e8b777]">
              Echoes Unearthed
            </h1>
            <p className="mt-6 max-w-3xl text-base leading-8 text-stone-300">
              The complete nine-track digital programme is available directly from KAM DRIDI
              as verified 24-bit / 48 kHz WAV masters. Buy the complete album or choose any
              track individually.
            </p>

            <div className="mt-7 grid gap-3 sm:grid-cols-3">
              <div className="border border-white/10 bg-black/45 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Digital album</p>
                <p className="mt-2 text-xl font-bold text-white">9 tracks · CA$16</p>
              </div>
              <div className="border border-white/10 bg-black/45 p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Single track</p>
                <p className="mt-2 text-xl font-bold text-white">CA$2.99</p>
              </div>
              <div className="border border-[#f4c66a]/25 bg-[#f4c66a]/[0.06] p-4">
                <p className="text-[10px] uppercase tracking-[0.22em] text-[#f4c66a]">Track buyer upgrade</p>
                <p className="mt-2 text-xl font-bold text-white">−20% · CA$12.80</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap gap-3">
              <a
                href="#buy"
                className="inline-flex min-h-12 items-center justify-center gap-2 bg-[#f4c66a] px-6 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#ffd989]"
              >
                <Disc3 className="h-4 w-4" />
                Buy direct
              </a>
              <a
                href={spotifyAlbumHref}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center border border-white/15 bg-black/45 px-6 py-3 text-xs font-bold uppercase tracking-[0.2em] text-stone-200 transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
              >
                Stream album
              </a>
            </div>

            <div className="mt-7 flex items-start gap-3 border-t border-white/10 pt-5 text-sm leading-7 text-stone-400">
              <ShieldCheck className="mt-1 h-4 w-4 shrink-0 text-[#f4c66a]" />
              <p>
                Secure Stripe checkout. Digital purchases are delivered to the email used at
                checkout. <strong className="text-stone-200">Echoes of Our Youth</strong> is
                reserved for the physical edition and is not included in the nine-track digital album.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section id="buy" className="px-4 py-12 sm:px-6 md:py-16">
        <EchoesUnearthedDirectSales returnPath="/releases/echoes-unearthed" />
      </section>

      <section className="border-t border-[#a86225]/20 px-4 py-10 text-center sm:px-6">
        <p className="text-xs uppercase tracking-[0.28em] text-[#c98542]">Direct support</p>
        <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-stone-400">
          Every direct purchase supports KAM DRIDI independently and enters the same verified
          customer-care and delivery system used by the official KAM DRIDI store.
        </p>
      </section>
    </main>
  );
}
