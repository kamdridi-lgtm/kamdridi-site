"use client";

import { useState, useRef, useEffect } from "react";

export function GlobalAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.play().catch(() => setIsPlaying(false));
      } else {
        audioRef.current.pause();
      }
    }
  }, [isPlaying]);

  return (
    <div className="fixed bottom-5 right-5 z-50 flex items-center gap-3 rounded-full border border-[#f4c66a]/30 bg-black/60 px-4 py-2 backdrop-blur-md transition-all hover:border-[#f4c66a]/80">
      <button
        onClick={() => setIsPlaying(!isPlaying)}
        className="flex h-8 w-8 items-center justify-center rounded-full bg-[#f4c66a] text-black transition-transform hover:scale-110 focus:outline-none"
        aria-label={isPlaying ? "Pause music" : "Play music"}
      >
        {isPlaying ? (
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
          </svg>
        ) : (
          <svg className="h-4 w-4 ml-1" fill="currentColor" viewBox="0 0 24 24">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
      
      <div className="flex flex-col">
        <span className="text-[10px] uppercase tracking-widest text-[#f4c66a]">
          Now Playing
        </span>
        <span className="text-xs font-medium text-white truncate max-w-[120px]">
          Too Fast Too Young
        </span>
      </div>

      <audio
        ref={audioRef}
        src="/assets/audio/too-fast-too-young.mp3"
        loop
        preload="none"
      />
    </div>
  );
}
