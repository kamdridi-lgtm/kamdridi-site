import Image from "next/image";
import { notFound } from "next/navigation";
import { EchoesDraftProduct } from "@/data/echoes-brasil-products";

export default function EchoesBrasilProductPage({ product }: { product: EchoesDraftProduct }) {
  if (process.env.NEXT_PUBLIC_ENABLE_ECHOES_STORE_DRAFTS !== "true") {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#080604] font-sans text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-12 md:py-24">
        <div className="mb-6">
          <span className="inline-block rounded-full border border-red-900/50 bg-red-950/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-red-400">
            DRAFT PREVIEW
          </span>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-amber-500/20 bg-black shadow-[0_0_50px_rgba(245,158,11,0.05)]">
            <Image
              src={product.images[0]}
              alt={`${product.title} - ${product.subtitle}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-col justify-center">
            <h1 className="font-display text-4xl uppercase tracking-[0.05em] text-white md:text-5xl">
              {product.title}
            </h1>
            <p className="mt-2 text-xl uppercase tracking-[0.1em] text-amber-500/90">
              {product.subtitle}
            </p>

            <div className="mb-8 mt-8 h-px w-full bg-gradient-to-r from-amber-500/30 to-transparent" />

            <p className="text-base leading-relaxed text-stone-300">
              {product.description}
            </p>

            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">
                Conteúdo Incluído
              </h3>
              <ul className="mt-4 space-y-2 text-sm text-amber-100/70">
                {product.includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 grid gap-6 rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between">
                  <span className="text-xs uppercase tracking-[0.2em] text-stone-500">Preço</span>
                  <span className="font-mono text-lg text-[#f4c66a]">
                    {product.priceCents
                      ? new Intl.NumberFormat("fr-CA", {
                          style: "currency",
                          currency: product.currency || "CAD",
                        }).format(product.priceCents / 100) + " CAD"
                      : "À CONFIRMER"}
                  </span>
                </div>
                <div className="text-right text-[10px] text-stone-500 uppercase tracking-widest">
                  Frete calculado separadamente.
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500">Estoque</span>
                <span className="font-mono text-sm text-stone-400">
                  {product.inventoryStatus === "preorder" ? "PRÉ-VENDA" : "À CONFIRMER"}
                </span>
              </div>
              
              <button
                disabled
                className="mt-4 w-full cursor-not-allowed rounded-full border border-stone-800 bg-stone-900 py-4 text-xs uppercase tracking-[0.2em] text-stone-500 transition-colors"
              >
                CHECKOUT DISABLED — DRAFT
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
