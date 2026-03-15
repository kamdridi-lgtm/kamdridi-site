"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

type CartItem = {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
  size?: string;
};

type FanClubSession = {
  name: string;
  email: string;
};

type AppContextValue = {
  cart: CartItem[];
  fan: FanClubSession | null;
  addToCart: (item: Omit<CartItem, "quantity">) => void;
  removeFromCart: (id: string, size?: string) => void;
  clearCart: () => void;
  setFan: (fan: FanClubSession | null) => void;
  checkout: () => Promise<{ ok: boolean; message?: string }>;
};

const AppContext = createContext<AppContextValue | undefined>(undefined);
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fan, setFanState] = useState<FanClubSession | null>(null);

  useEffect(() => {
    const cartValue = window.localStorage.getItem("iron-eclipse-cart");

    if (cartValue) {
      setCart(JSON.parse(cartValue));
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
    window.localStorage.setItem("iron-eclipse-cart", JSON.stringify(cart));
  }, [cart]);

  function setFan(fanValue: FanClubSession | null) {
    setFanState(fanValue);
  }

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((current) => {
      const existing = current.find(
        (entry) => entry.id === item.id && entry.size === item.size
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id && entry.size === item.size
            ? { ...entry, quantity: entry.quantity + 1 }
            : entry
        );
      }

      return [...current, { ...item, quantity: 1 }];
    });
  }

  function removeFromCart(id: string, size?: string) {
    setCart((current) =>
      current.filter((entry) => !(entry.id === id && entry.size === size))
    );
  }

  function clearCart() {
    setCart([]);
  }

  async function checkout() {
    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart })
    });

    const payload = await response.json();

    if (!response.ok) {
      return { ok: false, message: payload.error ?? "Checkout failed." };
    }

    if (payload.mode === "simulated") {
      window.location.href = payload.url;
      return { ok: true };
    }

    const stripe = await stripePromise;
    if (!stripe) {
      return { ok: false, message: "Stripe.js did not load." };
    }

    const result = await stripe.redirectToCheckout({ sessionId: payload.sessionId });

    if (result.error) {
      return { ok: false, message: result.error.message };
    }

    return { ok: true };
  }

  return (
    <AppContext.Provider
      value={{ cart, fan, addToCart, removeFromCart, clearCart, setFan, checkout }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside Providers.");
  }
  return context;
}
