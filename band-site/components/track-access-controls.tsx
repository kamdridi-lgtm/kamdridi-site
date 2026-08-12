"use client";

import { LockKeyhole, Pause, Play } from "lucide-react";
import { useRef, useState } from "react";

const PREVIEW_LIMIT_SECONDS = 36;
let activePreview: HTMLAudioElement | null = null;

function formatPreviewTime(seconds: number) {
  const safeSeconds = Math.max(0, Math.min(PREVIEW_LIMIT_SECONDS, Math.floor(seconds)));
  const minutes = Math.floor(safeSeconds / 60);
  return `${minutes}:${String(safeSeconds % 60).padStart(2, "0")}`;
}

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
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const styles = themeClasses[theme];
  const hasPreview = Boolean(previewSrc);

  const togglePreview = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      if (audio.currentTime >= PREVIEW_LIMIT_SECONDS || elapsedSeconds >= PREVIEW_LIMIT_SECONDS) {
        audio.currentTime = 0;
        setElapsedSeconds(0);
      }
      if (activePreview && activePreview !== audio) activePreview.pause();
      activePreview = audio;
      void audio.play();
      return;
    }

    audio.pause();
  };

  const enforcePreviewLimit = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const currentTime = Math.min(audio.currentTime, PREVIEW_LIMIT_SECONDS);
    setElapsedSeconds(currentTime);

    if (audio.currentTime >= PREVIEW_LIMIT_SECONDS) {
      audio.pause();
      audio.currentTime = 0;
      setElapsedSeconds(PREVIEW_LIMIT_SECONDS);
    }
  };

  const elapsedLabel = formatPreviewTime(elapsedSeconds);
  const totalLabel = formatPreviewTime(PREVIEW_LIMIT_SECONDS);
  const progressPercent = Math.min(100, (elapsedSeconds / PREVIEW_LIMIT_SECONDS) * 100);

  return (
    <div className="flex flex-wrap items-center gap-2 text-[9px] font-black uppercase tracking-[0.13em] sm:text-[10px]">
      <button
        type="button"
        onClick={togglePreview}
        disabled={!hasPreview}
        className={`relative inline-flex min-h-9 items-center gap-2 overflow-hidden border px-3 py-2 transition disabled:cursor-not-allowed disabled:border-white/15 disabled:bg-white/[0.03] disabled:text-stone-500 ${styles.preview}`}
        aria-label={hasPreview ? `${previewLabel} — ${elapsedLabel} / ${totalLabel}` : previewPendingLabel}
        title={hasPreview ? `${previewLabel} — 36 seconds` : previewPendingLabel}
      >
        <span
          aria-hidden="true"
          className="absolute inset-x-0 bottom-0 h-0.5 origin-left bg-current opacity-60 transition-[transform] duration-200"
          style={{ transform: `scaleX(${progressPercent / 100})` }}
        />
        {isPlaying ? <Pause className="relative h-3.5 w-3.5" aria-hidden="true" /> : <Play className="relative h-3.5 w-3.5" aria-hidden="true" />}
        <span className="relative">{hasPreview ? previewLabel : previewPendingLabel}</span>
        <span aria-hidden="true" className="relative font-mono tabular-nums tracking-normal">
          {hasPreview ? `${elapsedLabel} / ${totalLabel}` : totalLabel}
        </span>
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
            setElapsedSeconds(PREVIEW_LIMIT_SECONDS);
          }}
          onError={() => {
            if (activePreview === audioRef.current) activePreview = null;
            setIsPlaying(false);
          }}
          onTimeUpdate={enforcePreviewLimit}
        />
      ) : null}
    </div>
  );
}
