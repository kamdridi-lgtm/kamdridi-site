"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/site";
import { useApp } from "@/components/providers";
import { formatCurrency } from "@/lib/utils";
import { GlassCard } from "@/components/ui";

export function Storefront() {
  const searchParams = useSearchParams();
  const { addToCart, cart, removeFromCart, checkout, clearCart } = useApp();
  const [sizes, setSizes] = useState<Record<string, string>>({});
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const handledCheckoutState = useRef<string | null>(null);

  useEffect(() => {
    const checkoutState = searchParams.get("checkout");
    if (!checkoutState || handledCheckoutState.current === checkoutState) {
      return;
    }

    handledCheckoutState.current = checkoutState;

    if (checkoutState === "success") {
      clearCart();
      setStatus("Checkout completed successfully.");
    }
    if (checkoutState === "cancelled") {
      setStatus("Checkout was cancelled. Your cart is still here.");
    }
  }, [searchParams, clearCart]);

  async function handleCheckout() {
    setLoading(true);
    setStatus(null);
    const result = await checkout();
    setLoading(false);
    if (!result.ok) {
      setStatus(result.message ?? "Checkout failed.");
    }
  }

  return (
    <div className="grid gap-10">
      <div id="featured" className="grid scroll-mt-28 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {products.map((product) => (
          <GlassCard key={product.id} className="overflow-hidden p-0">
            <div className="relative h-80 bg-black/40">
              <Image src={product.image} alt={product.name} fill className="object-cover transition duration-500 hover:scale-105" />
              {product.limited ? (
                <div className="absolute left-4 top-4 rounded-full bg-[#f4c66a] px-3 py-1 text-[10px] uppercase tracking-[0.25em] text-black">
                  Limited
                </div>
              ) : null}
            </div>
            <div className="p-6">
              <p className="text-xs uppercase tracking-[0.35em] text-stone-500">{product.category}</p>
              <h3 className="mt-3 text-2xl text-white">{product.name}</h3>
              <p className="mt-4 text-sm leading-7 text-stone-400">{product.description}</p>
              {product.sizes ? (
                <select
                  className="mt-5 w-full rounded-full border border-white/10 bg-black/40 px-4 py-3 text-sm text-white"
                  value={sizes[product.id] ?? product.sizes[0]}
                  onChange={(event) =>
                    setSizes((current) => ({ ...current, [product.id]: event.target.value }))
                  }
                >
                  {product.sizes.map((size) => (
                    <option key={size} value={size}>
                      Size {size}
                    </option>
                  ))}
                </select>
              ) : null}
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-lg text-[#f4c66a]">{formatCurrency(product.price)}</span>
                <button
                  type="button"
                  onClick={() =>
                    addToCart({
                      id: product.id,
                      image: product.image,
                      name: product.name,
                      price: product.price,
                      size: product.sizes ? sizes[product.id] ?? product.sizes[0] : undefined
                    })
                  }
                  className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
                >
                  Add to cart
                </button>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      <GlassCard id="cart" className="scroll-mt-28">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Cart</p>
            <h2 className="mt-4 font-display text-4xl uppercase tracking-[0.08em] text-white">
              Ready for checkout
            </h2>
            <p className="mt-4 max-w-xl text-sm leading-7 text-stone-400">
              Stripe is wired through the backend route. In local development the app can fall back
              to a simulated success flow when Stripe keys are not configured yet.
            </p>
          </div>
          <button
            type="button"
            disabled={!cart.length || loading}
            onClick={handleCheckout}
            className="rounded-full bg-[#f4c66a] px-6 py-4 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Redirecting..." : "Checkout with Stripe"}
          </button>
        </div>
        <div className="mt-8 grid gap-4">
          {cart.length ? (
            cart.map((item) => (
              <div key={`${item.id}-${item.size ?? "na"}`} className="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 p-4 md:flex-row md:items-center md:justify-between">
                <div className="flex items-center gap-4">
                  <div className="relative h-20 w-20 overflow-hidden rounded-2xl">
                    <Image src={item.image} alt={item.name} fill className="object-cover" />
                  </div>
                  <div>
                    <p className="text-lg text-white">{item.name}</p>
                    <p className="text-sm text-stone-500">
                      Qty {item.quantity}{item.size ? ` · Size ${item.size}` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-[#f4c66a]">{formatCurrency(item.price * item.quantity)}</span>
                  <button
                    type="button"
                    onClick={() => removeFromCart(item.id, item.size)}
                    className="rounded-full border border-white/10 px-4 py-2 text-xs uppercase tracking-[0.25em] text-stone-200 transition hover:border-[#f4c66a]/50 hover:text-[#f4c66a]"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          ) : (
            <p className="text-sm text-stone-400">Your cart is empty. Add merch to begin checkout.</p>
          )}
        </div>
        {status ? <p className="mt-4 text-sm text-rose-300">{status}</p> : null}
      </GlassCard>
    </div>
  );
}
