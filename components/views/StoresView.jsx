"use client";

import { useRouter } from "next/navigation";
import { MapPin, Star } from "lucide-react";
import { C } from "@/lib/tokens";
import { STORES } from "@/lib/data";

export function StoresView() {
  const router = useRouter();

  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-10">
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Store directory</h1>
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>{STORES.length} verified rental stores on the network.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {STORES.map((s) => (
          <button key={s.id} onClick={() => router.push(`/stores/${s.id}`)} className="rounded-2xl overflow-hidden text-left flex" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <img src={s.photos[0]} className="w-[100px] sm:w-[140px] h-auto min-h-[120px] object-cover shrink-0" alt="" />
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2">
                <img src={s.logo} className="w-7 h-7 rounded-full object-cover" alt="" />
                <span className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{s.name}</span>
              </div>
              <div className="flex items-center gap-1 text-[0.72rem] mt-2" style={{ color: "#8AA2A6" }}><MapPin size={10} /> {s.location}</div>
              <div className="flex items-center gap-1 text-[0.72rem] mt-1" style={{ color: "#8AA2A6" }}><Star size={10} fill={C.highlight} color={C.highlight} /> {s.rating} · {s.totalProps} props</div>
              <span className="inline-block mt-3 text-xs" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>View store →</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
