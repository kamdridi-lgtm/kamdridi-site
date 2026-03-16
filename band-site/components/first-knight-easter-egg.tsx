"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

export function FirstKnightEasterEgg() {
  const [showKnight, setShowKnight] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const triggerTimer = window.setTimeout(() => {
      document.body.classList.add("earthquake");
      setShowKnight(true);

      window.setTimeout(() => {
        document.body.classList.remove("earthquake");
      }, 2200);
    }, 60000);

    return () => {
      window.clearTimeout(triggerTimer);
      document.body.classList.remove("earthquake");
      audioRef.current?.pause();
    };
  }, []);

  async function playTransmission() {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.volume = 0.6;

    try {
      await audioRef.current.play();
      setIsPlaying(true);
    } catch {
      setIsPlaying(false);
    }
  }

  if (!showKnight) {
    return <audio ref={audioRef} src="/the-fall-of-the-first-knight.wav" preload="none" />;
  }

  return (
    <>
      <audio ref={audioRef} src="/the-fall-of-the-first-knight.wav" preload="none" />
      <div className="fixed inset-0 z-[3000] flex items-center justify-center bg-black/80 px-4 py-8 backdrop-blur-sm">
        <div className="archive-glow relative w-full max-w-3xl overflow-hidden rounded-[32px] border border-[#f4c66a]/20 bg-[#060606]">
          <div className="grid gap-0 md:grid-cols-[0.9fr_1.1fr]">
            <div className="relative min-h-[360px]">
              <Image
                src="/first-knight.jpg"
                alt="The Fall of the First Knight"
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.12),rgba(0,0,0,0.74))]" />
            </div>
            <div className="flex flex-col justify-center p-6 sm:p-8">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                TRANSMISSION DETECTED
              </p>
              <p className="mt-3 text-xs uppercase tracking-[0.35em] text-stone-500">
                ARCHIVE NODE // KNIGHT_01
              </p>
              <h2 className="mt-6 font-display text-4xl uppercase tracking-[0.08em] text-white sm:text-5xl">
                THE FALL OF THE FIRST KNIGHT
              </h2>
              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  type="button"
                  onClick={() => void playTransmission()}
                  className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-3 text-xs uppercase tracking-[0.25em] text-black transition duration-300 hover:-translate-y-0.5 hover:bg-[#ffd989]"
                >
                  {isPlaying ? "PLAYING" : "PLAY TRANSMISSION"}
                </button>
                <Link
                  href="/store"
                  className="inline-flex items-center justify-center rounded-full border border-white/15 px-6 py-3 text-xs uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/60 hover:text-[#f4c66a]"
                >
                  ENTER THE ARMORY
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
