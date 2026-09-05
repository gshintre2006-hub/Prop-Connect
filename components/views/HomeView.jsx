"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Star, Search, Heart, Store } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES, REVIEWS } from "@/lib/data";
import { Pill, SectionTitle, Button, Footer } from "@/components/ui";
import { PropCard } from "@/components/PropCard";
import { StoreCard } from "@/components/StoreCard";
import { useStore } from "@/app/providers";

const SERIF = "'Playfair Display', Georgia, 'Times New Roman', serif";

function FloatCard({ children, style, onClick }) {
  return (
    <button
      onClick={onClick}
      className="absolute text-left rounded-2xl p-4"
      style={{
        backgroundColor: C.white,
        border: `1px solid ${C.line}`,
        boxShadow: "0 26px 55px -26px rgba(0,60,75,0.4)",
        ...style,
      }}
    >
      {children}
    </button>
  );
}

export function HomeView() {
  const router = useRouter();
  const { favs, toggleFav, addToCart, allProps, allStores, findStore } = useStore();
  const trending = allProps.slice(0, 4);
  const recent = [...allProps].reverse().slice(0, 4);
  const toBrowse = (q) => router.push(`/browse?q=${encodeURIComponent(q)}`);

  const chairProp = allProps.find((p) => p.id === "p7") || allProps[0];
  const lampProp = allProps.find((p) => p.id === "p2") || allProps[1];

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: C.bg }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-12 sm:pt-16 pb-16 sm:pb-24">
          <div className="lg:grid lg:grid-cols-[1.1fr_1fr] lg:gap-12 lg:items-center">
            {/* left — copy */}
            <div className="max-w-[640px]">
              <div
                className="mb-4 leading-none text-[2.6rem] sm:text-[3.5rem]"
                style={{ fontFamily: SERIF, fontWeight: 600, letterSpacing: "-0.01em" }}
              >
                <span style={{ color: C.primary }}>Prop</span>
                <span style={{ color: C.highlight }}>Connect</span>
              </div>
              <Pill tone="accent" className="mb-5">40+ rental stores · Film City &amp; Goregaon</Pill>
              <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-[1.9rem] sm:text-[2.7rem] leading-[1.12]">
                Every rental prop.<br />One search away.
              </h1>
              <p className="mt-5 text-[0.95rem] sm:text-base max-w-md" style={{ color: "#4E6B70" }}>
                PropConnect brings every rental store on the outskirts of Film City onto a single, searchable inventory — with accurate dimensions, live availability and direct store contact.
              </p>

              <div className="mt-8 flex items-center gap-3">
                <Button variant="primary" size="lg" onClick={() => router.push("/browse")}>
                  <Search size={16} /> Browse all props
                </Button>
                <span className="text-xs" style={{ color: "#7C9599", fontFamily: "Jost, sans-serif" }}>or use the search bar above</span>
              </div>
              <div className="flex flex-wrap gap-2 mt-4">
                {["Sofas", "Brass Decor", "Vintage Trunks", "Vehicles"].map((t) => (
                  <button key={t} onClick={() => toBrowse(t)} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
                    {t}
                  </button>
                ))}
              </div>
            </div>

            {/* right — floating preview cards (desktop) */}
            <div className="hidden lg:block relative" style={{ height: 460 }}>
              <FloatCard
                style={{ top: 8, left: 6, width: 264, transform: "rotate(-4deg)" }}
                onClick={() => router.push(`/props/${chairProp.id}`)}
              >
                <div className="flex items-center gap-3">
                  <img src={chairProp.img} alt="" className="w-14 h-14 rounded-xl object-cover shrink-0" />
                  <div className="min-w-0">
                    <div className="text-sm truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>{chairProp.name}</div>
                    <div className="text-[0.72rem]" style={{ color: "#8AA2A6" }}>
                      {chairProp.material.split(",")[0]} · {chairProp.h} H · Qty {chairProp.qty}
                    </div>
                  </div>
                </div>
                <div className="mt-2.5"><Pill tone="good">AVAILABLE</Pill></div>
              </FloatCard>

              <FloatCard
                style={{ top: 168, right: 0, width: 210, transform: "rotate(3.5deg)" }}
                onClick={() => router.push("/moodboard")}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryTint }}>
                    <Heart size={14} color={C.highlight} fill={C.highlight} />
                  </div>
                  <span className="text-lg" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 700 }}>14 saved</span>
                </div>
                <div className="text-[0.78rem]" style={{ color: "#8AA2A6" }}>Living-room moodboard</div>
              </FloatCard>

              <FloatCard
                style={{ top: 258, left: 44, width: 262, transform: "rotate(-1.5deg)" }}
                onClick={() => router.push("/stores")}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.secondary }}>
                    <Store size={16} color={C.white} />
                  </div>
                  <div className="min-w-0">
                    <div className="text-sm truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>{lampProp.name}</div>
                    <div className="text-[0.72rem] truncate" style={{ color: "#8AA2A6" }}>{findStore(lampProp.storeId)?.name}</div>
                  </div>
                </div>
                <div className="mt-2.5">
                  <span className="text-[0.62rem] px-2 py-1 rounded-full" style={{ backgroundColor: C.secondary, color: C.white, fontFamily: "Jost, sans-serif", letterSpacing: "0.08em" }}>2 STORES</span>
                </div>
              </FloatCard>

              <div className="absolute rounded-full" style={{ width: 220, height: 220, right: 30, top: 60, background: C.accent, opacity: 0.4, filter: "blur(8px)", zIndex: -1 }} />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-14">
        {/* Categories */}
        <SectionTitle eyebrow="Browse" title="Featured categories" sub="Fifteen curated categories spanning every department's needs." />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 mb-16">
          {CATEGORIES.slice(0, 10).map((c) => (
            <button
              key={c}
              onClick={() => toBrowse(c)}
              className="rounded-2xl px-4 py-5 text-left transition-transform hover:-translate-y-0.5"
              style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}
            >
              <span className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{c}</span>
            </button>
          ))}
        </div>

        {/* Recently added — first */}
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="Fresh inventory" title="Recently added props" />
          <button onClick={() => router.push("/browse")} className="text-sm mb-7 flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
          {recent.map((p) => (
            <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />
          ))}
        </div>

        {/* Trending — second */}
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="This week" title="Trending props" />
          <button onClick={() => router.push("/browse")} className="text-sm mb-7 flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
          {trending.map((p) => (
            <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />
          ))}
        </div>

        {/* Popular stores — third */}
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="Trusted network" title="Popular stores" />
          <button onClick={() => router.push("/stores")} className="text-sm mb-7 flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {allStores.map((s) => <StoreCard key={s.id} s={s} />)}
        </div>

        {/* How it works */}
        <SectionTitle eyebrow="Simple process" title="How PropConnect works" />
        <div className="grid sm:grid-cols-3 gap-5 mb-16">
          {[
            { n: "01", t: "Search & discover", d: "Search across every partner store's live inventory in one place — with real dimensions and pricing." },
            { n: "02", t: "Compare & reserve", d: "Shortlist, compare up to four props and add them to your cart for the shoot dates you need." },
            { n: "03", t: "Track the journey", d: "Follow each item from request through packed, dispatched, in-use and returned." },
          ].map((s) => (
            <div key={s.n} className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="text-xs mb-3" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>{s.n}</div>
              <h3 className="text-base mb-2" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{s.t}</h3>
              <p className="text-sm" style={{ color: "#6B8489" }}>{s.d}</p>
            </div>
          ))}
        </div>

        {/* Customer reviews — fourth */}
        <SectionTitle eyebrow="From the community" title="What production teams say" />
        <div className="grid sm:grid-cols-2 gap-5 mb-4">
          {REVIEWS.map((r) => (
            <div key={r.id} className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} size={14} color={C.highlight} fill={i < r.rating ? C.highlight : "none"} />
                ))}
              </div>
              <p className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>&ldquo;{r.quote}&rdquo;</p>
              <div className="flex items-center gap-2.5 mt-4">
                <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif" }}>
                  {r.name.slice(0, 1)}
                </div>
                <div>
                  <div className="text-[0.8rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{r.name}</div>
                  <div className="text-[0.7rem]" style={{ color: "#8AA2A6" }}>{r.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <Footer />
    </div>
  );
}
