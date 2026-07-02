"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";

type SalieriProductCardProps = {
  id: string;
  name: string;
  status: string;
  description: string;
  price: number;
  image: string;
  alt: string;
  colors?: string[];
  sizes?: string[];
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "CAD"
  }).format(value);
}

export function SalieriProductCard({
  id,
  name,
  status,
  description,
  price,
  image,
  alt,
  colors,
  sizes
}: SalieriProductCardProps) {
  const { addToCart, setCartOpen } = useApp();
  const [selectedColor, setSelectedColor] = useState(colors?.[0]);
  const [selectedSize, setSelectedSize] = useState(sizes?.[0]);

  function handleAddToCart() {
    addToCart({
      id,
      name,
      price,
      image,
      color: selectedColor,
      size: selectedSize
    });
    setCartOpen(true);
  }

  return (
    <article className="flex min-h-full flex-col overflow-hidden border border-[#bd8b45]/45 bg-[radial-gradient(circle_at_28%_0%,rgba(255,210,126,0.14),transparent_40%),linear-gradient(180deg,rgba(27,15,8,0.94),rgba(9,5,3,0.96))]">
      <div className="relative aspect-[4/3] border-b border-[#bd8b45]/25 bg-black">
        <Image src={image} alt={alt} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
      </div>
      <div className="flex flex-1 flex-col p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e3b86a]">{status}</p>
            <h3 className="mt-4 font-serif text-2xl uppercase leading-tight text-[#ffe0aa]">{name}</h3>
          </div>
          <p className="shrink-0 text-lg font-semibold text-[#ffd98b]">{formatCurrency(price)}</p>
        </div>
        <p className="mt-4 text-sm leading-7 text-[#d9c09a]">{description}</p>

        {colors?.length ? (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  onClick={() => setSelectedColor(color)}
                  className={`border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${
                    selectedColor === color
                      ? "border-[#ffd98b] bg-[#f4c66a] text-black"
                      : "border-[#bd8b45]/35 text-[#e3b86a] hover:border-[#ffd98b]"
                  }`}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {sizes?.length ? (
          <div className="mt-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-stone-400">Size</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`min-w-10 border px-3 py-2 text-[10px] font-bold uppercase tracking-[0.18em] transition ${
                    selectedSize === size
                      ? "border-[#ffd98b] bg-[#f4c66a] text-black"
                      : "border-[#bd8b45]/35 text-[#e3b86a] hover:border-[#ffd98b]"
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={handleAddToCart}
          className="mt-auto inline-flex min-h-12 items-center justify-center gap-2 border border-[#efc36f]/60 bg-[#e2ad52] px-5 py-3 text-xs font-black uppercase tracking-[0.22em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd98b]"
        >
          <ShoppingBag className="h-4 w-4" />
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export function SalieriCheckoutStatus() {
  const searchParams = useSearchParams();
  const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
  const { clearCart } = useApp();

  useEffect(() => {
    if (purchaseState === "success" || purchaseState === "demo") {
      clearCart();
      window.localStorage.removeItem("kamdridi-pending-checkout");
    }
  }, [clearCart, purchaseState]);

  if (!purchaseState) {
    return null;
  }

  const message =
    purchaseState === "cancelled"
      ? "Checkout was cancelled. Your cart is still available."
      : purchaseState === "demo"
        ? "Demo checkout completed. Connect Stripe credentials for live payment collection."
        : "Checkout confirmed. Your Salieri's Hands order has been received.";

  return (
    <div className="mt-6 border border-[#efc36f]/50 bg-[#e2ad52]/10 p-4 text-sm font-semibold leading-7 text-[#ffe7bd]">
      {message}
    </div>
  );
}