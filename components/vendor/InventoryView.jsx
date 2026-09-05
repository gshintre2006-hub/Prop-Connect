"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, CirclePlus, Pencil, Trash2, Boxes } from "lucide-react";
import { C } from "@/lib/tokens";
import { CATEGORIES } from "@/lib/data";
import { useVendorData } from "./VendorDataContext";

const STATUS_LABEL = {
  available: { label: "Available", bg: "#e5f3e8", ink: "#2f7a45" },
  reserved: { label: "Reserved", bg: "#e3edf5", ink: "#2c5f7c" },
  rented: { label: "Out on rent", bg: C.accent, ink: "#8a4a44" },
  maintenance: { label: "Maintenance", bg: "#fbf0dd", ink: "#8a5f1c" },
  hidden: { label: "Hidden", bg: "#eee", ink: "#777" },
};

export function InventoryView() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { rawProps, removeProp } = useVendorData();
  const [q, setQ] = useState("");
  const initialCat = searchParams.get("category");
  const [cat, setCat] = useState(initialCat && CATEGORIES.includes(initialCat) ? initialCat : "All");
  const [busyId, setBusyId] = useState("");

  const filtered = useMemo(() => {
    const s = q.trim().toLowerCase();
    return rawProps.filter((p) => {
      const matchQ = !s || p.name.toLowerCase().includes(s) || (p.material || "").toLowerCase().includes(s);
      const matchCat = cat === "All" || p.category === cat;
      return matchQ && matchCat;
    });
  }, [rawProps, q, cat]);

  const onDelete = async (p) => {
    if (!window.confirm(`Remove "${p.name}" from your inventory?`)) return;
    setBusyId(p.id);
    try { await removeProp(p.id); } finally { setBusyId(""); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Inventory</h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>{rawProps.length} prop{rawProps.length === 1 ? "" : "s"} in your store.</p>
        </div>
        <button onClick={() => router.push("/vendor/inventory/new")} className="rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
          <CirclePlus size={14} /> Add new prop
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 mb-5">
        <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 flex-1 min-w-[220px]" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <Search size={15} color="#8AA2A6" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prop name, material…" className="flex-1 text-sm outline-none bg-transparent" style={{ fontFamily: "Jost, sans-serif", color: C.ink }} />
        </div>
        <select value={cat} onChange={(e) => setCat(e.target.value)} className="text-xs px-3 py-2.5 rounded-lg outline-none" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif", backgroundColor: C.white }}>
          <option value="All">Category: All</option>
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {filtered.length === 0 ? (
          <div className="text-center py-16">
            <Boxes size={26} color="#B7C4C6" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: "#8AA2A6" }}>
              {rawProps.length === 0 ? "No props yet — add your first one." : "Nothing matches that search."}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: C.bg }}>
                  {["Prop", "Category", "Dimensions", "Qty", "Price", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[0.68rem] uppercase tracking-wide whitespace-nowrap" style={{ color: "#8AA2A6", borderBottom: `1px solid ${C.line}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((p) => {
                  const st = STATUS_LABEL[p.status || "available"];
                  return (
                    <tr key={p.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-3">
                          <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" style={{ backgroundColor: C.bg }} />
                          <div className="min-w-0">
                            <div className="font-medium truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{p.name}</div>
                            <div className="text-[0.68rem]" style={{ color: "#9AAEB1" }}>{p.material || "—"}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-xs" style={{ color: C.ink }}>{p.category}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: C.ink }}>{[p.h, p.w, p.d].filter(Boolean).join(" × ") || "—"}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: C.ink }}>{p.qty}</td>
                      <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: C.ink }}>₹{p.price}/day</td>
                      <td className="px-4 py-3">
                        <span className="text-[0.62rem] px-2.5 py-1 rounded-full whitespace-nowrap" style={{ backgroundColor: st.bg, color: st.ink }}>{st.label}</span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1.5 justify-end">
                          <button onClick={() => router.push(`/vendor/inventory/${p.id}/edit`)} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "#8AA2A6" }} aria-label="Edit">
                            <Pencil size={14} />
                          </button>
                          <button disabled={busyId === p.id} onClick={() => onDelete(p)} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40" style={{ color: C.highlight }} aria-label="Delete">
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
