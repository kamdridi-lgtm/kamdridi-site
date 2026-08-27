"use client";

import Image from "next/image";
import { useSearchParams } from "next/navigation";
import type { CommerceProduct } from "@/data/commerce-products";
import { useApp } from "@/components/providers";

type Locale = "pt" | "en" | "fr";

const copy = {
  pt: {
    madeToOrder: "PRODUZIDO SOB ENCOMENDA",
    included: "Conteúdo incluído",
    price: "Preço",
    shipping: "Os dados de envio são coletados no checkout.",
    stock: "Produção",
    onDemand: "SOB ENCOMENDA",
    fulfillment:
      "Produção sob encomenda: a fabricação começa após o pagamento. Reserve algumas semanas para produção e entrega.",
    addToCart: "ADICIONAR AO CARRINHO",
    priceTba: "A CONFIRMAR"
  },
  en: {
    madeToOrder: "MADE TO ORDER",
    included: "Included",
    price: "Price",
    shipping: "Shipping details are collected at checkout.",
    stock: "Production",
    onDemand: "ON DEMAND",
    fulfillment:
      "Made to order: production begins after payment. Please allow several weeks for manufacturing and delivery.",
    addToCart: "ADD TO CART",
    priceTba: "TO BE CONFIRMED"
  },
  fr: {
    madeToOrder: "FABRIQUÉ SUR COMMANDE",
    included: "Contenu inclus",
    price: "Prix",
    shipping: "Les informations d’expédition sont recueillies au paiement.",
    stock: "Production",
    onDemand: "SUR COMMANDE",
    fulfillment:
      "Fabriqué sur commande : la production commence après le paiement. Prévoir plusieurs semaines pour la fabrication et la livraison.",
    addToCart: "AJOUTER AU PANIER",
    priceTba: "À CONFIRMER"
  }
} as const;

const localizedDescriptions: Record<string, Record<Locale, string>> = {
  "echoes-brasil-expanded-2026": {
    pt: "Apresentação refinada do álbum com visual principal, programa atual de 14 títulos e pedido direto ao artista.",
    en: "Refined album presentation with the main artwork, current 14-title programme and direct artist ordering.",
    fr: "Présentation raffinée de l’album avec visuel principal, programme actuel de 14 titres et commande directe auprès de l’artiste."
  },
  "echoes-brasil-livreto-2026": {
    pt: "Livreto de colecionador de 16 páginas com imagens, créditos e o universo visual de ECHOES UNlive in Brasil.",
    en: "16-page collector booklet with imagery, credits and the visual world of ECHOES UNlive in Brasil.",
    fr: "Livret de collection de 16 pages avec images, crédits et univers visuel de ECHOES UNlive in Brasil."
  },
  "echoes-brasil-deluxe-2026": {
    pt: "Apresentação deluxe de colecionador com estojo premium, disco preto e cartão da edição.",
    en: "Deluxe collector presentation with premium case, black disc and edition card.",
    fr: "Présentation deluxe de collection avec boîtier premium, disque noir et carte de l’édition."
  }
};

const itemTranslations: Record<string, Record<Locale, string>> = {
  "Jewel-case CD presentation": {
    pt: "Apresentação em CD jewel case",
    en: "Jewel-case CD presentation",
    fr: "Présentation CD en boîtier jewel case"
  },
  "Current 14-track programme including bonus sessions": {
    pt: "Programa atual de 14 títulos, incluindo sessões bônus",
    en: "Current 14-track programme including bonus sessions",
    fr: "Programme actuel de 14 titres, incluant les sessions bonus"
  },
  "Full-color disc, insert and tray-card artwork": {
    pt: "Arte colorida do disco, encarte e tray card",
    en: "Full-color disc, insert and tray-card artwork",
    fr: "Visuels couleur du disque, de l’encart et du tray card"
  },
  "16-page collector booklet": {
    pt: "Livreto de colecionador de 16 páginas",
    en: "16-page collector booklet",
    fr: "Livret de collection de 16 pages"
  },
  "4.75 × 4.75 in square format": {
    pt: "Formato quadrado 4,75 × 4,75 pol.",
    en: "4.75 × 4.75 in square format",
    fr: "Format carré 4,75 × 4,75 po"
  },
  "Full-color saddle-stitched presentation": {
    pt: "Apresentação colorida com grampeamento saddle stitch",
    en: "Full-color saddle-stitched presentation",
    fr: "Présentation couleur avec reliure piquée à cheval"
  },
  "Premium case": {
    pt: "Estojo premium",
    en: "Premium case",
    fr: "Boîtier premium"
  },
  "Black disc": {
    pt: "Disco preto",
    en: "Black disc",
    fr: "Disque noir"
  },
  "Edition card": {
    pt: "Cartão da edição",
    en: "Edition card",
    fr: "Carte de l’édition"
  },
  "12-inch black vinyl": {
    pt: "Vinil preto de 12 polegadas",
    en: "12-inch black vinyl",
    fr: "Vinyle noir 12 pouces"
  },
  "Full-color jacket and labels": {
    pt: "Capa e rótulos coloridos",
    en: "Full-color jacket and labels",
    fr: "Pochette et étiquettes couleur"
  },
  "Made-to-order collector edition": {
    pt: "Edição de colecionador produzida sob encomenda",
    en: "Made-to-order collector edition",
    fr: "Édition de collection fabriquée sur commande"
  }
};

function resolveLocale(raw: string | null): Locale {
  if (raw === "en" || raw === "fr") return raw;
  return "pt";
}

export default function EchoesBrasilProductPage({
  product,
  includedItems
}: {
  product: CommerceProduct;
  includedItems: string[];
}) {
  const { addToCart, setCartOpen } = useApp();
  const searchParams = useSearchParams();
  const locale = resolveLocale(searchParams.get("lang"));
  const t = copy[locale];

  return (
    <main lang={locale === "pt" ? "pt-BR" : locale} translate="no" className="min-h-screen bg-[#080604] font-sans text-stone-300">
      <div className="mx-auto max-w-6xl px-6 py-10 md:py-20">
        <div className="mb-7 flex flex-wrap items-center justify-between gap-4">
          <span className="inline-block rounded-full border border-amber-900/50 bg-amber-950/30 px-3 py-1 text-[10px] uppercase tracking-[0.2em] text-amber-500">
            {t.madeToOrder}
          </span>
          <nav
            aria-label="Idioma / Language / Langue"
            className="flex items-center gap-1.5 rounded-full border border-white/15 bg-black/65 p-1.5"
          >
            {[
              ["pt", "🇧🇷", "Português"],
              ["en", "🇬🇧", "English"],
              ["fr", "🇫🇷", "Français"]
            ].map(([value, flag, label]) => (
              <a
                key={value}
                href={`?lang=${value}`}
                title={label}
                aria-label={label}
                className={`inline-flex h-8 min-w-9 items-center justify-center rounded-full border px-2 text-base transition ${
                  locale === value
                    ? "border-[#d6a55b] bg-[#d6a55b]/20"
                    : "border-transparent bg-white/[0.03] hover:border-white/25"
                }`}
              >
                <span aria-hidden="true">{flag}</span>
              </a>
            ))}
          </nav>
        </div>

        <div className="grid gap-12 lg:grid-cols-2 lg:items-start">
          <div className="relative aspect-square overflow-hidden rounded-[20px] border border-amber-500/20 bg-black shadow-[0_0_50px_rgba(245,158,11,0.05)]">
            <Image
              src={product.images[0]}
              alt={`${product.name} - ${product.subtitle}`}
              fill
              className="object-cover"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          </div>

          <div className="flex flex-col justify-center">
            <h1 translate="no" className="notranslate font-display text-4xl uppercase tracking-[0.05em] text-white md:text-5xl">
              {product.name}
            </h1>
            <p translate="no" className="notranslate mt-2 text-xl uppercase tracking-[0.1em] text-amber-500/90">
              {product.subtitle}
            </p>

            <div className="mb-8 mt-8 h-px w-full bg-gradient-to-r from-amber-500/30 to-transparent" />

            <p className="text-base leading-relaxed text-stone-300">
              {localizedDescriptions[product.id]?.[locale] || product.description}
            </p>

            <div className="mt-8">
              <h3 className="text-xs uppercase tracking-[0.2em] text-stone-500">{t.included}</h3>
              <ul className="mt-4 space-y-2 text-sm text-amber-100/70">
                {includedItems.map((item, idx) => (
                  <li key={idx} className="flex items-center gap-3">
                    <span className="h-1 w-1 rounded-full bg-amber-500" />
                    {itemTranslations[item]?.[locale] || item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-12 grid gap-6 rounded-[24px] border border-white/5 bg-white/[0.02] p-6 backdrop-blur">
              <div className="flex flex-col gap-1">
                <div className="flex items-center justify-between gap-5">
                  <span className="text-xs uppercase tracking-[0.2em] text-stone-500">{t.price}</span>
                  <span className="font-mono text-lg text-[#f4c66a]">
                    {product.priceCents
                      ? new Intl.NumberFormat(locale === "pt" ? "pt-BR" : locale === "fr" ? "fr-CA" : "en-CA", {
                          style: "currency",
                          currency: product.currency || "CAD"
                        }).format(product.priceCents / 100)
                      : t.priceTba}
                  </span>
                </div>
                <div className="text-right text-[10px] uppercase tracking-widest text-stone-500">
                  {t.shipping}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-xs uppercase tracking-[0.2em] text-stone-500">{t.stock}</span>
                <span className="font-mono text-sm text-stone-400">{t.onDemand}</span>
              </div>

              <div className="rounded border border-amber-900/30 bg-black p-3 text-[10px] leading-relaxed text-amber-500/80">
                <p>{t.fulfillment}</p>
              </div>

              <button
                type="button"
                onClick={() => {
                  addToCart({
                    id: product.id,
                    name: product.name,
                    price: (product.priceCents || 0) / 100,
                    image: product.images[0]
                  });
                  setCartOpen(true);
                }}
                disabled={!product.checkoutEnabled || !product.priceCents}
                className="mt-4 w-full rounded-full bg-[#f4c66a] py-4 text-xs font-bold uppercase tracking-[0.2em] text-black transition-colors hover:bg-amber-400 disabled:cursor-not-allowed disabled:opacity-45"
              >
                {t.addToCart}
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
