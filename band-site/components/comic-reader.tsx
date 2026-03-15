"use client";

import Image from "next/image";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { comicPages } from "@/data/site";
import { GlassCard } from "@/components/ui";

export function ComicReader() {
  const [pageIndex, setPageIndex] = useState(0);
  const page = comicPages[pageIndex];

  function previous() {
    setPageIndex((current) => (current === 0 ? comicPages.length - 1 : current - 1));
  }

  function next() {
    setPageIndex((current) => (current === comicPages.length - 1 ? 0 : current + 1));
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
      <GlassCard id="comic-reader" className="overflow-hidden p-0">
        <div className="relative aspect-[4/5] w-full bg-black">
          <Image src={page.image} alt={page.title} fill className="object-cover" />
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.85))] p-6">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{page.title}</p>
            <p className="mt-3 text-sm leading-7 text-stone-300">{page.caption}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Who is Kam Dridi</p>
          <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
            Comic reader
          </h2>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            Navigate the pages like an archive viewer. The reader is responsive, touch-friendly,
            and ready for the final comic assets when they are dropped into the project.
          </p>
        </div>

        <div className="mt-8 grid gap-4">
          <div className="grid gap-2">
            {comicPages.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPageIndex(index)}
                className={`rounded-2xl border px-4 py-4 text-left transition ${
                  index === pageIndex
                    ? "border-[#f4c66a]/50 bg-[#f4c66a]/10 text-white"
                    : "border-white/10 bg-black/20 text-stone-400 hover:border-white/20 hover:text-white"
                }`}
              >
                <p className="text-xs uppercase tracking-[0.35em]">{entry.title}</p>
                <p className="mt-2 text-sm leading-6">{entry.caption}</p>
              </button>
            ))}
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={previous}
              className="inline-flex items-center rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
            >
              Next
              <ChevronRight className="ml-2 h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
