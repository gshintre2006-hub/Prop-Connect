"use client";

import { useRouter } from "next/navigation";
import { Heart, Store, Plus } from "lucide-react";
import { C } from "@/lib/tokens";
import { Pill } from "./ui";
import { useStore } from "@/app/providers";

export function PropCard({ p, onOpen, onFav, isFav, onAdd }) {
  const router = useRouter();
  const { findStore } = useStore();
  const store = findStore(p.storeId) || {};
  const open = onOpen ? () => onOpen(p) : () => router.push(`/props/${p.id}`);

  return (
    <div
      className="group rounded-2xl overflow-hidden cursor-pointer"
      style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}
      onClick={open}
    >
      <div className="relative">
        <img src={p.img} alt={p.name} className="w-full h-[190px] object-cover transition-transform duration-500 group-hover:scale-[1.04]" />
        <button
          onClick={(e) => { e.stopPropagation(); onFav(p.id); }}
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center"
          style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
        >
          <Heart size={14} color={C.highlight} fill={isFav ? C.highlight : "none"} />
        </button>
        <div className="absolute bottom-3 left-3">
          <Pill tone={p.available ? "good" : "bad"}>{p.available ? "Available" : "Booked"}</Pill>
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="text-[0.92rem] leading-snug" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{p.name}</h3>
        </div>
        <p className="text-[0.75rem] mt-1" style={{ color: "#7C9599" }}>{p.material}</p>
        <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif" }}>{p.era}</span>
          <span className="text-[0.65rem] px-2 py-0.5 rounded-full" style={{ backgroundColor: C.bg, color: C.highlight, fontFamily: "Jost, sans-serif" }}>{p.material.split(",")[0].split("&")[0].trim()}</span>
        </div>
        <div className="flex items-center gap-1 mt-2 text-[0.72rem]" style={{ color: "#8AA2A6" }}>
          <Store size={11} /> {store.name}
        </div>
        <div className="flex items-center justify-between mt-3">
          <div>
            <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }} className="text-[0.95rem]">₹{p.price}</span>
            <span className="text-[0.7rem]" style={{ color: "#9AAEB1" }}>/day</span>
          </div>
          <button
            disabled={!p.available}
            onClick={(e) => { e.stopPropagation(); onAdd(p); }}
            className="w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-30"
            style={{ backgroundColor: C.primary }}
          >
            <Plus size={14} color={C.white} />
          </button>
        </div>
      </div>
    </div>
  );
}
