"use client";

import { useCallback, useEffect, useState } from "react";
import { Store, Pencil, Trash2, ExternalLink, Check, X, AlertTriangle } from "lucide-react";
import { C } from "@/lib/tokens";

const FIELDS = [
  ["name", "Store name"], ["location", "Area / locality"], ["address", "Full address"],
  ["phone", "Phone"], ["whatsapp", "WhatsApp"], ["email", "Email"], ["website", "Website"],
  ["hours", "Working hours"], ["delivery_areas", "Delivery areas"], ["description", "Description"],
];

const inputCls = "w-full px-3 py-2 rounded-lg text-xs outline-none";
const inputStyle = { border: `1px solid ${C.line}`, backgroundColor: C.bg, color: C.ink, fontFamily: "Jost, sans-serif" };

export function AdminStoresView() {
  const [stores, setStores] = useState(null);
  const [error, setError] = useState("");
  const [editingId, setEditingId] = useState("");
  const [draft, setDraft] = useState({});
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/stores", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't load stores.");
      setStores(json.stores);
    } catch (e) {
      setError(e.message);
      setStores([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (s) => {
    setEditingId(s.id);
    const d = {};
    FIELDS.forEach(([k]) => { d[k] = s[k] || ""; });
    setDraft(d);
  };

  const save = async () => {
    setBusy(true);
    setError("");
    try {
      const res = await fetch("/api/admin/stores", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: editingId, fields: draft }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Save failed.");
      setEditingId("");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  const remove = async (s) => {
    if (!window.confirm(`Delete "${s.name}" and all ${s.propCount} of its props? This can't be undone.`)) return;
    setBusy(true);
    try {
      const res = await fetch(`/api/admin/stores?id=${encodeURIComponent(s.id)}`, { method: "DELETE" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Delete failed.");
      await load();
    } catch (e) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Vendor stores</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>Every store a vendor has created. Edits and deletions apply to the live PropConnect catalog.</p>

      {error && (
        <div className="rounded-xl p-3 mb-4 text-xs flex items-start gap-2" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>
          <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      {stores === null ? (
        <div className="text-sm" style={{ color: "#8AA2A6" }}>Loading…</div>
      ) : stores.length === 0 ? (
        <div className="rounded-2xl py-14 text-center" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <Store size={26} color="#B7C4C6" className="mx-auto mb-3" />
          <p className="text-sm" style={{ color: "#8AA2A6" }}>No vendor stores yet.</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {stores.map((s) => (
            <div key={s.id} className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="flex items-center gap-3 px-4 py-3.5">
                <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryTint, color: C.primary }}>
                  <Store size={16} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="text-sm truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{s.name}</div>
                  <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>
                    {s.location || "—"} · {s.propCount} prop{s.propCount === 1 ? "" : "s"} · joined {new Date(s.created_at).toLocaleDateString()}
                  </div>
                </div>
                <a href={`/stores/${s.id}`} target="_blank" rel="noreferrer" className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "#8AA2A6" }} title="View live">
                  <ExternalLink size={14} />
                </a>
                <button onClick={() => (editingId === s.id ? setEditingId("") : startEdit(s))} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ color: "#8AA2A6" }} title="Edit">
                  {editingId === s.id ? <X size={14} /> : <Pencil size={14} />}
                </button>
                <button disabled={busy} onClick={() => remove(s)} className="w-8 h-8 rounded-lg flex items-center justify-center disabled:opacity-40" style={{ color: C.highlight }} title="Delete">
                  <Trash2 size={14} />
                </button>
              </div>

              {editingId === s.id && (
                <div className="px-4 pb-4 pt-1" style={{ borderTop: `1px solid ${C.line}` }}>
                  <div className="grid sm:grid-cols-2 gap-3 mt-3">
                    {FIELDS.map(([k, label]) => (
                      <div key={k} className={k === "description" || k === "address" ? "sm:col-span-2" : ""}>
                        <label className="text-[0.68rem] mb-1 block" style={{ color: "#6B8489" }}>{label}</label>
                        <input className={inputCls} style={inputStyle} value={draft[k] ?? ""} onChange={(e) => setDraft((d) => ({ ...d, [k]: e.target.value }))} />
                      </div>
                    ))}
                  </div>
                  <div className="flex items-center gap-2 mt-4">
                    <button onClick={save} disabled={busy} className="rounded-full px-4 py-2 text-xs flex items-center gap-1.5 disabled:opacity-50" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
                      <Check size={13} /> {busy ? "Saving…" : "Save changes"}
                    </button>
                    <button onClick={() => setEditingId("")} className="rounded-full px-4 py-2 text-xs" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
