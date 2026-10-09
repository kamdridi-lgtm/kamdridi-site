"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
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

  useEffect(() => {
    function handleKeydown(event: KeyboardEvent) {
      if (event.key === "ArrowLeft") {
        previous();
      }

      if (event.key === "ArrowRight") {
        next();
      }
    }

    window.addEventListener("keydown", handleKeydown);
    return () => window.removeEventListener("keydown", handleKeydown);
  }, []);

  return (
    <div id="comic-reader" className="grid gap-6 lg:grid-cols-[minmax(0,1.15fr)_420px]">
      <GlassCard className="overflow-hidden p-0">
        <div className="relative aspect-[4/5] w-full bg-[#070504] md:aspect-[16/11] lg:aspect-[4/5]">
          <Image
            src={page.image}
            alt={page.title}
            fill
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-contain"
            priority={pageIndex === 0}
          />
          <button
            type="button"
            onClick={previous}
            aria-label="Previous comic page"
            className="absolute left-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur transition hover:border-[#f4c66a]/70 hover:text-[#f4c66a]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            onClick={next}
            aria-label="Next comic page"
            className="absolute right-3 top-1/2 flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-white/15 bg-black/65 text-white backdrop-blur transition hover:border-[#f4c66a]/70 hover:text-[#f4c66a]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
          <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,transparent,rgba(0,0,0,0.92))] p-5 md:p-7">
            <div className="flex items-center justify-between gap-4">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">{page.title}</p>
              <p className="text-xs uppercase tracking-[0.25em] text-stone-400">
                {pageIndex + 1}/{comicPages.length}
              </p>
            </div>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-stone-200">{page.caption}</p>
          </div>
        </div>
      </GlassCard>

      <GlassCard className="flex flex-col justify-between rounded-lg">
        <div>
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Who is Kam Dridi</p>
            <p className="text-xs uppercase tracking-[0.25em] text-stone-500">Reader</p>
          </div>
          <h2 className="mt-4 font-display text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
            {page.caption}
          </h2>
          <div className="mt-6 h-1 overflow-hidden rounded-full bg-white/10">
            <div
              className="h-full bg-[#f4c66a] transition-all duration-300"
              style={{ width: `${((pageIndex + 1) / comicPages.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="mt-8 grid gap-5">
          <div className="grid grid-cols-5 gap-2 lg:grid-cols-1">
            {comicPages.map((entry, index) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setPageIndex(index)}
                className={`group grid overflow-hidden rounded-lg border text-left transition lg:grid-cols-[86px_1fr] ${
                  index === pageIndex
                    ? "border-[#f4c66a]/70 bg-[#f4c66a]/10 text-white"
                    : "border-white/10 bg-black/25 text-stone-400 hover:border-white/25 hover:text-white"
                }`}
              >
                <span className="relative block aspect-[3/4] bg-black lg:aspect-square">
                  <Image
                    src={entry.image}
                    alt={entry.title}
                    fill
                    sizes="90px"
                    className="object-cover transition duration-300 group-hover:scale-110"
                  />
                  <span className="absolute inset-0 bg-black/15" />
                </span>
                <span className="hidden min-w-0 p-3 lg:block">
                  <span className="block text-xs uppercase tracking-[0.3em]">{entry.title}</span>
                  <span className="mt-2 block text-xs leading-5 text-stone-400">{entry.caption}</span>
                </span>
              </button>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              onClick={previous}
              className="inline-flex items-center justify-center rounded-full border border-white/15 px-5 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
            >
              <ChevronLeft className="mr-2 h-4 w-4" />
              Previous
            </button>
            <button
              type="button"
              onClick={next}
              className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
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
