"use client";

import { useRouter } from "next/navigation";
import { MapPin, Star, Heart } from "lucide-react";
import { C } from "@/lib/tokens";
import { useStore } from "@/app/providers";

export function StoreCard({ s, layout = "stacked" }) {
  const router = useRouter();
  const { favStores, toggleFavStore } = useStore();
  const isFav = favStores.includes(s.id);
  const open = () => router.push(`/stores/${s.id}`);

  const Fav = (
    <button
      onClick={(e) => { e.stopPropagation(); toggleFavStore(s.id); }}
      className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
      style={{ backgroundColor: "rgba(255,255,255,0.9)" }}
      aria-label={isFav ? "Remove from saved" : "Save store"}
    >
      <Heart size={14} color={C.highlight} fill={isFav ? C.highlight : "none"} />
    </button>
  );

  if (layout === "row") {
    return (
      <div onClick={open} className="rounded-2xl overflow-hidden text-left flex cursor-pointer" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <img src={s.photos[0]} className="w-[100px] sm:w-[140px] h-auto min-h-[120px] object-cover shrink-0" alt="" />
        <div className="p-4 flex-1">
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2">
              <img src={s.logo} className="w-7 h-7 rounded-full object-cover" alt="" />
              <span className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{s.name}</span>
            </div>
            {Fav}
          </div>
          <div className="flex items-center gap-1 text-[0.72rem] mt-2" style={{ color: "#8AA2A6" }}><MapPin size={10} /> {s.location}</div>
          <div className="flex items-center gap-1 text-[0.72rem] mt-1" style={{ color: "#8AA2A6" }}><Star size={10} fill={C.highlight} color={C.highlight} /> {s.rating} · {s.totalProps} props</div>
          <span className="inline-block mt-3 text-xs" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>View store →</span>
        </div>
      </div>
    );
  }

  return (
    <div onClick={open} className="rounded-2xl overflow-hidden text-left cursor-pointer" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
      <div className="relative">
        <img src={s.photos[0]} alt={s.name} className="w-full h-[110px] object-cover" />
        <div className="absolute top-2.5 right-2.5">{Fav}</div>
      </div>
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
    </div>
  );
}
