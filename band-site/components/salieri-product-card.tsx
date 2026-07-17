"use client";

import Image from "next/image";
import { ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { getCommerceProductById } from "@/data/commerce-products";

type SalieriProductCardProps = {
  id: string;
  name: string;
  status: string;
  description: string;
  price: number;
  image: string;
  alt: string;
    secondaryImage?: string;
  secondaryAlt?: string;
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
    secondaryImage,
  secondaryAlt,
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
      <div className="relative aspect-[4/3] border-b border-[#bd8b45]/25 bg-[radial-gradient(circle_at_50%_34%,rgba(226,173,82,0.1),transparent_48%),#050403]">
        <Image src={image} alt={alt} fill className="object-contain p-3" sizes="(max-width: 768px) 100vw, 33vw" />
        {secondaryImage && secondaryAlt ? (
          <div className="absolute bottom-3 right-3 h-20 w-20 overflow-hidden border border-[#efc36f]/50 bg-black/78 shadow-[0_12px_30px_rgba(0,0,0,0.55)] sm:h-24 sm:w-24">
            <Image src={secondaryImage} alt={secondaryAlt} fill className="object-cover" sizes="96px" />
          </div>
        ) : null}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-[#e3b86a]">{status}</p>
            <h3 className="mt-3 font-serif text-xl uppercase leading-tight text-[#ffe0aa] sm:mt-4 sm:text-2xl">{name}</h3>
          </div>
          <p className="shrink-0 text-lg font-semibold text-[#ffd98b]">{formatCurrency(price)}</p>
        </div>
        <p className="mt-3 text-sm leading-6 text-[#d9c09a] sm:mt-4 sm:leading-7">{description}</p>

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
export function SalieriQuickBuy({
  id,
  color,
  size
}: {
  id: string;
  color?: string;
  size?: string;
}) {
  const { addToCart, setCartOpen } = useApp();
  const product = getCommerceProductById(id);

  if (!product) return null;

  function handleQuickBuy() {
    addToCart({
      id,
      name: product!.name,
      price: product!.priceCents / 100,
      image: product!.images[0],
      color,
      size
    });
    setCartOpen(true);
  }

  return (
    <button
      type="button"
      onClick={handleQuickBuy}
      className="group flex min-h-16 items-center justify-between gap-4 border border-[#efc36f]/45 bg-black/42 px-4 py-3 text-left transition hover:-translate-y-0.5 hover:border-[#ffd98b] hover:bg-[#e2ad52]/16"
    >
      <span>
        <span className="block text-[10px] font-black uppercase tracking-[0.24em] text-[#e3b86a]">Quick Add</span>
        <span className="mt-1 block font-serif text-lg uppercase leading-tight text-[#ffe0aa]">{product.name}</span>
      </span>
      <span className="shrink-0 text-sm font-black text-[#ffd98b]">{formatCurrency(product.priceCents / 100)}</span>
    </button>
  );
}