"use client";

import Image from "next/image";
import { ArrowRight, PackageCheck, ShoppingBag, ShieldCheck, Sparkles, Star, Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { CTAButton, GlassCard, SectionHeading } from "@/components/ui";
import {
  catalogProductNames,
  featuredArtifact,
  storefrontGrid,
  type StoreColor,
  type StoreProduct,
  type StoreSize
} from "@/data/store";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD"
  }).format(value);
}

export function Storefront({ checkoutEnabled }: { checkoutEnabled: boolean }) {
  const searchParams = useSearchParams();
  const { addToCart, cart, cartSubtotal, clearCart, setCartOpen } = useApp();
  const [status, setStatus] = useState<string | null>(null);
  const [trackingStatus, setTrackingStatus] = useState<string | null>(null);
  const handledState = useRef<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, StoreSize | undefined>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, StoreColor | undefined>>({});

  const cartItems = useMemo(
    () => cart.map((item) => [item.name, item.color, item.size].filter(Boolean).join(" / ")),
    [cart]
  );
  const merchProducts = storefrontGrid.filter((product) => product.category !== "Digital Access");
  const digitalAccessProducts = storefrontGrid.filter((product) => product.category === "Digital Access");
  const bestSellerIds = [
    "kamdridi-gold-logo-tee",
    "echoes-unearthed-crest-tee",
    "signal-target-tee-collection"
  ];
  const heroProducts = merchProducts
    .filter((product) => bestSellerIds.includes(product.id))
    .sort((a, b) => bestSellerIds.indexOf(a.id) - bestSellerIds.indexOf(b.id));

  useEffect(() => {
    const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
    if (!purchaseState || handledState.current === purchaseState) {
      return;
    }

    handledState.current = purchaseState;

    if (purchaseState === "demo") {
      window.localStorage.removeItem("kamdridi-pending-checkout");
      setStatus("Local demo checkout completed. No live payment was taken in this environment.");
      return;
    }

    if (purchaseState === "success") {
      const pendingCheckoutRaw = window.localStorage.getItem("kamdridi-pending-checkout");
      const pendingProductIds = pendingCheckoutRaw ? (JSON.parse(pendingCheckoutRaw) as string[]) : [];
      const sessionId = searchParams.get("session_id");

      clearCart();
      window.localStorage.removeItem("kamdridi-pending-checkout");

      if (sessionId === "simulated_session") {
        setStatus(
          "Local confirmation complete. Live payment is not connected yet, but the store flow is working."
        );
        return;
      }

      if (pendingProductIds.length) {
        void fetch("/api/game-access/grant", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productIds: pendingProductIds })
        })
          .then((response) => response.json())
          .then((payload) => {
            if (payload.ok && Array.isArray(payload.unlockedGames) && payload.unlockedGames.length) {
              setStatus("Purchase confirmed. Your game access is unlocked in this browser.");
              return;
            }

            setStatus("Purchase confirmed. Your KAMDRIDI order is locked in.");
          })
          .catch(() => {
            setStatus("Purchase confirmed. Your KAMDRIDI order is locked in.");
          });
        return;
      }

      setStatus("Purchase confirmed. Your KAMDRIDI order is locked in.");
    }

    if (purchaseState === "cancelled") {
      window.localStorage.removeItem("kamdridi-pending-checkout");
      setStatus("Checkout was cancelled. Your merch loadout is still waiting.");
    }
  }, [clearCart, searchParams]);

  useEffect(() => {
    const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
    const sessionId = searchParams.get("session_id");

    if (purchaseState !== "success" || !sessionId || sessionId === "simulated_session") {
      return;
    }

    let isActive = true;

    void fetch(`/api/store/tracking?session_id=${encodeURIComponent(sessionId)}`, {
      cache: "no-store"
    })
      .then((response) => response.json())
      .then((payload) => {
        if (!isActive) {
          return;
        }

        if (payload.shipped && payload.trackingNumber) {
          setTrackingStatus(
            `Shipment live. Tracking number: ${payload.trackingNumber}${payload.trackingUrl ? ` - ${payload.trackingUrl}` : ""}`
          );
          return;
        }

        if (payload.configured) {
          setTrackingStatus("Printful order created. Tracking will appear here after shipment.");
        }
      })
      .catch(() => {
        if (isActive) {
          setTrackingStatus("Tracking is not available yet.");
        }
      });

    return () => {
      isActive = false;
    };
  }, [searchParams]);

  function getSelectedColor(product: StoreProduct) {
    return selectedColors[product.id] ?? product.colors?.[0];
  }

  function getSelectedSize(product: StoreProduct) {
    return selectedSizes[product.id] ?? product.sizes?.[0];
  }

  function handleAddToCart(product: StoreProduct) {
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.image,
      color: getSelectedColor(product),
      size: getSelectedSize(product)
    });
    setCartOpen(true);
  }

  function renderProductCard(product: StoreProduct) {
    return (
      <GlassCard key={product.id} id={product.id} className="group overflow-hidden p-0 scroll-mt-28">
        <div className="relative h-80 bg-black/40">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition duration-500 group-hover:scale-105"
            style={{ objectPosition: product.imagePosition ?? "center" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.02),rgba(0,0,0,0.45))]" />
          <div className="absolute left-4 top-4 rounded-full border border-white/15 bg-black/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-stone-200 backdrop-blur">
            {product.category}
          </div>
          {product.badge ? (
            <div className="absolute bottom-4 left-4 rounded-full border border-[#f4c66a]/45 bg-[#f4c66a]/15 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-[#f4c66a] backdrop-blur">
              {product.badge}
            </div>
          ) : null}
        </div>
        <div className="flex min-h-[430px] flex-col p-6">
          <div className="flex items-start justify-between gap-4">
            <h3 className="text-2xl leading-tight text-white">{product.name}</h3>
            <span className="shrink-0 text-xl text-[#f4c66a]">{product.priceLabel}</span>
          </div>
          <p className="mt-4 text-sm leading-7 text-stone-400">{product.description}</p>
          {product.colors?.length ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Color</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.colors.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() =>
                      setSelectedColors((current) => ({ ...current, [product.id]: color }))
                    }
                    className={`rounded-full border px-4 py-2 text-xs uppercase tracking-[0.22em] transition ${
                      getSelectedColor(product) === color
                        ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]"
                        : "border-white/10 text-stone-400 hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          {product.sizes?.length ? (
            <div className="mt-6">
              <p className="text-xs uppercase tracking-[0.28em] text-stone-500">Size</p>
              <div className="mt-3 flex flex-wrap gap-2">
                {product.sizes.map((size) => (
                  <button
                    key={size}
                    type="button"
                    onClick={() =>
                      setSelectedSizes((current) => ({ ...current, [product.id]: size }))
                    }
                    className={`rounded-full border px-3 py-2 text-xs uppercase tracking-[0.22em] transition ${
                      getSelectedSize(product) === size
                        ? "border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]"
                        : "border-white/10 text-stone-400 hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          ) : null}
          <div className="mt-auto flex items-center justify-between gap-4 pt-6">
            <span className="text-[11px] uppercase tracking-[0.24em] text-stone-500">
              {product.fulfillmentMode === "manual" ? "KAMDRIDI packed" : "Print partner"}
            </span>
            <button
              type="button"
              onClick={() => handleAddToCart(product)}
              className="inline-flex items-center gap-2 rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.22em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
            >
              Add <ShoppingBag className="h-4 w-4" />
            </button>
          </div>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="grid gap-14">
      <div className="grid gap-4 rounded-[30px] border border-[#f4c66a]/20 bg-[linear-gradient(135deg,rgba(244,198,106,0.13),rgba(0,0,0,0.38))] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.34)] lg:grid-cols-[1fr_auto] lg:items-center">
        <div>
          <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Start here</p>
          <h2 className="mt-3 font-display text-3xl uppercase tracking-[0.08em] text-white md:text-4xl">
            Best sellers first. Build the cart fast.
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-stone-300">
            The strongest merch is now up front: logo tee, Echoes crest tee, and Signal Target capsule.
            Pick a size, add it, then checkout from the drawer.
          </p>
        </div>
        <button
          type="button"
          onClick={() => setCartOpen(true)}
          className="inline-flex items-center justify-center rounded-full border border-[#f4c66a]/45 bg-black/35 px-6 py-4 text-xs uppercase tracking-[0.24em] text-[#f4c66a] transition hover:-translate-y-0.5 hover:bg-[#f4c66a] hover:text-black"
        >
          Cart {cart.length ? `(${cart.length})` : ""} <ArrowRight className="ml-2 h-4 w-4" />
        </button>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {heroProducts.map((product) => (
          <button
            key={product.id}
            type="button"
            onClick={() => handleAddToCart(product)}
            className="group grid grid-cols-[116px_1fr] overflow-hidden rounded-[26px] border border-white/10 bg-black/35 text-left transition hover:-translate-y-1 hover:border-[#f4c66a]/55"
          >
            <span className="relative min-h-[140px]">
              <Image
                src={product.image}
                alt={product.name}
                fill
                className="object-cover transition duration-500 group-hover:scale-105"
                style={{ objectPosition: product.imagePosition ?? "center" }}
              />
            </span>
            <span className="flex min-w-0 flex-col justify-center p-4">
              <span className="inline-flex w-fit items-center gap-2 rounded-full border border-[#f4c66a]/35 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-[#f4c66a]">
                <Star className="h-3 w-3 fill-current" /> Best Seller
              </span>
              <span className="mt-3 text-lg leading-tight text-white">{product.name}</span>
              <span className="mt-2 flex items-center justify-between gap-3 text-sm">
                <span className="text-[#f4c66a]">{product.priceLabel}</span>
                <span className="text-[10px] uppercase tracking-[0.22em] text-stone-500">Quick add</span>
              </span>
            </span>
          </button>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <GlassCard className="overflow-hidden p-0">
          <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="relative min-h-[420px]">
              <Image
                src={featuredArtifact.image}
                alt={featuredArtifact.name}
                fill
                className="object-cover"
              />
              <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(0,0,0,0.08),rgba(0,0,0,0.85))]" />
            </div>
            <div className="flex flex-col justify-center p-8 md:p-10">
              <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">
                {featuredArtifact.kicker}
              </p>
              <div className="mt-4 inline-flex w-fit rounded-full border border-[#f4c66a]/40 px-4 py-2 text-[11px] uppercase tracking-[0.28em] text-[#f4c66a]">
                {featuredArtifact.badge}
              </div>
              <h2 className="mt-6 font-display text-4xl uppercase tracking-[0.08em] text-white md:text-5xl">
                {featuredArtifact.name}
              </h2>
              <p className="mt-4 text-xl text-[#f4c66a]">{featuredArtifact.priceLabel}</p>
              <p className="mt-5 text-sm leading-7 text-stone-400">
                {featuredArtifact.description}
              </p>
              <div className="mt-5 grid gap-3 rounded-[24px] border border-[#f4c66a]/20 bg-[#f4c66a]/8 p-4 text-sm text-stone-200 sm:grid-cols-3">
                <span>Vinyl set</span>
                <span>Signed poster</span>
                <span>Numbered seal</span>
              </div>
              <div className="mt-6 grid gap-3 text-sm text-stone-300">
                {featuredArtifact.includes.map((item) => (
                  <div key={item} className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 h-4 w-4 text-[#f4c66a]" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <button
                  type="button"
                  onClick={() => handleAddToCart(featuredArtifact)}
                  className="rounded-full bg-[#f4c66a] px-7 py-4 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989]"
                >
                  {featuredArtifact.ctaLabel}
                </button>
                <p className="text-xs uppercase tracking-[0.25em] text-stone-500">
                  Premium pricing. Manual collector packing.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Cart + Checkout</p>
            <h3 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Your order
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Keep the cart visible while browsing. The buyer always knows what is selected, what it
              costs, and where to finish.
            </p>
            <div
              className={`mt-6 rounded-[24px] border px-5 py-4 text-sm leading-7 ${
                checkoutEnabled
                  ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-100"
                  : "border-[#f4c66a]/20 bg-[#f4c66a]/8 text-stone-200"
              }`}
            >
              {checkoutEnabled
                ? "Hosted checkout is live in this environment."
                : "This environment is using local demo checkout. You can test the cart and unlock flow without charging a card."}
            </div>
            <div className="mt-8 grid gap-3 rounded-[24px] border border-white/10 bg-black/30 p-5">
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-stone-500">
                <span>Items</span>
                <span>{cart.length}</span>
              </div>
              <div className="flex items-center justify-between text-xs uppercase tracking-[0.28em] text-stone-500">
                <span>Subtotal</span>
                <span className="text-[#f4c66a]">{formatCurrency(cartSubtotal)}</span>
              </div>
              <div className="grid gap-2 border-t border-white/10 pt-4 text-sm text-stone-300">
                {cartItems.length ? (
                  cartItems.map((item) => <span key={item}>{item}</span>)
                ) : (
                  <span>Your cart is empty. Add merch from the grid below.</span>
                )}
              </div>
            </div>
            <div className="mt-5 grid gap-3 text-sm text-stone-300 sm:grid-cols-3 lg:grid-cols-1">
              {[
                ["Secure cart", "Selections persist in this browser."],
                ["Variants saved", "Size and color stay attached."],
                ["Collector flow", "Physical and digital items share one cart."]
              ].map(([title, text]) => (
                <div key={title} className="rounded-[20px] border border-white/10 bg-black/25 p-4">
                  <p className="text-xs uppercase tracking-[0.24em] text-[#f4c66a]">{title}</p>
                  <p className="mt-2 leading-6 text-stone-400">{text}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-8 grid gap-3">
            <button
              type="button"
              onClick={() => setCartOpen(true)}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-4 text-sm uppercase tracking-[0.25em] text-white transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
            >
              <ShoppingBag className="mr-2 h-4 w-4" />
              Open Cart Drawer
            </button>
            {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
            {trackingStatus ? <p className="text-sm text-stone-300">{trackingStatus}</p> : null}
          </div>
        </GlassCard>
      </div>

      <div id="featured" className="scroll-mt-28">
        <SectionHeading
          eyebrow="Shop Merch"
          title="Pick the piece. Choose the variant. Add to cart."
          description="The catalog now behaves like a real merch wall: strongest apparel first, clear prices, visible variants, and direct add-to-cart buttons on every product."
        />
        <div className="mt-6 flex flex-wrap gap-3 text-[11px] uppercase tracking-[0.28em] text-stone-400">
          <span className="rounded-full border border-[#f4c66a]/35 bg-[#f4c66a]/10 px-4 py-2 text-[#f4c66a]">
            Official merch drop
          </span>
          <span className="rounded-full border border-white/10 px-4 py-2">Tees $38-$52</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Hoodie $78</span>
          <span className="rounded-full border border-white/10 px-4 py-2">Accessories $24-$32</span>
        </div>
        <div className="mt-10 grid gap-4 rounded-[28px] border border-white/10 bg-black/25 p-6 md:grid-cols-[1fr_auto] md:items-center">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">Merch Capsule</p>
              <h3 className="mt-3 text-3xl text-white">Logo essentials, Echoes tees, collector prints</h3>
            </div>
          </div>
          <div className="flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.24em] text-stone-400">
            <span className="rounded-full border border-white/10 px-4 py-2">Black</span>
            <span className="rounded-full border border-white/10 px-4 py-2">White</span>
            <span className="rounded-full border border-white/10 px-4 py-2">Sand</span>
          </div>
          <p className="max-w-4xl text-sm leading-7 text-stone-400 md:col-span-2">
            Crest tees, wordmark tees, signal-target variants, and the core KAMDRIDI essentials now
            sit together as the main merch wall, with lower-priced accessories and prints supporting
            the bigger apparel sale.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {merchProducts.map((product) => renderProductCard(product))}
        </div>
        {digitalAccessProducts.length ? (
          <div className="mt-14 grid gap-6">
            <SectionHeading
              eyebrow="Game Access"
              title="Direct licenses for the browser games"
              description="The game licenses are still purchasable from the store, but they now sit in their own section so the merch catalog reads cleanly."
            />
            <div className="grid gap-6 lg:grid-cols-2">
              {digitalAccessProducts.map((product) => renderProductCard(product))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard>
          <SectionHeading
            eyebrow="Fulfillment"
            title="Checkout and fulfillment flow"
            description="Orders move through the KAMDRIDI cart, with the payment state called out clearly so local demo checkout never looks like a live charge flow."
          />
          <div className="mt-8 grid gap-4">
            {[
              {
                icon: ShieldCheck,
                title: checkoutEnabled ? "Hosted payment live" : "Demo checkout active",
                text: checkoutEnabled
                  ? "This environment can hand off to hosted payment for real checkout."
                  : "This environment stays in local demo mode until live checkout credentials are connected."
              },
              {
                icon: PackageCheck,
                title: "Variants captured",
                text: "Size, color, and product details travel into the cart so orders are clean."
              },
              {
                icon: Truck,
                title: "Delivery ready",
                text: "Physical products can route through direct KAMDRIDI fulfillment, while digital game access unlocks in the browser after checkout."
              }
            ].map((step) => (
              <div key={step.title} className="flex gap-4 rounded-[24px] border border-white/10 bg-black/30 p-5">
                <step.icon className="mt-1 h-5 w-5 text-[#f4c66a]" />
                <div>
                  <p className="text-xs uppercase tracking-[0.35em] text-[#f4c66a]">{step.title}</p>
                  <p className="mt-3 text-sm leading-7 text-stone-400">{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </GlassCard>

        <GlassCard>
          <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Fulfillment Scope</p>
          <h3 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
            Current catalog
          </h3>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            The storefront covers merch, collector offers, and direct browser-game access with one
            clean order path across the current catalog, with the checkout state made explicit for this environment.
          </p>
          <div className="mt-8 grid gap-3">
            {catalogProductNames.map((product) => (
              <div
                key={product}
                className="rounded-[22px] border border-white/10 bg-black/30 px-5 py-4 text-sm text-stone-300"
              >
                {product}
              </div>
            ))}
          </div>
          <div className="mt-8">
            <CTAButton href="/fan-club" tone="secondary">
              Unlock Collector Access
            </CTAButton>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
