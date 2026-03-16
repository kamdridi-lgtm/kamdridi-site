"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { loadStripe } from "@stripe/stripe-js";

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
const stripePromise = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY
  ? loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY)
  : Promise.resolve(null);

export function Providers({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [fan, setFanState] = useState<FanClubSession | null>(null);
  const [isCartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const cartValue = window.localStorage.getItem("kamdridi-cart");

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
    window.localStorage.setItem("kamdridi-cart", JSON.stringify(cart));
  }, [cart]);

  function setFan(fanValue: FanClubSession | null) {
    setFanState(fanValue);
  }

  function addToCart(item: Omit<CartItem, "quantity">) {
    setCart((current) => {
      const existing = current.find(
        (entry) =>
          entry.id === item.id && entry.size === item.size && entry.color === item.color
      );

      if (existing) {
        return current.map((entry) =>
          entry.id === item.id && entry.size === item.size && entry.color === item.color
            ? { ...entry, quantity: entry.quantity + 1 }
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

        return { ...entry, quantity };
      })
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

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartSubtotal = cart.reduce((total, item) => total + item.price * item.quantity, 0);

  return (
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
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used inside Providers.");
  }
  return context;
}
