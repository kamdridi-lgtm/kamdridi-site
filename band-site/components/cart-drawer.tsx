"use client";

import Image from "next/image";
import { Minus, Plus, ShoppingBag, X } from "lucide-react";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useApp } from "@/components/providers";

type Locale = "pt" | "en" | "fr";

const copy = {
  pt: {
    cart: "Carrinho",
    order: "Pedido",
    standard: "Padrão",
    remove: "Remover",
    empty: "Carrinho vazio",
    emptyBody: "Adicione música física, edições de colecionador ou merch KAM DRIDI para iniciar o checkout.",
    subtotal: "Subtotal",
    checkoutNote: "Pagamentos por cartão e carteiras compatíveis abrem no checkout seguro da Stripe. Endereço e contato são coletados quando necessários.",
    opening: "Abrindo checkout...",
    openCheckout: "Ir para o checkout",
    clear: "Limpar carrinho",
    close: "Fechar carrinho"
  },
  en: {
    cart: "Cart",
    order: "Order",
    standard: "Standard",
    remove: "Remove",
    empty: "Cart is empty",
    emptyBody: "Add KAMDRIDI merch, physical music, or collector editions to start the checkout flow.",
    subtotal: "Subtotal",
    checkoutNote: "Card and supported wallet payments open in Stripe's secure hosted checkout. Shipping and contact details are collected there when required.",
    opening: "Opening Checkout...",
    openCheckout: "Open Checkout",
    clear: "Clear Cart",
    close: "Close cart"
  },
  fr: {
    cart: "Panier",
    order: "Commande",
    standard: "Standard",
    remove: "Retirer",
    empty: "Panier vide",
    emptyBody: "Ajoutez de la musique physique, des éditions de collection ou du merch KAM DRIDI pour commencer le paiement.",
    subtotal: "Sous-total",
    checkoutNote: "Les paiements par carte et portefeuilles compatibles s’ouvrent dans le checkout sécurisé de Stripe. L’adresse et les coordonnées sont recueillies au besoin.",
    opening: "Ouverture du paiement...",
    openCheckout: "Passer au paiement",
    clear: "Vider le panier",
    close: "Fermer le panier"
  }
} as const;

function resolveLocale(pathname: string, raw: string | null): Locale {
  const brasil =
    pathname.startsWith("/releases/echoes-un-live-in-brasil") ||
    pathname.startsWith("/store/echoes-brasil-");

  if (!brasil) return "en";
  if (raw === "en" || raw === "fr") return raw;
  return "pt";
}

function formatCurrency(value: number, locale: Locale) {
  return new Intl.NumberFormat(locale === "pt" ? "pt-BR" : locale === "fr" ? "fr-CA" : "en-CA", {
    style: "currency",
    currency: "CAD"
  }).format(value);
}

export function CartDrawer() {
  const pathname = usePathname();
  const [requestedLang, setRequestedLang] = useState<string | null>(null);

  useEffect(() => {
    setRequestedLang(new URLSearchParams(window.location.search).get("lang"));
  }, [pathname]);

  const locale = resolveLocale(pathname, requestedLang);
  const t = copy[locale];

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
        lang={locale === "pt" ? "pt-BR" : locale}
        translate="no"
        className={`fixed right-0 top-0 z-[2200] flex h-full w-full max-w-md flex-col border-l border-white/10 bg-[#090909] shadow-[0_0_80px_rgba(0,0,0,0.6)] transition-transform duration-300 ${isCartOpen ? "translate-x-0" : "translate-x-full"}`}
      >
        <div className="flex items-center justify-between border-b border-white/10 px-6 py-5">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-[#f4c66a]">{t.cart}</p>
            <h2 className="mt-2 font-display text-2xl uppercase tracking-[0.08em] text-white">
              {t.order}
            </h2>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(false)}
            className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a]"
            aria-label={t.close}
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
                        {item.color ?? item.size ? [item.color, item.size].filter(Boolean).join(" / ") : t.standard}
                      </p>
                      <h3 translate="no" className="notranslate mt-2 text-lg text-white">{item.name}</h3>
                      <p className="mt-2 text-sm text-[#f4c66a]">{formatCurrency(item.price, locale)}</p>
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
                          {t.remove}
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
                {t.empty}
              </h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-stone-400">
                {t.emptyBody}
              </p>
            </div>
          )}
        </div>

        <div className="border-t border-white/10 px-6 py-6">
          <div className="flex items-center justify-between text-sm uppercase tracking-[0.3em] text-stone-400">
            <span>{t.subtotal}</span>
            <span className="text-lg text-[#f4c66a]">{formatCurrency(cartSubtotal, locale)}</span>
          </div>
          <p className="mt-3 text-xs leading-6 text-stone-500">
            {t.checkoutNote}
          </p>
          {message ? <p className="mt-3 text-sm text-rose-300">{message}</p> : null}
          <div className="mt-5 grid gap-3">
            <button
              type="button"
              onClick={() => void handleCheckout()}
              disabled={!cart.length || isLoading}
              className="inline-flex items-center justify-center rounded-full bg-[#f4c66a] px-6 py-4 text-sm uppercase tracking-[0.25em] text-black transition hover:-translate-y-0.5 hover:bg-[#ffd989] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? t.opening : t.openCheckout}
            </button>
            <button
              type="button"
              onClick={clearCart}
              disabled={!cart.length}
              className="inline-flex items-center justify-center rounded-full border border-white/10 px-6 py-3 text-xs uppercase tracking-[0.25em] text-stone-300 transition hover:border-[#f4c66a]/40 hover:text-[#f4c66a] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {t.clear}
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
