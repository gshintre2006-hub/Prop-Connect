"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { ChevronRight, Network } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES } from "@/lib/data";
import { useVendorData } from "./VendorDataContext";

export function CategoriesView() {
  const router = useRouter();
  const { rawProps } = useVendorData();

  const counts = useMemo(() => {
    const m = {};
    rawProps.forEach((p) => { m[p.category] = (m[p.category] || 0) + 1; });
    return m;
  }, [rawProps]);

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Categories</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>
        The categories your props are organised into on PropConnect. Tap one to see or edit those props.
      </p>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            onClick={() => router.push(`/vendor/inventory?category=${encodeURIComponent(c)}`)}
            className="rounded-2xl p-4 flex items-center justify-between gap-3 text-left transition-transform hover:-translate-y-0.5"
            style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryTint, color: C.primary }}>
                <Network size={16} />
              </div>
              <div className="min-w-0">
                <div className="text-[0.85rem] truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{c}</div>
                <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>
                  {counts[c] || 0} prop{(counts[c] || 0) === 1 ? "" : "s"}
                </div>
              </div>
            </div>
            <ChevronRight size={15} color="#B7C4C6" className="shrink-0" />
          </button>
        ))}
      </div>
    </div>
  );
}
