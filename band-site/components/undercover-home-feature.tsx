"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, Pause, Play, ShoppingBag } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const UNDERCOVER_URL = "/undercover/index.html";
const CATALOG_URL = "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

type CatalogProduct = {
  id: string;
  price_cents: number;
  currency: string;
  sale_mode: string;
  visible: boolean;
  checkout_enabled: boolean;
};

const tracks = [
  { title: "Never Gonna Say Goodbye", artist: "Europe", slug: "never-gonna-say-goodbye", art: "embedded-84ac84f87378ebe4508ce958.webp", mp3: "europe.mp3" },
  { title: "Deep Cuts the Night", artist: "Bon Jovi", slug: "deep-cuts-the-night", art: "embedded-fed384c761ee29f5c4ef98f4.webp", mp3: "bon-jovi.mp3" },
  { title: "Heat Street", artist: "Def Leppard", slug: "heat-street", art: "embedded-7240c2fc8424074ba0d51f25.webp", mp3: "def-leppard.mp3" },
  { title: "Only a Man", artist: "Warrant", slug: "only-a-man", art: "embedded-d0b098b749f252e46113800f.webp", mp3: "warrant.mp3" },
  { title: "High Wire", artist: "Glenn Medeiros", slug: "high-wire", art: "embedded-ecd8c473e8e15e2f49054757.webp", mp3: "high-wire.mp3" },
  { title: "Remember Tomorrow", artist: "Iron Maiden", slug: "remember-tomorrow", art: "remember-tomorrow.webp", mp3: "remember-tomorrow.mp3" },
  { title: "Goldorak", artist: "Noam Kaniel", slug: "goldorak", art: "goldorak.webp", mp3: "goldorak.mp3" },
  { title: "Sign of the Times", artist: "Dokken", slug: "sign-of-the-times", art: "dokken.webp", mp3: null },
  { title: "Hearts on Fire", artist: "John Cafferty", slug: "hearts-on-fire", art: "hearts-on-fire.webp", mp3: null },
  { title: "Candy in Your Hands", artist: "Rick Savage", slug: "candy-in-your-hands", art: "candy-in-your-hands.webp", mp3: null },
  { title: "Wait", artist: "The Jacksons", slug: "wait", art: "wait.webp", mp3: null }
] as const;

function formatCad(cents: number) {
  return new Intl.NumberFormat("en-CA", { style: "currency", currency: "CAD" }).format(cents / 100);
}

export function UndercoverHomeFeatureBanner() {
  return (
    <section id="undercover-feature" className="relative z-10 border-b border-[#a86225]/25 px-3 py-5 sm:px-6 sm:py-8" aria-label="Featured release UNDERCOVER">
      <Link
        href="#undercover-tracks"
        className="group relative mx-auto flex min-h-[146px] max-w-7xl items-center overflow-hidden rounded-2xl border border-[#efab40]/80 bg-[#110709] shadow-[0_0_36px_rgba(185,62,24,0.16)] transition hover:border-[#ffe0a1] hover:shadow-[0_0_44px_rgba(208,86,29,0.28)] sm:min-h-[190px]"
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_20%_55%,rgba(170,35,16,0.64),transparent_45%),radial-gradient(ellipse_at_85%_25%,rgba(166,48,28,0.28),transparent_48%),linear-gradient(100deg,#090406,#180607_48%,#050304)]" />
        <div className="absolute inset-0 opacity-55 mix-blend-screen" style={{ backgroundImage: "url('/undercover/assets/embedded-84ac84f87378ebe4508ce958.webp')", backgroundSize: "cover", backgroundPosition: "center 42%" }} />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(6,2,3,0.05),rgba(4,2,3,0.84)_40%,rgba(8,2,3,0.62))]" />
        <div className="relative flex w-[29%] max-w-[270px] flex-none items-center justify-center px-2 sm:w-[32%] sm:px-7">
          <Image src="/undercover/assets/kamdridi-undercover-crystal.png" alt="KAM DRIDI UNDERCOVER artwork" width={480} height={340} className="max-h-[122px] w-full object-contain drop-shadow-[0_10px_16px_rgba(0,0,0,0.95)] sm:max-h-[175px]" unoptimized />
        </div>
        <div className="relative min-w-0 flex-1 py-4 text-center">
          <div className="flex items-center justify-center gap-2 text-[9px] font-semibold uppercase tracking-[0.3em] text-[#f8c46d] sm:text-sm sm:tracking-[0.4em]">
            <span className="h-px w-4 bg-[#ffcf6b] sm:w-12" /> Featured now <span className="h-px w-4 bg-[#ffcf6b] sm:w-12" />
          </div>
          <h2 className="mt-2 bg-[linear-gradient(180deg,#fff7ed_5%,#b3b3be_48%,#f5f0ee_65%,#6e6d78_100%)] bg-clip-text font-display text-[clamp(1.75rem,6.5vw,5.4rem)] font-black italic uppercase leading-none tracking-[-0.035em] text-transparent drop-shadow-[0_4px_4px_rgba(0,0,0,0.8)]">
            <span className="text-[#e83934]">UN</span>DERCOVER
          </h2>
          <p className="mt-2 text-[9px] uppercase tracking-[0.15em] text-white sm:text-sm sm:tracking-[0.37em]">The songs that made me</p>
        </div>
        <div className="relative flex w-10 flex-none items-center justify-center pr-2 text-[#ffc36a] transition group-hover:translate-x-1 sm:w-20">
          <ArrowRight size={34} strokeWidth={1.8} aria-hidden="true" className="drop-shadow-[0_0_12px_rgba(244,149,52,0.7)] sm:h-12 sm:w-12" />
        </div>
      </Link>
      <div className="mx-auto mt-2 flex max-w-7xl justify-center text-[10px] uppercase tracking-[0.24em] text-[#b78a54]">
        <ChevronDown size={15} aria-hidden="true" className="mr-1" /> Discover the featured collection
      </div>
    </section>
  );
}

export function UndercoverHomeTrackShowcase() {
  const [catalog, setCatalog] = useState<Record<string, CatalogProduct>>({});
  const [playing, setPlaying] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState("");
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    let active = true;
    fetch(CATALOG_URL, { cache: "no-store" })
      .then(async response => {
        if (!response.ok) throw new Error("Catalog unavailable");
        const payload = await response.json();
        if (!Array.isArray(payload?.products)) throw new Error("Invalid catalog");
        const data: Record<string, CatalogProduct> = {};
        for (const product of payload.products as CatalogProduct[]) {
          if (product?.id?.startsWith("undercover-")) data[product.id] = product;
        }
        if (active) setCatalog(data);
      })
      .catch(() => { /* Fail closed: only catalog-approved songs can be purchased. */ });
    return () => {
      active = false;
      audioRef.current?.pause();
    };
  }, []);

  function togglePlay(slug: string, filename: string) {
    const audio = audioRef.current;
    if (!audio) return;
    if (playing === slug) {
      audio.pause();
      setPlaying(null);
      return;
    }
    audio.pause();
    audio.src = "/undercover/media/" + filename;
    audio.load();
    setPlaying(slug);
    void audio.play().catch(() => setPlaying(null));
  }

  async function buy(productId: string) {
    if (busy) return;
    setBusy(productId);
    setError("");
    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ items: [{ id: productId, quantity: 1 }], returnPath: "/" })
      });
      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.url !== "string") throw new Error("Secure checkout unavailable. Please try again.");
      const destination = new URL(payload.url);
      if (destination.protocol !== "https:" || !(destination.hostname === "checkout.stripe.com" || destination.hostname.endsWith(".checkout.stripe.com"))) throw new Error("Invalid checkout destination");
      window.location.assign(destination.href);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Checkout unavailable");
      setBusy(null);
    }
  }

  return (
    <section id="undercover-tracks" className="relative z-10 border-b border-[#a86225]/25 px-3 py-12 sm:px-6 sm:py-16">
      <div className="mx-auto max-w-7xl">
        <div className="relative overflow-hidden border-t border-[#c18a45]/70 bg-[radial-gradient(ellipse_at_50%_0%,rgba(149,25,17,0.3),transparent_60%)] px-3 py-8 text-center sm:py-12">
          <p className="text-xs uppercase tracking-[0.38em] text-[#f3c276]">KAM DRIDI presents</p>
          <h2 className="mt-3 font-display text-[clamp(2.7rem,9vw,6.5rem)] font-black italic uppercase leading-none tracking-[-0.04em] text-[#ece8e3]">
            <span className="text-[#f44339]">UN</span>DERCOVER
          </h2>
          <p className="mt-3 text-[11px] uppercase tracking-[0.19em] text-white sm:text-sm sm:tracking-[0.37em]">The songs that made me</p>
          <p className="mt-4 text-xs uppercase tracking-[0.12em] text-[#d3ad74]">11 chapters · HD 24-bit / 48 kHz · original artwork</p>
        </div>
        <audio ref={audioRef} preload="none" onEnded={() => setPlaying(null)} className="hidden" aria-label="UNDERCOVER audio preview" />
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4 xl:grid-cols-6">
          {tracks.map((track, index) => {
            const productId = "undercover-" + track.slug + "-digital";
            const live = catalog[productId];
            const canBuy = Boolean(track.mp3 && live?.visible && live?.checkout_enabled && live?.sale_mode === "digital" && live?.currency?.toUpperCase() === "CAD" && Number.isSafeInteger(live.price_cents) && live.price_cents > 0);
            return (
              <article key={track.slug} className="flex min-w-0 flex-col overflow-hidden rounded-lg border border-[#986b2c]/70 bg-[linear-gradient(160deg,#150e09,#050404_65%)] p-2.5 shadow-[0_14px_35px_rgba(0,0,0,0.38)] sm:p-3">
                <div className="relative aspect-square overflow-hidden rounded border border-[#a47a48]/25 bg-[#100b0d]">
                  <Image src={"/undercover/assets/" + track.art} alt={track.title + " artwork"} fill unoptimized sizes="(max-width:640px) 45vw, (max-width:1024px) 30vw, 16vw" className="object-cover" />
                  <span className="absolute right-1.5 top-1.5 rounded bg-black/70 px-1.5 py-1 text-[9px] font-bold text-[#e7ba75]">{String(index + 1).padStart(2, "0")}</span>
                  {track.mp3 ? (
                    <button type="button" aria-label={(playing === track.slug ? "Pause " : "Play ") + track.title} onClick={() => togglePlay(track.slug, track.mp3!)} className="absolute bottom-2 left-2 grid h-9 w-9 place-items-center rounded-full border border-[#e9b450] bg-black/90 text-[#f4bd55] transition hover:bg-[#e7b75a] hover:text-black">
                      {playing === track.slug ? <Pause size={17} /> : <Play size={17} fill="currentColor" />}
                    </button>
                  ) : null}
                </div>
                <p className="mt-2 min-h-10 text-xs font-semibold leading-5 text-white sm:text-sm">{track.title}</p>
                <p className="mb-3 text-[10px] text-[#b39b7c]">{track.artist}</p>
                <div className="mt-auto">
                  {canBuy ? (
                    <button type="button" disabled={busy !== null} onClick={() => void buy(productId)} className="flex min-h-10 w-full items-center justify-center gap-1 rounded-md bg-[#f2bd63] px-1.5 py-2 text-[10px] font-bold uppercase tracking-wide text-black transition hover:bg-[#ffdc91] disabled:opacity-60 sm:text-xs">
                      <ShoppingBag size={13} /> {busy === productId ? "Opening…" : "Buy HD · " + formatCad(live!.price_cents)}
                    </button>
                  ) : (
                    <span className="flex min-h-10 w-full items-center justify-center rounded-md border border-[#b58a48]/70 px-2 text-center text-[10px] font-semibold uppercase tracking-widest text-[#c9aa76]">
                      Coming soon
                    </span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
        {error ? <p role="alert" className="mt-4 text-center text-sm text-[#ffb2a6]">{error}</p> : null}
        <div className="mt-9 text-center">
          <Link href={UNDERCOVER_URL} className="group inline-flex min-h-12 w-full max-w-2xl items-center justify-center gap-3 rounded-lg border-2 border-[#eebc67] px-5 text-xs font-bold uppercase tracking-[0.13em] text-[#f7d08d] transition hover:bg-[#eebc67]/10 sm:text-lg sm:tracking-[0.21em]">
            <Play className="h-4 w-4" fill="currentColor" /> Explore UNDERCOVER <ArrowRight className="h-5 w-5 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
