"use client";

import Link from "next/link";
import { useState } from "react";

type LiveTeaserVideoProps = {
  className?: string;
  compact?: boolean;
};

export function LiveTeaserVideo({ className = "", compact = false }: LiveTeaserVideoProps) {
  const [hasVideoError, setHasVideoError] = useState(false);

  return (
    <section className={`mx-auto max-w-7xl ${className}`}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-[#d9a95d]">Live performance teaser</p>
          {!compact ? (
            <p className="mt-2 max-w-2xl text-sm leading-7 text-stone-400">
              A short visual teaser from the world of Dust on the Altar.
            </p>
          ) : null}
        </div>
        <Link
          href="/iron-county-ghosts/music"
          className="rounded-full border border-[#d9a95d]/35 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-[#d9a95d] transition hover:border-[#d9a95d] hover:bg-[#d9a95d] hover:text-black"
        >
          Listen to Dust on the Altar
        </Link>
      </div>

      <div className="relative overflow-hidden rounded-[1.7rem] border border-[#d9a95d]/25 bg-[#080503] p-2 shadow-[0_35px_110px_rgba(0,0,0,.52)]">
        <div className="relative overflow-hidden rounded-[1.35rem] bg-black">
          {hasVideoError ? (
            <div className="relative aspect-video bg-black">
              <img
                src="/assets/images/label/iron-county-ghosts/band-stage-spotlight.png"
                alt="IRON COUNTY GHOSTS band preview"
                className="h-full w-full object-contain object-center"
              />
              <div className="absolute inset-0 flex items-center justify-center bg-black/62 p-6 text-center text-sm uppercase tracking-[0.18em] text-[#d9a95d]">
                Live performance teaser coming soon.
              </div>
            </div>
          ) : (
            <video
              className="aspect-video h-auto w-full bg-black object-contain object-center"
              src="/assets/video/iron-county-ghosts/iron-county-ghosts-live-teaser.mp4"
              poster="/assets/images/label/iron-county-ghosts/band-stage-spotlight.png"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="IRON COUNTY GHOSTS live performance teaser"
              onError={() => setHasVideoError(true)}
            >
              Live performance teaser coming soon.
            </video>
          )}

          {!hasVideoError ? (
            <div className="absolute inset-x-0 bottom-0 flex flex-col items-center gap-2 px-3 pb-3 sm:pb-5">
              <div className="pointer-events-none animate-[teaserFade_1.2s_ease-out_both] rounded-full border border-[#d9a95d]/25 bg-black/48 px-4 py-2 text-center shadow-[0_12px_38px_rgba(0,0,0,.45)] backdrop-blur-md sm:px-5">
                <p className="text-[10px] font-black uppercase tracking-[0.22em] text-white sm:text-xs">
                  <span className="text-[#d9a95d]">Dust on the Altar</span> - live teaser
                </p>
              </div>
            </div>
          ) : null}

          <noscript>
            <div className="absolute inset-0 flex items-center justify-center bg-black/82 p-6 text-center text-sm uppercase tracking-[0.18em] text-[#d9a95d]">
              Live performance teaser coming soon.
            </div>
          </noscript>
        </div>
      </div>
    </section>
  );
}
