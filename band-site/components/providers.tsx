"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { getCommerceProductById } from "@/data/commerce-products";

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
            const product = getCommerceProductById(item.id);
            if (!product || !product.visible || product.saleMode === "sold_out") continue;
            
            // Validate variants
            let validColor = item.color;
            if (product.colors?.length) {
              if (!validColor || !product.colors.includes(validColor)) validColor = product.colors[0];
            } else {
              validColor = undefined;
            }
            
            let validSize = item.size;
            if (product.sizes?.length) {
              if (!validSize || !product.sizes.includes(validSize)) validSize = product.sizes[0];
            } else {
              validSize = undefined;
            }
            
            let qty = Math.max(1, Math.floor(Number(item.quantity) || 1));
            if (product.quantityLimit) qty = Math.min(qty, product.quantityLimit);
            qty = Math.min(qty, 20); // Hard cap
            
            validatedCart.push({
              id: product.id,
              name: product.name,
              price: product.priceCents / 100, // Price in display CAD dollars
              image: product.images?.[0] || item.image || "",
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
    const product = getCommerceProductById(rawItem.id);
    if (!product || !product.visible || product.saleMode === "sold_out") return;
    
    const item = {
      id: product.id,
      name: product.name,
      price: product.priceCents / 100,
      image: product.images?.[0] || "",
      color: rawItem.color,
      size: rawItem.size
    };
    
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
    window.localStorage.setItem(
      "kamdridi-pending-checkout",
      JSON.stringify(cart.map((item) => item.id))
    );

    const response = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ items: cart, returnPath: window.location.pathname })
    });

    const payload = await response.json();

    if (!response.ok) {
      window.localStorage.removeItem("kamdridi-pending-checkout");
      return { ok: false, message: payload.error ?? "Checkout failed." };
    }

    if (payload.mode === "simulated") {
      window.location.href = payload.url;
      return { ok: true };
    }

    if (payload.url) {
      window.location.href = payload.url;
      return { ok: true };
    }

    if (!payload.sessionId) {
      window.localStorage.removeItem("kamdridi-pending-checkout");
      return { ok: false, message: "Checkout redirect is unavailable." };
    }

    window.localStorage.removeItem("kamdridi-pending-checkout");
    return { ok: false, message: "Checkout link is unavailable." };
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
