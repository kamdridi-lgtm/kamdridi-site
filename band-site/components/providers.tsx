"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { getCommerceProductById } from "@/data/commerce-products";
import { AudioProvider } from "@/components/providers/audio-provider";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  color?: string;
  size?: string;
};

type FanClubSession = {
  name: string;
  email: string;
};

type AppContextValue = {
  cart: CartItem[];
  cartCount: number;
  cartSubtotal: number;
  fan: FanClubSession | null;
  isCartOpen: boolean;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size?: string, color?: string) => void;
  updateCartQuantity: (id: string, quantity: number, size?: string, color?: string) => void;
  clearCart: () => void;
  setCartOpen: (open: boolean) => void;
  setFan: (fan: FanClubSession | null) => void;
  checkout: () => Promise<{ ok: boolean; message?: string }>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fan, setFanState] = useState<FanClubSession | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    try {
      const cartValue = window.localStorage.getItem("kamdridi-cart");
      if (cartValue) {
        const parsed = JSON.parse(cartValue);
        if (Array.isArray(parsed)) {
          const validatedCart: CartItem[] = [];
          
          for (const item of parsed) {
            if (!item || !item.id) continue;

            // The checked-in catalog is only a resilient display fallback.
            // The live Supabase catalog is authoritative and is revalidated
            // server-side before Stripe Checkout is created.
            const product = getCommerceProductById(item.id);

            let validColor = item.color;
            if (product?.colors?.length) {
              if (!validColor || !product.colors.includes(validColor)) validColor = product.colors[0];
            }

            let validSize = item.size;
            if (product?.sizes?.length) {
              if (!validSize || !product.sizes.includes(validSize)) validSize = product.sizes[0];
            }

            let qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
            if (product?.quantityLimit) qty = Math.min(qty, product.quantityLimit);
            qty = Math.min(qty, 20);

            const displayPrice =
              typeof item.price === "number" && Number.isFinite(item.price)
                ? item.price
                : product
                  ? product.priceCents / 100
                  : 0;

            validatedCart.push({
              id: item.id,
              name: product?.name || item.name || item.id,
              price: displayPrice,
              image: product?.images?.[0] || item.image || "",
              quantity: qty,
              color: validColor,
              size: validSize
            });
          }
          
          setCart(validatedCart);
        }
      }
    } catch (e) {
      console.error("Failed to parse cart from local storage", e);
    }

    void fetch("/api/fan-club/session", { cache: "no-store" })
      .then((response) => response.json())
      .then((payload) => {
        if (payload.user) {
          setFanState(payload.user);
        }
      })
      .catch(() => {
        setFanState(null);
      });
  }, []);

  useEffect(() => {
    window.localStorage.setItem("kamdridi-cart", JSON.stringify(cart));
  }, [cart]);

  function setFan(fanValue: FanClubSession | null) {
    setFanState(fanValue);
  }

  function addToCart(rawItem: Omit<CartItem, "quantity">) {
    // Do not let a stale checked-in fallback block a product that the live
    // Supabase catalog has already exposed as purchasable. The checkout API
    // performs the authoritative validation immediately before Stripe.
    const product = getCommerceProductById(rawItem.id);
    const item = {
      id: rawItem.id,
      name: rawItem.name || product?.name || rawItem.id,
      price:
        typeof rawItem.price === "number" && Number.isFinite(rawItem.price)
          ? rawItem.price
          : product
            ? product.priceCents / 100
            : 0,
      image: rawItem.image || product?.images?.[0] || "",
      color: rawItem.color,
      size: rawItem.size
    };
    const quantityLimit = product?.quantityLimit ?? 20;

    setCart((current) => {
      const existing = current.find(
        (entry) =>
          entry.id === item.id && entry.size === item.size && entry.color === item.color
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id && entry.size === item.size && entry.color === item.color
            ? {
                ...entry,
                quantity: Math.min(entry.quantity + 1, quantityLimit)
              }
            : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string, size?: string, color?: string) {
    setCart((current) =>
      current.filter(
        (entry) => !(entry.id === id && entry.size === size && entry.color === color)
      )
    );
  }

  function updateCartQuantity(id: string, quantity: number, size?: string, color?: string) {
    setCart((current) =>
      current.flatMap((entry) => {
        if (entry.id !== id || entry.size !== size || entry.color !== color) {
          return entry;
        }

        if (quantity <= 0) {
          return [];
        }

        const product = getCommerceProductById(entry.id);
        const maximum = product?.quantityLimit ?? 20;
        return { ...entry, quantity: Math.min(Math.floor(quantity), maximum) };
      })
    );
  }

  const clearCart = useCallback(() => {
    setCart([]);
  }, []);

  async function checkout() {
    if (!cart.length) {
      return { ok: false, message: "Your cart is empty." };
    }

    try {
      const response = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: cart.map(({ id, quantity, color, size }) => ({
            id,
            quantity,
            color,
            size
          })),
          returnPath: "/store"
        })
      });

      const payload = await response.json().catch(() => ({}));
      if (!response.ok || typeof payload.url !== "string") {
        return {
          ok: false,
          message: payload.error || "Secure checkout is temporarily unavailable."
        };
      }

      const checkoutUrl = new URL(payload.url, window.location.origin);
      if (checkoutUrl.protocol !== "https:" && checkoutUrl.origin !== window.location.origin) {
        return { ok: false, message: "The checkout destination is invalid." };
      }

      window.localStorage.setItem(
        "kamdridi-pending-checkout",
        JSON.stringify(cart.map((item) => item.id))
      );
      window.location.assign(checkoutUrl.toString());
      return { ok: true };
    } catch {
      return {
        ok: false,
        message: "Unable to reach secure checkout. Please try again."
      };
    }
  }

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
    <AudioProvider>
      <AppContext.Provider
        value={{
          cart,
          cartCount,
          cartSubtotal,
          fan,
          isCartOpen,
          addToCart,
          removeFromCart,
          updateCartQuantity,
          clearCart,
          setCartOpen,
          setFan,
          checkout
        }}
      >
        {children}
      </AppContext.Provider>
    </AudioProvider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside Providers.");
  }
  return context;
}
