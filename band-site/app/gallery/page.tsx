"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import historySpriteBase64 from "@/data/history-gallery/chunk1";

const archiveFrames = [
  { id: "02", title: "Drums", position: "0% 0%" },
  { id: "03", title: "Studio Acoustic", position: "100% 0%" },
  { id: "04", title: "Acoustic Close", position: "0% 50%" },
  { id: "05", title: "Rehearsal Room", position: "100% 50%" },
  { id: "06", title: "Bass", position: "0% 100%" },
  { id: "07", title: "Mirror / Backstage", position: "100% 100%" },
];

export default function GalleryPage() {
  const [coverSrc, setCoverSrc] = useState<string>("");
  const spriteSrc = useMemo(
    () => `data:image/jpeg;base64,${historySpriteBase64}`,
    []
  );

  useEffect(() => {
    let active = true;
    fetch("/assets/images/gallery/history/cover.jpg.b64")
      .then((response) => {
        if (!response.ok) throw new Error("Gallery cover unavailable");
        return response.text();
      })
      .then((text) => {
        if (active) setCoverSrc(`data:image/jpeg;base64,${text.trim()}`);
      })
      .catch(() => {
        if (active) setCoverSrc("");
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <main className="min-h-screen bg-[#050505] text-white">
      <section className="mx-auto max-w-7xl px-5 pb-10 pt-28 md:px-8 md:pt-32">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Photo Gallery — Review 01</p>
        <h1 className="mt-5 max-w-5xl font-display text-5xl uppercase tracking-[0.05em] md:text-7xl">
          30+ Years In The Making
        </h1>
        <p className="mt-4 text-xl uppercase tracking-[0.18em] text-stone-400 md:text-2xl">
          Echoes Unearthed
        </p>
        <p className="mt-7 max-w-3xl text-sm leading-7 text-stone-400 md:text-base">
          First review set. Every image is numbered so the gallery can be controlled precisely before more photos are added.
        </p>
        <div className="mt-7 flex flex-wrap gap-3">
          <Link
            href="/media"
            className="rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.22em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
          >
            Back to Media
          </Link>
          <a
            href="#gallery-grid"
            className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.22em] text-black transition hover:bg-[#ffd989]"
          >
            Review Photos
          </a>
        </div>
      </section>

      <section id="gallery-grid" className="mx-auto max-w-7xl px-5 pb-24 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          <article className="overflow-hidden rounded-[28px] border border-[#f4c66a]/30 bg-[#0b0b0b] lg:row-span-2">
            <div className="relative min-h-[560px] h-full bg-black">
              {coverSrc ? (
                <img
                  src={coverSrc}
                  alt="Live from Tangier, Morocco Festival"
                  className="absolute inset-0 h-full w-full object-contain"
                />
              ) : (
                <div className="absolute inset-0 grid place-items-center text-xs uppercase tracking-[0.25em] text-stone-600">
                  Loading 01
                </div>
              )}
            </div>
            <div className="border-t border-white/10 p-5">
              <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">01 — Live</p>
              <h2 className="mt-2 text-lg uppercase tracking-[0.08em] text-white">Tangier, Morocco Festival</h2>
            </div>
          </article>

          {archiveFrames.map((frame) => (
            <article
              key={frame.id}
              className="overflow-hidden rounded-[28px] border border-white/10 bg-[#0b0b0b] transition hover:-translate-y-1 hover:border-[#f4c66a]/35"
            >
              <div
                className="aspect-square w-full bg-black bg-no-repeat"
                style={{
                  backgroundImage: `url(${spriteSrc})`,
                  backgroundSize: "200% 300%",
                  backgroundPosition: frame.position,
                }}
                role="img"
                aria-label={frame.title}
              />
              <div className="border-t border-white/10 p-5">
                <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{frame.id} — Archive</p>
                <h2 className="mt-2 text-base uppercase tracking-[0.08em] text-white">{frame.title}</h2>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-10 rounded-[28px] border border-white/10 bg-white/[0.03] p-6 text-sm leading-7 text-stone-400">
          Review mode: use the numbers 01–07 to decide what stays, what is removed, and the order. More photos can be added only after this first set is approved.
        </div>
      </section>
    </main>
  );
}
