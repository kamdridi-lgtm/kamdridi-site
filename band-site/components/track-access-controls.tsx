"use client";

import { LockKeyhole, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

const PREVIEW_LIMIT_SECONDS = 36;
let activePreview: HTMLAudioElement | null = null;

const themeClasses = {
  gold: {
    preview: "border-[#d9aa62]/55 bg-[#d9aa62]/10 text-[#ffe2ad] hover:border-[#ffd98b] hover:bg-[#d9aa62]/18",
    locked: "border-[#d9aa62]/35 bg-black/35 text-[#d9aa62]",
  },
  red: {
    preview: "border-[#ff4b36]/60 bg-[#b51f16]/18 text-[#ffb09d] hover:border-[#ff735f] hover:bg-[#b51f16]/28",
    locked: "border-[#ff4b36]/35 bg-black/35 text-[#ff6d49]",
  },
  australia: {
    preview: "border-[#e5d1aa]/55 bg-[#e5d1aa]/10 text-[#fff0d2] hover:border-white hover:bg-[#e5d1aa]/18",
    locked: "border-[#e5d1aa]/35 bg-black/35 text-[#e5d1aa]",
  },
} as const;

type TrackAccessControlsProps = {
  previewSrc?: string;
  previewLabel: string;
  previewPendingLabel: string;
  fullTrackLabel: string;
  theme?: keyof typeof themeClasses;
};

export function TrackAccessControls({
  previewSrc,
  previewLabel,
  previewPendingLabel,
  fullTrackLabel,
  theme = "gold",
}: TrackAccessControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const styles = themeClasses[theme];
  const hasPreview = Boolean(previewSrc);

  const togglePreview = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (audio.currentTime >= PREVIEW_LIMIT_SECONDS) audio.currentTime = 0;
      if (activePreview && activePreview !== audio) activePreview.pause();
      activePreview = audio;
      void audio.play();
      return;
    }

    audio.pause();
  };

  const enforcePreviewLimit = () => {
    const audio = audioRef.current;
    if (!audio || audio.currentTime < PREVIEW_LIMIT_SECONDS) return;
    audio.pause();
    audio.currentTime = 0;
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.13em] sm:text-[10px]">
      <button
        type="button"
        onClick={togglePreview}
        disabled={!hasPreview}
        className={`inline-flex min-h-9 items-center gap-2 border px-3 py-2 transition disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/[0.03] disabled:text-stone-500 ${styles.preview}`}
        aria-label={hasPreview ? `${previewLabel} — 0:36` : previewPendingLabel}
        title={hasPreview ? `${previewLabel} — 36 seconds` : previewPendingLabel}
      >
        {isPlaying ? <Pause className="h-3.5 w-3.5" aria-hidden="true" /> : <Play className="h-3.5 w-3.5" aria-hidden="true" />}
        <span>{hasPreview ? previewLabel : previewPendingLabel}</span>
        <span aria-hidden="true" className="font-mono tracking-normal">0:36</span>
      </button>

      <span
        className={`inline-flex min-h-9 items-center gap-2 border px-3 py-2 ${styles.locked}`}
        aria-label={fullTrackLabel}
        title={fullTrackLabel}
        role="img"
      >
        <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
        {fullTrackLabel}
      </span>

      {previewSrc ? (
        <audio
          ref={audioRef}
          src={previewSrc}
          preload="metadata"
          onPlay={() => setIsPlaying(true)}
          onPause={() => {
            if (activePreview === audioRef.current) activePreview = null;
            setIsPlaying(false);
          }}
          onEnded={() => {
            if (activePreview === audioRef.current) activePreview = null;
            setIsPlaying(false);
          }}
          onTimeUpdate={enforcePreviewLimit}
        />
      ) : null}
    </div>
  );
}
