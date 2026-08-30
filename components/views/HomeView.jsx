"use client";

import { useRouter } from "next/navigation";
import { ChevronRight, Star, MapPin, Search } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES, STORES, PROPS } from "@/lib/data";
import { Pill, SectionTitle, Button, Footer } from "@/components/ui";
import { PropCard } from "@/components/PropCard";
import { useStore } from "@/app/providers";

export function HomeView() {
  const router = useRouter();
  const { favs, toggleFav, addToCart } = useStore();
  const trending = PROPS.slice(0, 4);
  const recent = [...PROPS].reverse().slice(0, 4);
  const toBrowse = (q) => router.push(`/browse?q=${encodeURIComponent(q)}`);

  return (
    <div>
      {/* Hero */}
      <div className="relative overflow-hidden" style={{ backgroundColor: C.bg }}>
        <div className="max-w-[1200px] mx-auto px-5 sm:px-6 pt-14 sm:pt-20 pb-16 sm:pb-24">
          <div className="max-w-[640px]">
            <Pill tone="accent" className="mb-5">40+ rental stores · Film City &amp; Goregaon</Pill>
            <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-[2.1rem] sm:text-[3.1rem] leading-[1.1]">
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

        {/* Trending */}
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

        {/* Recently added */}
        <SectionTitle eyebrow="Fresh inventory" title="Recently added props" />
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mb-16">
          {recent.map((p) => (
            <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />
          ))}
        </div>

        {/* Popular stores */}
        <div className="flex items-end justify-between">
          <SectionTitle eyebrow="Trusted network" title="Popular stores" />
          <button onClick={() => router.push("/stores")} className="text-sm mb-7 flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>
            View all <ChevronRight size={14} />
          </button>
        </div>
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-16">
          {STORES.map((s) => (
            <button key={s.id} onClick={() => router.push(`/stores/${s.id}`)} className="rounded-2xl overflow-hidden text-left" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <img src={s.photos[0]} alt={s.name} className="w-full h-[110px] object-cover" />
              <div className="p-4">
                <div className="flex items-center gap-2 mb-1">
                  <img src={s.logo} className="w-6 h-6 rounded-full object-cover" alt="" />
                  <span className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{s.name}</span>
                </div>
                <div className="flex items-center gap-1 text-[0.72rem]" style={{ color: "#8AA2A6" }}>
                  <MapPin size={10} /> {s.location}
                </div>
                <div className="text-[0.72rem] mt-1.5" style={{ color: C.secondary }}>{s.totalProps} props listed</div>
              </div>
            </button>
          ))}
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

        {/* Testimonial */}
        <div className="rounded-3xl p-8 sm:p-10 mb-6" style={{ backgroundColor: C.primary }}>
          <Star size={18} color={C.accent} fill={C.accent} />
          <p className="text-white text-lg sm:text-xl mt-4 max-w-2xl" style={{ fontFamily: "Jost, sans-serif", fontWeight: 300 }}>
            &ldquo;What used to take my team three days of driving between Aarey stores now takes twenty minutes on PropConnect.&rdquo;
          </p>
          <p className="text-[0.8rem] mt-4" style={{ color: C.secondary, fontFamily: "Jost, sans-serif" }}>— Art Director, feature film production</p>
        </div>
      </div>

      <Footer />
    </div>
  );
}
