"use client";

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { products } from "@/data/site";
import { GlassCard } from "@/components/ui";

export function Storefront() {
  const searchParams = useSearchParams();
  const [status, setStatus] = useState<string | null>(null);
  const handledState = useRef<string | null>(null);

  useEffect(() => {
    const purchaseState = searchParams.get("purchase");
    if (!purchaseState || handledState.current === purchaseState) {
      return;
    }

    handledState.current = purchaseState;

    if (purchaseState === "success") {
      setStatus("Purchase confirmed. Thank you for supporting KAMDRIDI.");
    }

    if (purchaseState === "cancelled") {
      setStatus("Checkout was cancelled. You can return any time.");
    }
  }, [searchParams]);

  return (
    <div className="grid gap-10">
      <GlassCard className="grid gap-3">
        <p className="text-xs uppercase tracking-[0.45em] text-[#f4c66a]">Hosted Stripe Checkout</p>
        <p className="max-w-3xl text-sm leading-7 text-stone-400">
          Every product opens its secure Stripe hosted checkout in a new tab. To show the return
          confirmation on this page, set each Stripe Payment Link redirect URL to
          `/store?purchase=success`.
        </p>
        {status ? <p className="text-sm text-emerald-200">{status}</p> : null}
      </GlassCard>

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
              <div className="mt-6 flex items-center justify-between gap-4">
                <span className="text-lg text-[#f4c66a]">{product.priceLabel}</span>
                {product.checkoutUrl ? (
                  <a
                    href={product.checkoutUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="rounded-full bg-[#f4c66a] px-5 py-3 text-xs uppercase tracking-[0.25em] text-black transition hover:bg-[#ffd989]"
                  >
                    Buy
                  </a>
                ) : (
                  <span className="rounded-full border border-white/10 px-4 py-2 text-[11px] uppercase tracking-[0.25em] text-stone-500">
                    Add payment link
                  </span>
                )}
              </div>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
