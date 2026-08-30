"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import {
  Search, ShoppingCart, User, Home as HomeIcon, Store, ClipboardList,
  Image as ImageIcon, LogOut, LogIn,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "./ui";
import { useStore } from "@/app/providers";
import { useAuth } from "./AuthProvider";

const NAV = [
  { key: "/", label: "Home", icon: HomeIcon },
  { key: "/browse", label: "Browse", icon: Search },
  { key: "/stores", label: "Stores", icon: Store },
  { key: "/moodboard", label: "Moodboard", icon: ImageIcon },
  { key: "/orders", label: "My Rentals", icon: ClipboardList },
];

export function TopNav() {
  const pathname = usePathname();
  const router = useRouter();
  const { cart } = useStore();
  const { user, signOut } = useAuth();
  const cartCount = cart.reduce((s, i) => s + i.qty, 0);
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  const isActive = (key) => (key === "/" ? pathname === "/" : pathname.startsWith(key));
  const submitSearch = () =>
    router.push(`/browse?q=${encodeURIComponent(query.trim())}`);

  useEffect(() => setMenuOpen(false), [pathname]);

  useEffect(() => {
    if (!menuOpen) return;
    const onClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [menuOpen]);

  const handleSignOut = async () => {
    setMenuOpen(false);
    await signOut();
    router.push("/");
    router.refresh();
  };

  return (
    <>
      <div className="sticky top-0 z-40 backdrop-blur-md" style={{ backgroundColor: "rgba(250,239,237,0.92)", borderBottom: `1px solid ${C.line}` }}>
        <div className="max-w-[1200px] mx-auto px-4 sm:px-6">
          <div className="flex items-center gap-6 h-[64px] sm:h-[68px]">
            <button onClick={() => router.push("/")} className="shrink-0">
              <Logo size={34} />
            </button>

            <nav className="hidden md:flex items-center gap-1 ml-1 shrink-0">
              {NAV.map((it) => (
                <button
                  key={it.key}
                  onClick={() => router.push(it.key)}
                  title={it.label}
                  className="px-2.5 lg:px-3.5 py-2 rounded-full text-sm flex items-center gap-1.5 transition-colors"
                  style={{
                    fontFamily: "Jost, sans-serif",
                    color: isActive(it.key) ? C.white : C.primary,
                    backgroundColor: isActive(it.key) ? C.primary : "transparent",
                    fontWeight: 500,
                  }}
                >
                  <it.icon size={14} className="shrink-0" /> <span className="hidden lg:inline whitespace-nowrap">{it.label}</span>
                </button>
              ))}
            </nav>

            <div className="flex-1 hidden sm:flex items-center">
              <div className="relative w-full max-w-[380px] ml-auto mr-3">
                <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" color="#8AA2A6" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                  placeholder="Search props — sofa, brass lamp, trunk…"
                  className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none"
                  style={{ backgroundColor: C.white, border: `1.3px solid ${C.line}`, fontFamily: "Jost, sans-serif", color: C.ink }}
                />
              </div>
            </div>

            <div className="flex items-center gap-2 ml-auto sm:ml-0">
              <button onClick={() => router.push("/cart")} className="relative w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center" style={{ backgroundColor: C.primaryTint }}>
                <ShoppingCart size={15} color={C.primary} />
                {cartCount > 0 && (
                  <span className="absolute -top-1 -right-1 rounded-full text-[0.6rem] flex items-center justify-center text-white" style={{ backgroundColor: C.highlight, minWidth: "17px", height: "17px" }}>
                    {cartCount}
                  </span>
                )}
              </button>

              {user ? (
                <div className="relative" ref={menuRef}>
                  <button
                    onClick={() => setMenuOpen((o) => !o)}
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-xs font-semibold"
                    style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif" }}
                    title={user.email}
                  >
                    {(user.email || "?").slice(0, 1).toUpperCase()}
                  </button>
                  {menuOpen && (
                    <div className="absolute right-0 mt-2 w-56 rounded-2xl p-2 z-50" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 16px 40px -20px rgba(0,60,75,0.35)" }}>
                      <div className="px-3 py-2">
                        <div className="text-[0.65rem] uppercase tracking-wide" style={{ color: "#9AAEB1", fontFamily: "Jost, sans-serif" }}>Signed in as</div>
                        <div className="text-sm truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{user.email}</div>
                      </div>
                      <button
                        onClick={() => { setMenuOpen(false); router.push("/orders"); }}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                        style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}
                      >
                        <ClipboardList size={14} /> My rentals
                      </button>
                      <button
                        onClick={handleSignOut}
                        className="w-full text-left px-3 py-2 rounded-xl text-sm flex items-center gap-2"
                        style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}
                      >
                        <LogOut size={14} /> Sign out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  onClick={() => router.push(`/login?redirectTo=${encodeURIComponent(pathname)}`)}
                  className="h-9 sm:h-10 px-3 sm:px-4 rounded-full flex items-center gap-1.5 text-xs sm:text-sm"
                  style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
                >
                  <LogIn size={14} /> <span className="hidden sm:inline">Sign in</span>
                </button>
              )}
            </div>
          </div>

          <div className="sm:hidden pb-3">
            <div className="relative">
              <Search size={15} className="absolute left-4 top-1/2 -translate-y-1/2" color="#8AA2A6" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submitSearch()}
                placeholder="Search props…"
                className="w-full rounded-full pl-10 pr-4 py-2.5 text-sm outline-none"
                style={{ backgroundColor: C.white, border: `1.3px solid ${C.line}`, fontFamily: "Jost, sans-serif", color: C.ink }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 flex items-center px-1 py-2" style={{ backgroundColor: C.white, borderTop: `1px solid ${C.line}` }}>
        {NAV.map((it) => (
          <button key={it.key} onClick={() => router.push(it.key)} className="flex-1 min-w-0 flex flex-col items-center gap-0.5 px-1 py-1 rounded-xl" style={{ backgroundColor: isActive(it.key) ? C.primaryTint : "transparent" }}>
            <it.icon size={17} color={isActive(it.key) ? C.primary : "#9AAEB1"} />
            <span className="text-[0.58rem] truncate max-w-full" style={{ color: isActive(it.key) ? C.primary : "#9AAEB1", fontFamily: "Jost, sans-serif", fontWeight: isActive(it.key) ? 600 : 400 }}>{it.key === "/moodboard" ? "Boards" : it.label}</span>
          </button>
        ))}
      </div>
    </>
  );
}
