"use client";

import { useState } from "react";
import { Save, ExternalLink } from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

const FIELD = "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none";
const fs = { border: `1px solid ${C.line}`, backgroundColor: C.bg, color: C.ink, fontFamily: "Jost, sans-serif" };
function Field({ label, children }) {
  return (
    <div>
      <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>{label}</label>
      {children}
    </div>
  );
}

export function StoreProfileView() {
  const { store, saveStoreProfile } = useVendorData();
  const [f, setF] = useState({
    name: store?.name || "", location: store?.location || "", address: store?.address || "",
    phone: store?.phone || "", whatsapp: store?.whatsapp || "", email: store?.email || "",
    website: store?.website || "", hours: store?.hours || "", description: store?.description || "",
    deliveryAreas: store?.deliveryAreas || "",
  });
  const [busy, setBusy] = useState(false);
  const [saved, setSaved] = useState(false);
  const set = (k) => (e) => { setSaved(false); setF((s) => ({ ...s, [k]: e.target.value })); };

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try { await saveStoreProfile(f); setSaved(true); } finally { setBusy(false); }
  };

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-6">
        <div>
          <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Store profile</h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>This is what art directors see on PropConnect.</p>
        </div>
        <div className="flex items-center gap-2">
          {store && (
            <a href={`/stores/${store.id}`} target="_blank" rel="noreferrer" className="text-xs flex items-center gap-1.5 rounded-full px-3.5 py-2" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
              <ExternalLink size={13} /> View live page
            </a>
          )}
          <button onClick={submit} disabled={busy} className="rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-50" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
            <Save size={14} /> {busy ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>

      {saved && <div className="rounded-xl p-3 mb-5 text-xs" style={{ backgroundColor: "#DCEEE4", color: "#1F7A52" }}>Saved — live on your PropConnect store page.</div>}

      <div
        className="h-[130px] rounded-2xl mb-8 relative flex items-end p-5"
        style={{ background: `linear-gradient(120deg, ${C.secondary}, ${C.accent})` }}
      >
        <div className="rounded-2xl px-4 py-2 text-sm" style={{ backgroundColor: "rgba(255,255,255,0.92)", color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>
          {f.name || "Your store name"}
        </div>
      </div>

      <form onSubmit={submit} className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        <h3 className="text-[0.95rem] mb-1" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Basic details</h3>
        <p className="text-xs mb-3" style={{ color: "#9AAEB1" }}>Name, description and where you&apos;re located.</p>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Store name"><input className={FIELD} style={fs} value={f.name} onChange={set("name")} /></Field>
          <Field label="Area / locality"><input className={FIELD} style={fs} value={f.location} onChange={set("location")} /></Field>
          <Field label="Phone"><input className={FIELD} style={fs} value={f.phone} onChange={set("phone")} /></Field>
          <Field label="WhatsApp"><input className={FIELD} style={fs} value={f.whatsapp} onChange={set("whatsapp")} /></Field>
          <Field label="Email"><input className={FIELD} style={fs} value={f.email} onChange={set("email")} /></Field>
          <Field label="Website"><input className={FIELD} style={fs} value={f.website} onChange={set("website")} /></Field>
          <Field label="Working hours"><input className={FIELD} style={fs} value={f.hours} onChange={set("hours")} /></Field>
          <Field label="Delivery areas"><input className={FIELD} style={fs} value={f.deliveryAreas} onChange={set("deliveryAreas")} /></Field>
        </div>
        <Field label="Description"><textarea rows={3} className={FIELD} style={{ ...fs, resize: "vertical" }} value={f.description} onChange={set("description")} /></Field>
        <Field label="Address"><input className={FIELD} style={fs} value={f.address} onChange={set("address")} /></Field>
      </form>
    </div>
  );
}
