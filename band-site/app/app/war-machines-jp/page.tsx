import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Music2 } from "lucide-react";
import { streamingLinks } from "@/data/site";

export const metadata: Metadata = {
  title: "War Machines / ウォー・マシーンズ",
  description: "Official Japanese campaign page for War Machines and the Echoes Unearthed universe."
};

export default function WarMachinesJapanPage() {
  return (
    <main className="relative overflow-hidden bg-[#050403] text-white">
      <div className="absolute inset-0">
        <Image
          src="/assets/images/releases/war-machines-cover.png"
          alt=""
          fill
          priority
          className="object-cover opacity-24"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(5,4,3,0.96),rgba(5,4,3,0.72),rgba(5,4,3,0.96)),radial-gradient(circle_at_70%_70%,rgba(190,24,24,0.34),transparent_36%)]" />
      </div>

      <section className="relative mx-auto grid min-h-[calc(100svh-120px)] max-w-7xl items-center gap-8 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_0.85fr]">
        <div>
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.24em] text-stone-400 transition hover:text-[#f4c66a]"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Album Hub
          </Link>
          <p className="mt-10 text-xs uppercase tracking-[0.38em] text-[#d47b2f]">Japan Campaign</p>
          <h1 className="mt-5 font-display text-5xl uppercase leading-[0.9] tracking-[0.08em] text-stone-100 sm:text-7xl">
            War Machines
            <br />
            ウォー・マシーンズ
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-stone-200">
            Official Japanese campaign page for War Machines and the Echoes Unearthed universe.
          </p>
          <p className="mt-3 text-base text-stone-400">ダークで映画的なSFロック。</p>
          <div className="mt-9 flex flex-wrap gap-3">
            {streamingLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target="_blank"
                rel="noreferrer"
                className="inline-flex min-h-12 items-center justify-center gap-2 border border-[#c57b32]/45 bg-black/45 px-5 py-3 text-xs font-semibold uppercase tracking-[0.18em] text-stone-100 transition hover:border-[#f4c66a]/70 hover:text-[#f4c66a]"
              >
                <Music2 className="h-4 w-4" />
                {link.label}
              </a>
            ))}
          </div>
        </div>

        <div className="relative mx-auto aspect-square w-full max-w-md border border-[#d08a43]/35 bg-black shadow-[0_35px_120px_rgba(0,0,0,0.68)]">
          <Image
            src="/assets/images/releases/war-machines-cover.png"
            alt="War Machines cover"
            fill
            className="object-cover"
          />
        </div>
      </section>
    </main>
  );
}
