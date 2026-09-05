"use client";

import { useMemo } from "react";
import { Boxes, IndianRupee, TriangleAlert, Layers } from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

function MetricCard({ icon: Icon, label, val, bg, ink }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: bg, color: ink }}>
        <Icon size={16} />
      </div>
      <div className="text-xl" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{val}</div>
      <div className="text-[0.68rem] mt-0.5" style={{ color: "#8AA2A6" }}>{label}</div>
    </div>
  );
}

export function ReportsView() {
  const { rawProps } = useVendorData();

  const stats = useMemo(() => {
    const byCategory = {};
    let dayRevenuePotential = 0;
    let lowStock = 0;
    let unavailable = 0;
    rawProps.forEach((p) => {
      byCategory[p.category] = (byCategory[p.category] || 0) + 1;
      dayRevenuePotential += (Number(p.price) || 0) * (Number(p.qty) || 0);
      if ((p.status || "available") === "available" && Number(p.qty) <= 1) lowStock++;
      if ((p.status || "available") !== "available") unavailable++;
    });
    const topCategories = Object.entries(byCategory).sort((a, b) => b[1] - a[1]).slice(0, 8);
    return { totalProps: rawProps.length, dayRevenuePotential, lowStock, unavailable, topCategories };
  }, [rawProps]);

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Reports</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>A quick read on how your inventory looks right now.</p>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-8">
        <MetricCard icon={Boxes} label="Total props" val={stats.totalProps} bg="#c9dee2" ink="#013e4f" />
        <MetricCard icon={IndianRupee} label="Potential daily revenue" val={`₹${stats.dayRevenuePotential.toLocaleString("en-IN")}`} bg="#e5f3e8" ink="#2f7a45" />
        <MetricCard icon={TriangleAlert} label="Low stock (≤1 left)" val={stats.lowStock} bg={C.accent} ink="#8a4a44" />
        <MetricCard icon={Layers} label="Unavailable right now" val={stats.unavailable} bg="#fbf0dd" ink="#8a5f1c" />
      </div>

      <h2 className="text-[0.9rem] mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Props by category</h2>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {stats.topCategories.length === 0 ? (
          <div className="text-center py-12 text-sm" style={{ color: "#8AA2A6" }}>No props yet — nothing to report on.</div>
        ) : (
          stats.topCategories.map(([cat, count], i) => (
            <div key={cat} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < stats.topCategories.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <div className="text-sm flex-1" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{cat}</div>
              <div className="h-1.5 rounded-full flex-1 max-w-[200px]" style={{ backgroundColor: C.bg }}>
                <div className="h-full rounded-full" style={{ width: `${(count / stats.totalProps) * 100}%`, backgroundColor: C.primary }} />
              </div>
              <div className="text-xs w-8 text-right" style={{ color: "#8AA2A6" }}>{count}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
