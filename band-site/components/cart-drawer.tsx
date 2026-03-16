"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { useState } from "react";
import { useApp } from "@/components/providers";

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD"
  }).format(value);
}

export function CartDrawer() {
  const {
    cart,
    cartSubtotal,
    clearCart,
    checkout,
    isCartOpen,
    removeFromCart,
    setCartOpen,
    updateCartQuantity
  } = useApp();
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCheckout() {
    setIsLoading(true);
    setMessage(null);

    const result = await checkout();

    setIsLoading(false);
    if (!result.ok) {
      setMessage(result.message ?? "Checkout failed.");
    }
  }

  return (
    <>
      <div
        className={`fixed inset-0 z-[2100] bg-black/70 transition ${isCartOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"}`}
        onClick={() => setCartOpen(false)}
      />
      <aside
        className={`fixed right-0 top-0 z-[2200] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#090909] shadow-[0_0_80px_rgba(0,0,0,0.6)] transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">Cart</p>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
              Merch Loadout
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-6">
          {cart.length ? (
            <div className="grid gap-4">
              {cart.map((item) => (
                <div
                  key={`${item.id}-${item.color ?? "default"}-${item.size ?? "default"}`}
                  className="rounded-[24px] border border-white/10 bg-white/[0.04] p-4"
                >
                  <div className="flex gap-4">
                    <div className="relative h-24 w-24 overflow-hidden rounded-2xl bg-black/40">
                      <Image src={item.image} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm uppercase tracking-[0.28em] text-stone-500">
                        {item.color ?? item.size ? [item.color, item.size].filter(Boolean).join(" / ") : "Standard"}
                      </p>
                      <h3 className="mt-2 text-lg text-white">{item.name}</h3>
                      <p className="mt-2 text-sm text-[#f4c66a]">{formatCurrency(item.price)}</p>
                      <div className="mt-4 flex items-center justify-between">
                        <div className="inline-flex items-center rounded-full border border-white/10 bg-black/30 px-2 py-1">
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity - 1, item.size, item.color)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-300 transition hover:text-[#f4c66a]"
                            aria-label={`Decrease quantity for ${item.name}`}
                          >
                            <Minus className="h-4 w-4" />
                          </button>
                          <span className="min-w-8 text-center text-sm text-white">{item.quantity}</span>
                          <button
                            type="button"
                            onClick={() =>
                              updateCartQuantity(item.id, item.quantity + 1, item.size, item.color)
                            }
                            className="inline-flex h-8 w-8 items-center justify-center rounded-full text-stone-300 transition hover:text-[#f4c66a]"
                            aria-label={`Increase quantity for ${item.name}`}
                          >
                            <Plus className="h-4 w-4" />
                          </button>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeFromCart(item.id, item.size, item.color)}
                          className="text-xs uppercase tracking-[0.25em] text-stone-500 transition hover:text-[#f4c66a]"
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="inline-flex h-16 w-16 items-center justify-center rounded-full border border-white/10 bg-white/[0.04] text-[#f4c66a]">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="mt-6 font-display text-3xl uppercase tracking-[0.08em] text-white">
                Cart is empty
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-stone-400">
                Add KAMDRIDI merch, vinyl, or the collector artifact to begin secure checkout.
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-stone-400">
            <span>Subtotal</span>
            <span className="text-lg text-[#f4c66a]">{formatCurrency(cartSubtotal)}</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-stone-500">
            Stripe hosted checkout supports credit card, Apple Pay, and Google Pay when available.
          </p>
          {message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={!cart.length || isLoading}
              className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? "Opening Checkout..." : "Secure Checkout"}
            </button>
            <button
              type="button"
              onClick={clearCart}
              disabled={!cart.length}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.25em] text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              Clear Cart
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
