"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { getVisibleCommerceProducts, CommerceProduct } from "@/data/commerce-products";

const REMOTE_CATALOG_URL =
  "https://retoydsgsuvznlpsguts.supabase.co/functions/v1/commerce-catalog";

type RemoteProduct = {
  id: string;
  slug: string;
  name: string;
  subtitle?: string | null;
  project: string;
  project_slug: string;
  category: string;
  description: string;
  images?: string[] | null;
  price_cents: number;
  currency: "CAD" | "JPY";
  sale_mode: CommerceProduct["saleMode"];
  visible: boolean;
  checkout_enabled: boolean;
  fulfillment_mode: CommerceProduct["fulfillmentMode"];
  requires_shipping: boolean;
  quantity_limit?: number | null;
  product_path?: string | null;
  release_path?: string | null;
  badge?: string | null;
  fulfillment_note?: string | null;
  colors?: string[] | null;
  sizes?: string[] | null;
  formats?: string[] | null;
  production_components?: CommerceProduct["productionComponents"] | null;
};

function normalizeRemoteProduct(product: RemoteProduct): CommerceProduct {
  return {
    id: product.id,
    slug: product.slug,
    name: product.name,
    subtitle: product.subtitle || "",
    project: product.project,
    projectSlug: product.project_slug,
    category: product.category,
    description: product.description,
    images: Array.isArray(product.images) && product.images.length > 0 ? product.images : ["/assets/images/releases/war-machines-cover.png"],
    priceCents: product.price_cents,
    currency: product.currency,
    saleMode: product.sale_mode,
    visible: product.visible,
    checkoutEnabled: product.checkout_enabled,
    fulfillmentMode: product.fulfillment_mode,
    requiresShipping: product.requires_shipping,
    quantityLimit: product.quantity_limit ?? undefined,
    productPath: product.product_path || `/store#${product.id}`,
    releasePath: product.release_path || "/store",
    badge: product.badge || undefined,
    fulfillmentNote: product.fulfillment_note || undefined,
    colors: product.colors || undefined,
    sizes: product.sizes || undefined,
    formats: product.formats || undefined,
    productionComponents: product.production_components || undefined
  };
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD"
  }).format(value);
}

export function Storefront({ checkoutEnabled }: { checkoutEnabled: boolean }) {
  const searchParams = useSearchParams();
  const { addToCart, clearCart, setCartOpen } = useApp();
  const [status, setStatus] = useState<{
    message: string;
    tone: "success" | "warning" | "error";
  } | null>(null);
  const [allProducts, setAllProducts] = useState<CommerceProduct[]>(() => getVisibleCommerceProducts());
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string | undefined>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string | undefined>>({});
  const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
  const checkoutSessionId = searchParams.get("session_id");
  const requestedFilter = searchParams.get("filter");

  useEffect(() => {
    let cancelled = false;

    void fetch(REMOTE_CATALOG_URL, { cache: "no-store" })
      .then(async (response) => {
        if (!response.ok) throw new Error("Remote catalog unavailable");
        const payload = await response.json();
        if (!Array.isArray(payload?.products)) throw new Error("Invalid remote catalog");
        const normalized = (payload.products as RemoteProduct[])
          .filter((product) => product.visible && product.currency === "CAD")
          .map(normalizeRemoteProduct);
        if (!cancelled && normalized.length > 0) setAllProducts(normalized);
      })
      .catch(() => {
        // Keep the checked-in catalog as a resilient fallback.
      });

    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    if (purchaseState === "success") {
      if (!checkoutSessionId) {
        setStatus({
          message: "We could not verify this checkout. Your cart has been kept.",
          tone: "error"
        });
      } else {
        setStatus({ message: "Verifying your secure payment…", tone: "warning" });
        void fetch(`/api/checkout/session?session_id=${encodeURIComponent(checkoutSessionId)}`, {
          cache: "no-store"
        })
          .then(async (response) => {
            const payload = await response.json().catch(() => ({}));
            if (!response.ok || payload.paid !== true) {
              throw new Error(payload.error || "Payment has not been confirmed.");
            }

            if (!cancelled) {
              clearCart();
              window.localStorage.removeItem("kamdridi-pending-checkout");
              setStatus({ message: "Payment confirmed. Your order has been received.", tone: "success" });
            }
          })
          .catch((error: unknown) => {
            if (!cancelled) {
              setStatus({
                message: error instanceof Error ? error.message : "Payment verification failed. Your cart has been kept.",
                tone: "error"
              });
            }
          });
      }
    } else if (purchaseState === "cancelled") {
      setStatus({ message: "Checkout cancelled. Your cart is still available.", tone: "warning" });
    }

    if (requestedFilter) {
      setActiveFilter(requestedFilter);
    }

    const hash = window.location.hash;
    if (hash) {
      setTimeout(() => {
        const elementId = decodeURIComponent(hash.slice(1));
        const el = document.getElementById(elementId);
        if (el) {
          el.scrollIntoView({ behavior: "smooth", block: "center" });
          el.classList.add("ring-2", "ring-[#f4c66a]", "ring-offset-4", "ring-offset-black", "transition-all", "duration-1000");
          setTimeout(() => {
            el.classList.remove("ring-2", "ring-[#f4c66a]", "ring-offset-4", "ring-offset-black");
          }, 3000);
        }
      }, 300);
    }
    return () => {
      cancelled = true;
    };
  }, [checkoutSessionId, clearCart, purchaseState, requestedFilter]);

  const getButtonLabel = (product: CommerceProduct) => {
    if (product.saleMode === "sold_out") return "SOLD OUT";
    if (product.saleMode === "coming_soon") return "PRE-ORDERS OPEN SOON";
    if (!product.checkoutEnabled) return "NOT AVAILABLE YET";
    if (product.saleMode === "preorder") return "PRE-ORDER";
    if (product.saleMode === "digital") return "ORDER DIGITAL";
    return "ADD TO CART";
  };

  const handleAddToCart = (product: CommerceProduct) => {
    if (
      product.saleMode === "sold_out" ||
      product.saleMode === "coming_soon" ||
      !product.checkoutEnabled
    ) return;
    addToCart({
      id: product.id,
      name: product.name,
      price: product.priceCents / 100,
      image: product.images[0],
      color: selectedColors[product.id] || product.colors?.[0],
      size: selectedSizes[product.id] || product.sizes?.[0]
    });
    setCartOpen(true);
  };

  const renderProductCard = (product: CommerceProduct) => {
    const isSoldOut = product.saleMode === "sold_out";
    const isComingSoon = product.saleMode === "coming_soon";
    const isUnavailable = isSoldOut || isComingSoon || !product.checkoutEnabled;

    return (
      <div key={product.id} id={product.id} className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black/40">
        <div className="relative aspect-square overflow-hidden bg-black/60">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition duration-700 ${isSoldOut ? "grayscale opacity-50" : "group-hover:scale-105"}`}
          />
          {product.saleMode === "preorder" && (
            <div className="absolute left-4 top-4 rounded-full border border-amber-500/30 bg-amber-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-500 backdrop-blur">
              Pre-order
            </div>
          )}
          {product.saleMode === "sold_out" && (
            <div className="absolute left-4 top-4 rounded-full border border-red-500/30 bg-red-950/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-red-500 backdrop-blur">
              Sold Out
            </div>
          )}
          {isComingSoon && (
            <div className="absolute left-4 top-4 rounded-full border border-[#e5d1aa]/45 bg-black/80 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#e5d1aa] backdrop-blur">
              January 2027
            </div>
          )}
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <span>{product.projectSlug.replace(/-/g, " ")}</span>
            <span>{product.category}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="font-display text-xl uppercase tracking-wider text-white">{product.name}</h3>
              <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[#f4c66a]">
                {product.subtitle}
              </p>
            </div>
            <span className="shrink-0 text-right text-sm font-bold uppercase tracking-[0.12em] text-[#f4c66a]">
              {isComingSoon ? "Price TBA" : formatCurrency(product.priceCents / 100)}
            </span>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-400">{product.description}</p>

          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c}
                    type="button"
                    onClick={() => setSelectedColors((prev) => ({ ...prev, [product.id]: c }))}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${selectedColors[product.id] === c || (!selectedColors[product.id] && product.colors![0] === c) ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]" : "border-white/10 text-stone-400"}`}
                  >
                    {c}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">Size</div>
              <div className="flex flex-wrap gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSelectedSizes((prev) => ({ ...prev, [product.id]: s }))}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${selectedSizes[product.id] === s || (!selectedSizes[product.id] && product.sizes![0] === s) ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]" : "border-white/10 text-stone-400"}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={() => handleAddToCart(product)}
            disabled={isUnavailable}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition ${isUnavailable ? "cursor-not-allowed bg-stone-800 text-stone-500" : "bg-[#f4c66a] text-black hover:bg-[#ffd989]"}`}
          >
            {getButtonLabel(product)}
            {!isUnavailable && <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  };

  const filters = [
    { label: "ALL", value: "ALL" },
    { label: "17 FOR EVER", value: "australia-17-for-ever" },
    { label: "ECHOES BRASIL", value: "echoes-un-live-in-brasil" },
    { label: "SALIERI", value: "salieris-hands" },
    { label: "ECHOES UNEARTHED", value: "echoes-unearthed" },
    { label: "KAMDRIDI", value: "kamdridi-core" },
    { label: "DIGITAL", value: "digital" }
  ];

  const filteredProducts = allProducts.filter((p) => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "digital") return p.category === "Digital Access" || p.saleMode === "digital";
    return p.projectSlug === activeFilter;
  });

  const featured = filteredProducts.filter((p) => p.id === "kamdridi-gold-logo-tee" || p.id === "echoes-unearthed-crest-tee" || p.id === "echoes-brasil-expanded-2026");
  const australia = filteredProducts.filter((p) => p.projectSlug === "australia-17-for-ever");
  const echoesBrasil = filteredProducts.filter((p) => p.projectSlug === "echoes-un-live-in-brasil" && !featured.includes(p));
  const salieri = filteredProducts.filter((p) => p.projectSlug === "salieris-hands");
  const echoesUnearthed = filteredProducts.filter((p) => p.projectSlug === "echoes-unearthed" && !featured.includes(p));
  const kamdridiCore = filteredProducts.filter((p) => p.projectSlug === "kamdridi-core" && !featured.includes(p) && p.category !== "Digital Access");
  const digitalAccess = filteredProducts.filter((p) => p.category === "Digital Access" || p.saleMode === "digital");

  return (
    <div className="grid gap-16">
      {status && (
        <div aria-live="polite" className={`rounded-[24px] border p-4 text-center text-sm font-semibold tracking-wide ${
          status.tone === "success"
            ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-200"
            : status.tone === "error"
              ? "border-rose-500/25 bg-rose-500/10 text-rose-200"
              : "border-amber-500/25 bg-amber-500/10 text-amber-100"
        }`}>
          {status.message}
        </div>
      )}

      {!checkoutEnabled && (
        <div className="rounded-[24px] border border-amber-500/25 bg-amber-500/10 p-4 text-center text-sm leading-7 text-amber-100">
          Secure checkout setup is in progress. The catalog remains visible, but payment cannot open until Stripe credentials are connected.
        </div>
      )}

      <div className="flex flex-wrap justify-center gap-3">
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition ${activeFilter === f.value ? "border-[#f4c66a] bg-[#f4c66a] text-black" : "border-white/20 bg-black/50 text-stone-400 hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {featured.length > 0 && activeFilter === "ALL" && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-[#f4c66a]">Featured</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map(renderProductCard)}
          </div>
        </section>
      )}

      {australia.length > 0 && (
        <section id="australia-17-for-ever" className="scroll-mt-36">
          <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.3em] text-[#e5d1aa]">Australian summer · January 2027</p>
              <h2 className="mt-3 font-display text-3xl uppercase tracking-widest text-white">17 For Ever</h2>
            </div>
            <Link href="/australia" className="text-xs font-bold uppercase tracking-[0.2em] text-[#e5d1aa] transition hover:text-white">
              Explore the campaign →
            </Link>
          </div>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {australia.map(renderProductCard)}
          </div>
        </section>
      )}

      {echoesBrasil.length > 0 && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">Echoes Un Live In Brasil</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {echoesBrasil.map(renderProductCard)}
          </div>
        </section>
      )}

      {salieri.length > 0 && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">Salieri&apos;s Hands</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {salieri.map(renderProductCard)}
          </div>
        </section>
      )}

      {echoesUnearthed.length > 0 && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">Echoes Unearthed</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {echoesUnearthed.map(renderProductCard)}
          </div>
        </section>
      )}

      {kamdridiCore.length > 0 && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">KAMDRIDI Core</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {kamdridiCore.map(renderProductCard)}
          </div>
        </section>
      )}

      {digitalAccess.length > 0 && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">Digital Access</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {digitalAccess.map(renderProductCard)}
          </div>
        </section>
      )}
    </div>
  );
}
