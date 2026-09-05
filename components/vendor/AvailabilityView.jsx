"use client";

import { useState } from "react";
import { CalendarCheck, Loader2 } from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

const STATUS_OPTIONS = [
  { key: "available", label: "Available", bg: "#e5f3e8", ink: "#2f7a45" },
  { key: "reserved", label: "Reserved", bg: "#e3edf5", ink: "#2c5f7c" },
  { key: "rented", label: "Out on rent", bg: C.accent, ink: "#8a4a44" },
  { key: "maintenance", label: "Maintenance", bg: "#fbf0dd", ink: "#8a5f1c" },
  { key: "hidden", label: "Hidden", bg: "#eee", ink: "#777" },
];

// vendor_props rows come back with snake_case DB columns — editProp() expects
// the same camelCase field shape PropForm submits, so re-map before saving.
function rowToFields(p) {
  return {
    name: p.name, category: p.category, subCategory: p.sub_category || "",
    keywords: p.keywords || "", tags: p.tags || "", description: p.description || "",
    material: p.material || "", finish: p.finish || "", style: p.style || "",
    era: p.era || "", color: p.color || "", condition: p.condition || "Excellent",
    h: p.h || "", w: p.w || "", d: p.d || "", seat: p.seat || "",
    weight: p.weight || "", price: p.price, deposit: p.deposit,
    replacementValue: p.replacement_value ?? "", minDays: p.min_days ?? 1, maxDays: p.max_days ?? 30,
    qty: p.qty, status: p.status,
  };
}

export function AvailabilityView() {
  const { rawProps, editProp } = useVendorData();
  const [busyId, setBusyId] = useState("");
  const [qtyDrafts, setQtyDrafts] = useState({});

  const setStatus = async (p, status) => {
    setBusyId(p.id);
    try { await editProp(p.id, { ...rowToFields(p), status }); } finally { setBusyId(""); }
  };

  const commitQty = async (p) => {
    const draft = qtyDrafts[p.id];
    if (draft === undefined || Number(draft) === Number(p.qty)) return;
    setBusyId(p.id);
    try { await editProp(p.id, { ...rowToFields(p), qty: Number(draft) || 0 }); }
    finally { setBusyId(""); }
  };

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Availability</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>
        Update status and quantity for every prop from one place — changes reflect on PropConnect within a minute.
      </p>

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {rawProps.length === 0 ? (
          <div className="text-center py-16">
            <CalendarCheck size={26} color="#B7C4C6" className="mx-auto mb-3" />
            <p className="text-sm" style={{ color: "#8AA2A6" }}>No props yet — add your first one from Inventory.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: C.bg }}>
                  {["Prop", "Qty", "Status"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[0.68rem] uppercase tracking-wide whitespace-nowrap" style={{ color: "#8AA2A6", borderBottom: `1px solid ${C.line}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {rawProps.map((p) => (
                  <tr key={p.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img src={p.img} alt="" className="w-10 h-10 rounded-lg object-cover shrink-0" style={{ backgroundColor: C.bg }} />
                        <div className="min-w-0">
                          <div className="font-medium truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{p.name}</div>
                          <div className="text-[0.68rem]" style={{ color: "#9AAEB1" }}>{p.category}</div>
                        </div>
                        {busyId === p.id && <Loader2 size={13} className="animate-spin shrink-0" color={C.primary} />}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min={0}
                        value={qtyDrafts[p.id] ?? p.qty}
                        onChange={(e) => setQtyDrafts((s) => ({ ...s, [p.id]: e.target.value }))}
                        onBlur={() => commitQty(p)}
                        className="w-16 px-2 py-1.5 rounded-lg text-xs outline-none"
                        style={{ border: `1px solid ${C.line}`, fontFamily: "Jost, sans-serif", color: C.ink }}
                      />
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {STATUS_OPTIONS.map((o) => (
                          <button
                            key={o.key}
                            disabled={busyId === p.id}
                            onClick={() => setStatus(p, o.key)}
                            className="text-[0.65rem] px-2.5 py-1 rounded-full whitespace-nowrap disabled:opacity-50"
                            style={{
                              fontFamily: "Jost, sans-serif",
                              backgroundColor: (p.status || "available") === o.key ? o.bg : "transparent",
                              color: (p.status || "available") === o.key ? o.ink : "#9AAEB1",
                              border: `1px solid ${(p.status || "available") === o.key ? "transparent" : C.line}`,
                            }}
                          >
                            {o.label}
                          </button>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
