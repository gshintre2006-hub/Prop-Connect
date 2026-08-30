"use client";

import { useMemo, useState } from "react";
import { SlidersHorizontal, Check } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES, STORES, PROPS } from "@/lib/data";
import { PropCard } from "@/components/PropCard";
import { useStore } from "@/app/providers";

export function BrowseView({ initialQuery = "" }) {
  const { favs, toggleFav, addToCart } = useStore();
  const [query] = useState(initialQuery);
  const [cat, setCat] = useState("All");
  const [material, setMaterial] = useState("All");
  const [era, setEra] = useState("All");
  const [avail, setAvail] = useState(false);
  const [sort, setSort] = useState("relevance");

  const materials = useMemo(() => ["All", ...new Set(PROPS.map((p) => p.material))], []);
  const eras = useMemo(() => ["All", ...new Set(PROPS.map((p) => p.era))], []);

  const results = useMemo(() => {
    let r = PROPS.filter((p) => {
      const q = query.trim().toLowerCase();
      const matchQ = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q) || p.material.toLowerCase().includes(q);
      const matchCat = cat === "All" || p.category === cat;
      const matchMaterial = material === "All" || p.material === material;
      const matchEra = era === "All" || p.era === era;
      const matchAvail = !avail || p.available;
      return matchQ && matchCat && matchMaterial && matchEra && matchAvail;
    });
    if (sort === "priceLow") r = [...r].sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") r = [...r].sort((a, b) => b.price - a.price);
    return r;
  }, [query, cat, material, era, avail, sort]);

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-8">
      <div className="mb-6">
        <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Browse props</h1>
        <p className="text-sm" style={{ color: "#7C9599" }}>
          {results.length} results across {STORES.length} stores{query ? ` · “${query}”` : ""}
        </p>
      </div>

      <div className="flex gap-2 mb-6 overflow-x-auto pb-1">
        {["All", ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setCat(c)}
            className="text-xs px-3.5 py-2 rounded-full shrink-0"
            style={{
              fontFamily: "Jost, sans-serif",
              backgroundColor: cat === c ? C.primary : C.white,
              color: cat === c ? C.white : C.primary,
              border: `1px solid ${cat === c ? C.primary : C.line}`,
            }}
          >
            {c}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3 mb-8 pb-5" style={{ borderBottom: `1px solid ${C.line}` }}>
        <button onClick={() => setAvail(!avail)} className="text-xs px-3 py-2 rounded-full flex items-center gap-1.5" style={{ backgroundColor: avail ? C.primaryTint : C.white, border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
          <SlidersHorizontal size={12} /> Available only {avail && <Check size={12} />}
        </button>
        <select value={material} onChange={(e) => setMaterial(e.target.value)} className="text-xs px-3 py-2 rounded-full outline-none max-w-[160px]" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif", backgroundColor: C.white }}>
          {materials.map((m) => <option key={m} value={m}>{m === "All" ? "Material: All" : m}</option>)}
        </select>
        <select value={era} onChange={(e) => setEra(e.target.value)} className="text-xs px-3 py-2 rounded-full outline-none max-w-[150px]" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif", backgroundColor: C.white }}>
          {eras.map((m) => <option key={m} value={m}>{m === "All" ? "Era: All" : m}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="text-xs px-3 py-2 rounded-full outline-none" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif", backgroundColor: C.white }}>
          <option value="relevance">Sort: Relevance</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
        </select>
      </div>

      {results.length === 0 ? (
        <div className="text-center py-20" style={{ color: "#8AA2A6" }}>No props match your search. Try a different keyword or category.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {results.map((p) => (
            <PropCard key={p.id} p={p} onFav={toggleFav} isFav={favs.includes(p.id)} onAdd={addToCart} />
          ))}
        </div>
      )}
    </div>
  );
}
