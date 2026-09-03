"use client";

import {
  createContext, useContext, useState, useEffect, useRef, useCallback,
} from "react";
import { AuthProvider } from "@/components/AuthProvider";
import { JOURNEY_STEPS } from "@/lib/data";

/* ---------------------------------------------------------------------- */
/*  GLOBAL CLIENT STATE                                                    */
/* ---------------------------------------------------------------------- */
const StoreContext = createContext(null);

const LS_FAVS = "pc.favs";
const LS_FAV_STORES = "pc.favStores";
const readArr = (k) => {
  try {
    const v = JSON.parse(localStorage.getItem(k));
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
};

const STEP_BLURB = [
  "We've received your request.",
  "The store confirmed availability.",
  "Your items are packed and ready to leave.",
  "Out for delivery / pickup to your set.",
  "Delivered — enjoy the shoot.",
  "Returned and checked in. Deposit released.",
];

function StoreProvider({ children }) {
  const [favs, setFavs] = useState([]);
  const [favStores, setFavStores] = useState([]);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [moodboardImages, setMoodboardImages] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const timers = useRef([]);

  /* hydrate + persist favourites (props + stores) */
  useEffect(() => {
    setFavs(readArr(LS_FAVS));
    setFavStores(readArr(LS_FAV_STORES));
  }, []);
  useEffect(() => {
    try { localStorage.setItem(LS_FAVS, JSON.stringify(favs)); } catch {}
  }, [favs]);
  useEffect(() => {
    try { localStorage.setItem(LS_FAV_STORES, JSON.stringify(favStores)); } catch {}
  }, [favStores]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const toggleFav = (id) =>
    setFavs((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));
  const toggleFavStore = (id) =>
    setFavStores((f) => (f.includes(id) ? f.filter((x) => x !== id) : [...f, id]));

  /* notifications ---------------------------------------------------- */
  const notify = useCallback((title, body, orderId) => {
    setNotifications((n) =>
      [
        { id: `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`, title, body, orderId, ts: Date.now(), read: false },
        ...n,
      ].slice(0, 40)
    );
  }, []);
  const markNotificationsRead = () =>
    setNotifications((n) => n.map((x) => ({ ...x, read: true })));
  const clearNotifications = () => setNotifications([]);
  const unreadCount = notifications.filter((n) => !n.read).length;

  /* cart ----------------------------------------------------------- */
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

  /* moodboard ---------------------------------------------------------- */
  const addMoodboardImages = (newImages) =>
    setMoodboardImages((imgs) => [...imgs, ...newImages]);
  const removeMoodboardImage = (id) =>
    setMoodboardImages((imgs) => imgs.filter((i) => i.id !== id));

  /* orders + journey tracking --------------------------------------- */
  const setOrderStatus = useCallback(
    (orderId, idx) => {
      setOrders((os) => os.map((o) => (o.orderId === orderId ? { ...o, statusIndex: idx } : o)));
      const step = JOURNEY_STEPS[idx];
      if (step) notify(`Order #${orderId} — ${step.label}`, STEP_BLURB[idx] || "", orderId);
    },
    [notify]
  );

  const scheduleAdvance = useCallback(
    (orderId) => {
      // demo: the rental walks itself through packed -> dispatched -> in use
      [[2, 18000], [3, 40000], [4, 70000]].forEach(([idx, ms]) => {
        timers.current.push(setTimeout(() => setOrderStatus(orderId, idx), ms));
      });
    },
    [setOrderStatus]
  );

  const advanceOrder = (orderId) => {
    setOrders((os) =>
      os.map((o) => {
        if (o.orderId !== orderId) return o;
        const next = Math.min(o.statusIndex + 1, JOURNEY_STEPS.length - 1);
        if (next !== o.statusIndex) {
          const step = JOURNEY_STEPS[next];
          notify(`Order #${orderId} — ${step.label}`, STEP_BLURB[next] || "", orderId);
        }
        return { ...o, statusIndex: next };
      })
    );
  };

  const placeOrder = () => {
    const orderId = Math.floor(10000 + Math.random() * 89999);
    setOrders((o) => [{ orderId, items: cart, date: "Today", statusIndex: 1 }, ...o]);
    notify(`Order #${orderId} — Confirmed`, `${cart.length} item(s) confirmed with the store.`, orderId);
    scheduleAdvance(orderId);
    setCart([]);
    return orderId;
  };

  const value = {
    favs, toggleFav,
    favStores, toggleFavStore,
    cart, addToCart, updateQty, removeItem,
    orders, placeOrder, advanceOrder,
    moodboardImages, addMoodboardImages, removeMoodboardImage,
    notifications, unreadCount, markNotificationsRead, clearNotifications,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within <Providers>");
  return ctx;
}

export function Providers({ children }) {
  return (
    <AuthProvider>
      <StoreProvider>{children}</StoreProvider>
    </AuthProvider>
  );
}
