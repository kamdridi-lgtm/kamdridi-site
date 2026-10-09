"use client";

import { Check, LoaderCircle, ShoppingBag } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

const REMOTE_CATALOG_URL =
  "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

type RemoteProduct = {
  id: string;
  price_cents: number;
  currency: string;
  visible: boolean;
  checkout_enabled: boolean;
  sale_mode: string;
};

type SalesProduct = {
  id: string;
  number: string;
  title: string;
  fallbackPriceCents: number;
};

const ALBUM_ID = "echoes-unearthed-digital-album";

const TRACK_PRODUCTS: SalesProduct[] = [
  { id: "war-machines-digital-track", number: "01", title: "War Machines", fallbackPriceCents: 299 },
  { id: "too-fast-too-young-digital-track", number: "02", title: "Too Fast Too Young", fallbackPriceCents: 299 },
  { id: "our-lost-dreams-digital-single", number: "03", title: "Our Lost Dreams", fallbackPriceCents: 299 },
  {
    id: "junction-ahead-digital-track",
    number: "04",
    title: "Junction Ahead (New Heaven's Odyssey)",
    fallbackPriceCents: 299
  },
  { id: "17-for-ever-echoes-digital-track", number: "05", title: "17 For Ever", fallbackPriceCents: 299 },
  {
    id: "the-victory-goes-on-digital-track",
    number: "06",
    title: "The Victory Goes On",
    fallbackPriceCents: 299
  },
  {
    id: "alone-apart-one-apart-digital-track",
    number: "07",
    title: "Alone Apart / One Apart",
    fallbackPriceCents: 299
  },
  {
    id: "michael-remembers-digital-track",
    number: "08",
    title: "Michael Remembers",
    fallbackPriceCents: 299
  },
  {
    id: "the-fall-of-the-first-knight-digital-track",
    number: "09",
    title: "The Fall of the First Knight",
    fallbackPriceCents: 299
  }
];

function formatCad(priceCents: number) {
  return new Intl.NumberFormat("en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(priceCents / 100);
}

export function EchoesUnearthedDirectSales({
  returnPath = "/releases/echoes-unearthed"
}: {
  returnPath?: string;
}) {
  const [liveProducts, setLiveProducts] = useState<Record<string, RemoteProduct>>({});
  const [catalogChecked, setCatalogChecked] = useState(false);
  const [busyId, setBusyId] = useState<string | null>(null);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    void fetch(REMOTE_CATALOG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("catalog unavailable");
        const payload = await response.json();
        if (!Array.isArray(payload?.products)) throw new Error("invalid catalog");

        const next: Record<string, RemoteProduct> = {};
        for (const product of payload.products as RemoteProduct[]) {
          if (product.currency?.toUpperCase() !== "CAD") continue;
          next[product.id] = product;
        }

        if (!cancelled) {
          setLiveProducts(next);
          setCatalogChecked(true);
        }
      })
      .catch(() => {
        if (!cancelled) setCatalogChecked(true);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const album = liveProducts[ALBUM_ID];
  const albumPrice = album?.price_cents || 1600;
  const upgradePrice = Math.round(albumPrice * 0.8);

  const availability = useMemo(() => {
    const result: Record<string, boolean> = {};
    for (const product of [ALBUM_ID, ...TRACK_PRODUCTS.map((track) => track.id)]) {
      const live = liveProducts[product];
      result[product] = live
        ? Boolean(live.visible && live.checkout_enabled && !["sold_out", "coming_soon"].includes(live.sale_mode))
        : true;
    }
    return result;
  }, [liveProducts]);

  async function buy(productId: string) {
    setBusyId(productId);
    setCheckoutError(null);

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({
          items: [{ id: productId, quantity: 1 }],
          returnPath
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || !payload?.url) {
        throw new Error(payload?.error || "Secure checkout could not be started.");
      }

      window.location.assign(payload.url);
    } catch (error) {
      setCheckoutError(
        error instanceof Error ? error.message : "Secure checkout could not be started."
      );
      setBusyId(null);
    }
  }

  return (
    <div className="mx-auto w-full max-w-7xl">
      <div className="overflow-hidden border border-[#9b5f2a]/40 bg-[radial-gradient(circle_at_12%_10%,rgba(244,198,106,0.11),transparent_28%),linear-gradient(145deg,rgba(17,10,6,0.96),rgba(3,3,3,0.96))] shadow-[0_30px_100px_rgba(0,0,0,0.45)]">
        <div className="grid gap-0 lg:grid-cols-[0.84fr_1.16fr]">
          <div className="border-b border-white/10 p-6 sm:p-8 lg:border-b-0 lg:border-r">
            <p className="text-[10px] font-bold uppercase tracking-[0.34em] text-[#c98542]">
              Direct from KAM DRIDI · HD WAV
            </p>
            <h2 translate="no" className="notranslate mt-4 font-display text-4xl uppercase leading-none tracking-[0.08em] text-[#e8b777] sm:text-5xl">
              Echoes Unearthed
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-stone-300">
              The complete nine-track digital programme in verified 24-bit / 48 kHz WAV.
              Buy the album directly from the artist or choose any track individually.
            </p>

            <div className="mt-7 border border-[#f4c66a]/25 bg-black/45 p-5">
              <div className="flex flex-wrap items-end justify-between gap-3">
                <div>
                  <p className="text-[10px] uppercase tracking-[0.24em] text-stone-500">
                    Complete 9-track album
                  </p>
                  <p className="mt-2 text-3xl font-bold text-white">{formatCad(albumPrice)}</p>
                </div>
                <span className="border border-[#f4c66a]/30 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#f4c66a]">
                  24-bit / 48 kHz
                </span>
              </div>

              <button
                type="button"
                onClick={() => buy(ALBUM_ID)}
                disabled={!availability[ALBUM_ID] || busyId !== null}
                className="mt-5 inline-flex min-h-12 w-full items-center justify-center gap-2 bg-[#f4c66a] px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-black transition hover:bg-[#ffd989] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {busyId === ALBUM_ID ? (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                ) : (
                  <ShoppingBag className="h-4 w-4" />
                )}
                Buy the album · {formatCad(albumPrice)}
              </button>
            </div>

            <div className="mt-5 border border-emerald-300/15 bg-emerald-300/[0.05] p-5">
              <div className="flex items-start gap-3">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-300" />
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.18em] text-emerald-200">
                    Already bought one album track?
                  </p>
                  <p className="mt-2 text-sm leading-6 text-stone-300">
                    Qualifying track buyers receive a private one-time <strong>20% album upgrade</strong>
                    {" "}after 48 hours: <strong>{formatCad(upgradePrice)}</strong> instead of{" "}
                    {formatCad(albumPrice)}. Discounts do not stack.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-5 text-xs leading-6 text-stone-500">
              Track 10, <strong translate="no" className="notranslate text-stone-300">Echoes of Our Youth</strong>, is reserved
              for the physical edition and is not included in the digital album.
            </p>
          </div>

          <div className="p-4 sm:p-6">
            <div className="divide-y divide-white/10 border border-white/10 bg-black/35">
              {TRACK_PRODUCTS.map((track) => {
                const live = liveProducts[track.id];
                const price = live?.price_cents || track.fallbackPriceCents;
                const available = availability[track.id];
                const isBusy = busyId === track.id;

                return (
                  <div
                    key={track.id}
                    className="grid gap-3 px-4 py-4 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:items-center"
                  >
                    <span className="font-display text-xl text-[#c98542]">{track.number}</span>
                    <div>
                      <p translate="no" className="notranslate font-semibold text-stone-100">{track.title}</p>
                      <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-stone-600">
                        Echoes Unearthed album master · HD WAV
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => buy(track.id)}
                      disabled={!available || busyId !== null}
                      className="inline-flex min-h-10 items-center justify-center gap-2 border border-[#c57b32]/45 bg-black/45 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#f4c66a] transition hover:border-[#f4c66a] hover:bg-[#f4c66a] hover:text-black disabled:cursor-not-allowed disabled:opacity-40"
                    >
                      {isBusy ? <LoaderCircle className="h-3.5 w-3.5 animate-spin" /> : <ShoppingBag className="h-3.5 w-3.5" />}
                      {available ? `Buy · ${formatCad(price)}` : "Unavailable"}
                    </button>
                  </div>
                );
              })}
              <div className="grid gap-3 bg-[#130d08] px-4 py-4 sm:grid-cols-[52px_minmax(0,1fr)_auto] sm:items-center">
                <span className="font-display text-xl text-[#f4c66a]">10</span>
                <div>
                  <p translate="no" className="notranslate font-semibold text-stone-100">Echoes of Our Youth</p>
                  <p className="mt-1 text-[10px] uppercase tracking-[0.2em] text-stone-500">
                    Bonus track
                  </p>
                </div>
                <span className="border border-[#f4c66a]/25 px-3 py-2 text-center text-[10px] uppercase tracking-[0.18em] text-[#f4c66a]">
                  Physical edition only
                </span>
              </div>
            </div>

            {checkoutError ? (
              <p className="mt-4 border border-red-500/25 bg-red-500/10 p-3 text-sm text-red-200" role="alert">
                {checkoutError}
              </p>
            ) : null}

            {!catalogChecked ? (
              <p className="mt-4 text-center text-[10px] uppercase tracking-[0.18em] text-stone-600">
                Checking live availability…
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
