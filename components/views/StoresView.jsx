"use client";

import { C } from "@/lib/tokens";
import { STORES } from "@/lib/data";
import { StoreCard } from "@/components/StoreCard";

export function StoresView() {
  return (
    <div className="max-w-[1200px] mx-auto px-5 sm:px-6 py-10">
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">Store directory</h1>
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>{STORES.length} verified rental stores on the network.</p>
      <div className="grid sm:grid-cols-2 gap-5">
        {STORES.map((s) => <StoreCard key={s.id} s={s} layout="row" />)}
      </div>
    </div>
  );
}
