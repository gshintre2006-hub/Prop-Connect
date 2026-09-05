"use client";

import { useCallback, useEffect, useState } from "react";
import { Search, Trash2, AlertTriangle, Loader2, ExternalLink } from "lucide-react";
import { C } from "@/lib/tokens";

const STATUS_OPTIONS = [
  { key: "available", label: "Available", bg: "#e5f3e8", ink: "#2f7a45" },
  { key: "reserved", label: "Reserved", bg: "#e3edf5", ink: "#2c5f7c" },
  { key: "rented", label: "Out on rent", bg: C.accent, ink: "#8a4a44" },
  { key: "maintenance", label: "Maintenance", bg: "#fbf0dd", ink: "#8a5f1c" },
  { key: "hidden", label: "Hidden", bg: "#eee", ink: "#777" },
];

export function AdminPropsView() {
  const [props, setProps] = useState(null);
  const [stores, setStores] = useState([]);
  const [q, setQ] = useState("");
  const [storeId, setStoreId] = useState("");
  const [error, setError] = useState("");
  const [busyId, setBusyId] = useState("");

  const load = useCallback(async () => {
    setError("");
    try {
      const params = new URLSearchParams();
      if (q.trim()) params.set("q", q.trim());
      if (storeId) params.set("storeId", storeId);
      const res = await fetch(`/api/admin/props?${params}`, { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't load props.");
      setProps(json.props);
      setStores(json.stores);
    } catch (e) {
      setError(e.message);
      setProps([]);
    }
  }, [q, storeId]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const setStatus = async (p, status) => {
    setBusyId(p.id);
    try {
      const res = await fetch("/api/admin/props", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: p.id, fields: { status } }),
      });
      if (!res.ok) throw new Error((await res.json()).error || "Update failed.");
      setProps((rows) => rows.map((r) => (r.id === p.id ? { ...r, status, available: status === "available" } : r)));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  };

  const remove = async (p) => {
    if (!window.confirm(`Delete "${p.name}" from ${p.storeName}? This removes it from PropConnect.`)) return;
    setBusyId(p.id);
    try {
      const res = await fetch(`/api/admin/props?id=${encodeURIComponent(p.id)}`, { method: "DELETE" });
      if (!res.ok) throw new Error((await res.json()).error || "Delete failed.");
      setProps((rows) => rows.filter((r) => r.id !== p.id));
    } catch (e) {
      setError(e.message);
    } finally {
      setBusyId("");
    }
  };

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>All props</h1>
      <p className="text-sm mb-5" style={{ color: "#7C9599" }}>Every prop from every vendor store. Change status to moderate what shoppers see, or remove it entirely.</p>

      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 flex-1 min-w-[220px]" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <Search size={15} color="#8AA2A6" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search prop, category or store…" className="flex-1 text-sm outline-none bg-transparent" style={{ fontFamily: "Jost, sans-serif", color: C.ink }} />
        </div>
        <select value={storeId} onChange={(e) => setStoreId(e.target.value)} className="text-xs px-3 py-2.5 rounded-lg outline-none" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif", backgroundColor: C.white }}>
          <option value="">All stores</option>
          {stores.map((s) => <option key={s.id} value={s.id}>{s.name}</option>)}
        </select>
      </div>

      {error && (
        <div className="rounded-xl p-3 mb-4 text-xs flex items-start gap-2" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>
          <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {props === null ? (
          <div className="p-8 text-center text-sm" style={{ color: "#8AA2A6" }}>Loading…</div>
        ) : props.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: "#8AA2A6" }}>No props match.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: C.bg }}>
                  {["Prop", "Store", "Price", "Qty", "Status", ""].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[0.68rem] uppercase tracking-wide whitespace-nowrap" style={{ color: "#8AA2A6", borderBottom: `1px solid ${C.line}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {props.map((p) => (
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
                    <td className="px-4 py-3 text-xs" style={{ color: C.ink }}>{p.storeName}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: C.ink }}>₹{p.price}/day</td>
                    <td className="px-4 py-3 text-xs" style={{ color: C.ink }}>{p.qty}</td>
                    <td className="px-4 py-3">
                      <select
                        value={p.status || "available"}
                        disabled={busyId === p.id}
                        onChange={(e) => setStatus(p, e.target.value)}
                        className="text-xs px-2 py-1.5 rounded-lg outline-none"
                        style={{ border: `1px solid ${C.line}`, color: C.ink, fontFamily: "Jost, sans-serif", backgroundColor: C.bg }}
                      >
                        {STATUS_OPTIONS.map((o) => <option key={o.key} value={o.key}>{o.label}</option>)}
                      </select>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-1.5 justify-end">
                        <a href={`/props/${p.id}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "#8AA2A6" }} title="View live">
                          <ExternalLink size={14} />
                        </a>
                        <button disabled={busyId === p.id} onClick={() => remove(p)} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40" style={{ color: C.highlight }} title="Delete">
                          <Trash2 size={14} />
                        </button>
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
