"use client";

import Image from "next/image";
import { ShoppingBag, ShieldCheck, Sparkles, Truck } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { CTAButton, GlassCard, SectionHeading } from "@/components/ui";
import {
  autoFulfillmentProducts,
  featuredArtifact,
  storefrontGrid,
  type StoreColor,
  type StoreProduct,
  type StoreSize
} from "@/data/store";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function Storefront() {
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

  useEffect(() => {
    const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
    if (!purchaseState || handledState.current === purchaseState) {
      return;
    }

    handledState.current = purchaseState;

    if (purchaseState === "success") {
      clearCart();
      setStatus("Purchase confirmed. Your KAMDRIDI order is locked in.");
    }

    if (purchaseState === "cancelled") {
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

  return (
    <div className="grid gap-14">
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
                  Automatic checkout. Manual artifact packing.
                </p>
              </div>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="flex flex-col justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Cart + Checkout</p>
            <h3 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Ready to deploy
            </h3>
            <p className="mt-4 text-sm leading-7 text-stone-400">
              Review your loadout, open the drawer, and launch Stripe Checkout with credit card,
              Apple Pay, or Google Pay.
            </p>
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
          eyebrow="Product Grid"
          title="Collector apparel, vinyl, and physical formats"
          description="Premium KAMDRIDI merch configured for cart-based checkout, live order tracking, and fulfillment routing."
        />
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {storefrontGrid.map((product) => (
            <GlassCard key={product.id} className="overflow-hidden p-0">
              <div className="relative h-80 bg-black/40">
                <Image
                  src={product.image}
                  alt={product.name}
                  fill
                  className="object-cover transition duration-500 hover:scale-105"
                />
              </div>
              <div className="p-6">
                <p className="text-xs uppercase tracking-[0.35em] text-stone-500">
                  {product.category}
                </p>
                <h3 className="mt-3 text-2xl text-white">{product.name}</h3>
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
                <div className="mt-6 flex items-center justify-between gap-4">
                  <span className="text-lg text-[#f4c66a]">{product.priceLabel}</span>
                  <button
                    type="button"
                    onClick={() => handleAddToCart(product)}
                    className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
        <GlassCard>
          <SectionHeading
            eyebrow="Automatic Fulfillment"
            title="Stripe to Printful to doorstep"
            description="Orders route through hosted Stripe Checkout and automatically flow into production and shipping for eligible merch."
          />
          <div className="mt-8 grid gap-4">
            {[
              {
                icon: ShieldCheck,
                title: "Payment secured",
                text: "Stripe Checkout handles payment methods, wallet support, and secure customer checkout."
              },
              {
                icon: Sparkles,
                title: "Webhook triggered",
                text: "A completed Stripe order fires the webhook and prepares production data for Printful."
              },
              {
                icon: Truck,
                title: "Production and shipping",
                text: "Printful produces eligible items and ships directly to the customer with the order details."
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
            Automated where it matters
          </h3>
          <p className="mt-4 text-sm leading-7 text-stone-400">
            Printful automation is prepared for apparel and poster-style drops, while collector
            bundles and physical music can still be packed with a higher-touch manual workflow.
          </p>
          <div className="mt-8 grid gap-3">
            {autoFulfillmentProducts.map((product) => (
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
