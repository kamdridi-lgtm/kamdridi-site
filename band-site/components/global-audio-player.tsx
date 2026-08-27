"use client";

import { useEffect, useState } from "react";
import { useAudio } from "./providers/audio-provider";

export function GlobalAudioPlayer() {
  const { isPlaying, togglePlay, currentTrack } = useAudio();
  const [show, setShow] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show when scrolling down more than 100px
      if (window.scrollY > 100) {
        setShow(true);
      } else {
        setShow(false);
      }
    };
    
    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Check initial scroll position
    
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div 
      className={`fixed bottom-5 right-5 z-[9998] flex items-center gap-3 rounded-full border border-[#f4c66a]/30 bg-black/60 px-4 py-2 backdrop-blur-md transition-all duration-500 hover:border-[#f4c66a]/80 ${
        show ? "translate-x-0 opacity-100" : "translate-x-[150%] opacity-0"
      }`}
    >
      <button
        onClick={togglePlay}
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
        <span translate="no" className="notranslate text-xs font-medium text-white truncate max-w-[120px]">
          {currentTrack?.title || "No Track"}
        </span>
      </div>
    </div>
  );
}
