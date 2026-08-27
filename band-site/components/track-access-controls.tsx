"use client";

import { LockKeyhole, Pause, Play } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const PREVIEW_LIMIT_SECONDS = 36;
let activePreview: HTMLAudioElement | null = null;

const REMOTE_CATALOG_URL =
  "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

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
  purchaseHref?: string;
  purchaseProductId?: string;
};

export function TrackAccessControls({
  previewSrc,
  previewLabel,
  previewPendingLabel,
  fullTrackLabel,
  theme = "gold",
  purchaseHref,
  purchaseProductId,
}: TrackAccessControlsProps) {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [purchaseEnabled, setPurchaseEnabled] = useState(Boolean(purchaseHref));
  const [purchaseLoading, setPurchaseLoading] = useState(false);
  const styles = themeClasses[theme];
  const hasPreview = Boolean(previewSrc);
  const resolvedPurchaseHref = purchaseProductId ? undefined : purchaseHref;

  useEffect(() => {
    if (!purchaseProductId) {
      setPurchaseEnabled(Boolean(purchaseHref));
      return;
    }

    let cancelled = false;
    void fetch(REMOTE_CATALOG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Catalog unavailable");
        const payload = await response.json();
        const product = Array.isArray(payload?.products)
          ? payload.products.find((candidate: any) => candidate?.id === purchaseProductId)
          : null;
        const enabled = Boolean(
          product &&
          product.visible &&
          product.checkout_enabled &&
          product.price_cents > 0 &&
          product.sale_mode !== "sold_out" &&
          product.sale_mode !== "coming_soon"
        );
        if (!cancelled) setPurchaseEnabled(enabled);
      })
      .catch(() => {
        if (!cancelled) setPurchaseEnabled(false);
      });

    return () => {
      cancelled = true;
    };
  }, [purchaseHref, purchaseProductId]);

  const startProductCheckout = async () => {
    if (!purchaseProductId || !purchaseEnabled || purchaseLoading) return;
    setPurchaseLoading(true);
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: [{ id: purchaseProductId, quantity: 1 }],
          returnPath: window.location.pathname
        })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.url !== "string") {
        throw new Error(payload.error || "Checkout unavailable");
      }
      window.location.assign(payload.url);
    } catch {
      setPurchaseLoading(false);
    }
  };

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

      {purchaseProductId && purchaseEnabled ? (
        <button
          type="button"
          onClick={startProductCheckout}
          disabled={purchaseLoading}
          className={`inline-flex min-h-9 items-center gap-2 border px-3 py-2 transition hover:brightness-110 disabled:cursor-wait disabled:opacity-70 ${styles.locked}`}
          aria-label={fullTrackLabel}
          title={fullTrackLabel}
        >
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          {purchaseLoading ? "Opening checkout…" : fullTrackLabel}
        </button>
      ) : resolvedPurchaseHref ? (
        <a
          href={resolvedPurchaseHref}
          target={resolvedPurchaseHref.startsWith("http") ? "_blank" : undefined}
          rel={resolvedPurchaseHref.startsWith("http") ? "noreferrer" : undefined}
          className={`inline-flex min-h-9 items-center gap-2 border px-3 py-2 transition hover:brightness-110 ${styles.locked}`}
          aria-label={fullTrackLabel}
          title={fullTrackLabel}
        >
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          {fullTrackLabel}
        </a>
      ) : (
        <span
          className={`inline-flex min-h-9 items-center gap-2 border px-3 py-2 ${styles.locked}`}
          aria-label={fullTrackLabel}
          title={fullTrackLabel}
          role="img"
        >
          <LockKeyhole className="h-3.5 w-3.5" aria-hidden="true" />
          {fullTrackLabel}
        </span>
      )}

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
