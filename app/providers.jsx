"use client";

import { createContext, useContext, useState } from "react";
import { AuthProvider } from "@/components/AuthProvider";

/* ---------------------------------------------------------------------- */
/*  GLOBAL CLIENT STATE                                                    */
/*  Replaces the useState blob that lived in the original <App/> root.     */
/* ---------------------------------------------------------------------- */
const StoreContext = createContext(null);

function StoreProvider({ children }) {
  const [favs, setFavs] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [moodboardImages, setMoodboardImages] = useState([]);

  const toggleFav = (id) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  const addToCart = (p) => {
    setCart((c) => {
      const existing = c.find((i) => i.id === p.id);
      if (existing) return c.map((i) => (i.id === p.id ? { ...i, qty: i.qty + 1 } : i));
      return [...c, { ...p, qty: 1 }];
    });
  };
  const updateQty = (id, delta) =>
    setCart((c) => c.map((i) => (i.id === id ? { ...i, qty: Math.max(1, i.qty + delta) } : i)));
  const removeItem = (id) => setCart((c) => c.filter((i) => i.id !== id));

  const addMoodboardImages = (newImages) =>
    setMoodboardImages((imgs) => [...imgs, ...newImages]);
  const removeMoodboardImage = (id) =>
    setMoodboardImages((imgs) => imgs.filter((i) => i.id !== id));

  const placeOrder = () => {
    const orderId = Math.floor(10000 + Math.random() * 89999);
    setOrders((o) => [{ orderId, items: cart, date: "Today", statusIndex: 1 }, ...o]);
    setCart([]);
    return orderId;
  };

  const value = {
    favs, toggleFav,
    cart, addToCart, updateQty, removeItem,
    orders, placeOrder,
    moodboardImages, addMoodboardImages, removeMoodboardImage,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <Providers>");
  return ctx;
}

/* Auth wraps the store so both are available everywhere below the root layout. */
export function Providers({ children }) {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
}
