"use client";

import Image from "next/image";
import { ShoppingBag, Lock, ExternalLink } from "lucide-react";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { useApp } from "@/components/providers";
import { getVisibleCommerceProducts, CommerceProduct } from "@/data/commerce-products";

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
  
  const [activeFilter, setActiveFilter] = useState<string>("ALL");
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string | undefined>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string | undefined>>({});

  useEffect(() => {
    const purchaseState = searchParams.get("purchase") || searchParams.get("checkout");
    if (purchaseState === "success" || purchaseState === "demo") {
      clearCart();
      window.localStorage.removeItem("kamdridi-pending-checkout");
      setStatus(purchaseState === "success" ? "Order confirmed." : "Demo checkout completed.");
    } else if (purchaseState === "cancelled") {
      setStatus("Checkout cancelled.");
    }
  }, [clearCart, searchParams]);

  const allProducts = getVisibleCommerceProducts();

  const getButtonLabel = (product: CommerceProduct) => {
    if (product.saleMode === "sold_out") return "SOLD OUT";
    if (product.saleMode === "preorder") return "PRE-ORDER";
    if (product.saleMode === "digital") return "ORDER DIGITAL";
    return "ADD TO CART";
  };

  const handleAddToCart = (product: CommerceProduct) => {
    if (product.saleMode === "sold_out") return;
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

    return (
      <div key={product.id} className="group relative flex flex-col overflow-hidden rounded-[24px] border border-white/10 bg-black/40">
        <div className="relative aspect-square overflow-hidden bg-black/60">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className={`object-cover transition duration-700 ${isSoldOut ? 'grayscale opacity-50' : 'group-hover:scale-105'}`}
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
        </div>
        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-center justify-between text-[10px] uppercase tracking-[0.2em] text-stone-500">
            <span>{product.projectSlug.replace(/-/g, ' ')}</span>
            <span>{product.category}</span>
          </div>
          <div className="flex items-start justify-between gap-4">
            <h3 className="font-display text-xl uppercase tracking-wider text-white">{product.name}</h3>
            <span className="shrink-0 text-lg text-[#f4c66a]">{formatCurrency(product.priceCents / 100)}</span>
          </div>
          <p className="mt-2 text-sm leading-6 text-stone-400">{product.description}</p>
          
          {product.colors && product.colors.length > 0 && (
            <div className="mt-4">
              <div className="mb-2 text-[10px] uppercase tracking-[0.2em] text-stone-500">Color</div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map(c => (
                  <button
                    key={c}
                    onClick={() => setSelectedColors(prev => ({ ...prev, [product.id]: c }))}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${selectedColors[product.id] === c || (!selectedColors[product.id] && product.colors![0] === c) ? 'border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]' : 'border-white/10 text-stone-400'}`}
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
                {product.sizes.map(s => (
                  <button
                    key={s}
                    onClick={() => setSelectedSizes(prev => ({ ...prev, [product.id]: s }))}
                    className={`rounded-full border px-3 py-1.5 text-[10px] uppercase tracking-[0.2em] ${selectedSizes[product.id] === s || (!selectedSizes[product.id] && product.sizes![0] === s) ? 'border-[#f4c66a] bg-[#f4c66a]/10 text-[#f4c66a]' : 'border-white/10 text-stone-400'}`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}

          <button
            onClick={() => handleAddToCart(product)}
            disabled={isSoldOut}
            className={`mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full py-4 text-xs font-bold uppercase tracking-[0.2em] transition ${isSoldOut ? 'bg-stone-800 text-stone-500 cursor-not-allowed' : 'bg-[#f4c66a] text-black hover:bg-[#ffd989]'}`}
          >
            {getButtonLabel(product)}
            {!isSoldOut && <ShoppingBag className="h-4 w-4" />}
          </button>
        </div>
      </div>
    );
  };

  const filters = [
    { label: "ALL", value: "ALL" },
    { label: "ECHOES BRASIL", value: "echoes-brasil" },
    { label: "SALIERI", value: "salieris-hands" },
    { label: "ECHOES UNEARTHED", value: "echoes-unearthed" },
    { label: "KAMDRIDI", value: "kamdridi-core" },
    { label: "DIGITAL", value: "digital" }
  ];

  const filteredProducts = allProducts.filter(p => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "digital") return p.category === "Digital Access" || p.saleMode === "digital";
    return p.projectSlug === activeFilter;
  });

  const featured = filteredProducts.filter(p => p.id === "kamdridi-gold-logo-tee" || p.id === "echoes-unearthed-crest-tee" || p.id === "echoes-brasil-expanded");
  const echoesBrasil = filteredProducts.filter(p => p.projectSlug === "echoes-brasil" && !featured.includes(p));
  const salieri = filteredProducts.filter(p => p.projectSlug === "salieris-hands");
  const echoesUnearthed = filteredProducts.filter(p => p.projectSlug === "echoes-unearthed" && !featured.includes(p));
  const kamdridiCore = filteredProducts.filter(p => p.projectSlug === "kamdridi-core" && !featured.includes(p) && p.category !== "Digital Access");
  const digitalAccess = filteredProducts.filter(p => p.category === "Digital Access" || p.saleMode === "digital");

  return (
    <div className="grid gap-16">
      {status && (
        <div className="rounded-[24px] border border-emerald-500/20 bg-emerald-500/10 p-4 text-center text-sm font-semibold tracking-wide text-emerald-200">
          {status}
        </div>
      )}

      {/* FILTERS */}
      <div className="flex flex-wrap justify-center gap-3">
        {filters.map(f => (
          <button
            key={f.value}
            onClick={() => setActiveFilter(f.value)}
            className={`rounded-full border px-5 py-2.5 text-xs font-bold uppercase tracking-[0.2em] transition ${activeFilter === f.value ? 'border-[#f4c66a] bg-[#f4c66a] text-black' : 'border-white/20 bg-black/50 text-stone-400 hover:border-[#f4c66a]/50 hover:text-[#f4c66a]'}`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* SECTIONS */}
      {featured.length > 0 && activeFilter === "ALL" && (
        <section>
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-[#f4c66a]">Featured</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {featured.map(renderProductCard)}
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
          <h2 className="mb-8 font-display text-3xl uppercase tracking-widest text-white">Salieri's Hands</h2>
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
