"use client";

import { useState } from "react";
import { Store, ArrowRight } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useVendorData } from "./VendorDataContext";

const FIELD = "w-full px-3.5 py-2.5 rounded-lg text-sm outline-none";
const fieldStyle = { border: `1px solid ${C.line}`, backgroundColor: C.bg, color: C.ink, fontFamily: "Jost, sans-serif" };

export function StoreOnboarding() {
  const { setupStore, user } = useVendorData();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [f, setF] = useState({
    name: "", location: "", address: "", phone: "", whatsapp: "",
    email: user?.email || "", website: "", hours: "Mon–Sat, 9:00 AM – 7:00 PM",
    description: "", deliveryAreas: "",
  });
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    if (!f.name.trim()) { setError("Store name is required."); return; }
    setBusy(true);
    setError("");
    try {
      await setupStore(f);
    } catch (err) {
      setError(err?.message || "Couldn't create your store. Try again.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-12" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[560px]">
        <div className="flex flex-col items-center mb-7">
          <Logo variant="full" size={100} />
        </div>
        <div className="rounded-[24px] p-6 sm:p-8" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: C.primaryTint }}>
            <Store size={20} color={C.primary} />
          </div>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-xl mb-1">Set up your store</h1>
          <p className="text-sm mb-6" style={{ color: "#6B8489" }}>
            This is what art directors will see on PropConnect. You can edit it anytime from Store profile.
          </p>

          {error && <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>}

          <form onSubmit={submit} className="space-y-3.5">
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Store name *</label>
                <input required className={FIELD} style={fieldStyle} value={f.name} onChange={set("name")} placeholder="e.g. Kranti Studio Props" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Area / locality</label>
                <input className={FIELD} style={fieldStyle} value={f.location} onChange={set("location")} placeholder="Goregaon East, Film City" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Full address</label>
              <input className={FIELD} style={fieldStyle} value={f.address} onChange={set("address")} placeholder="Plot / shed, road, area, city, pincode" />
            </div>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Phone</label>
                <input className={FIELD} style={fieldStyle} value={f.phone} onChange={set("phone")} placeholder="+91 98200 11234" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>WhatsApp</label>
                <input className={FIELD} style={fieldStyle} value={f.whatsapp} onChange={set("whatsapp")} placeholder="919820011234" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 gap-3.5">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Contact email</label>
                <input type="email" className={FIELD} style={fieldStyle} value={f.email} onChange={set("email")} placeholder="hello@yourstudioprops.com" />
              </div>
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Website (optional)</label>
                <input className={FIELD} style={fieldStyle} value={f.website} onChange={set("website")} placeholder="yourstudioprops.com" />
              </div>
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Working hours</label>
              <input className={FIELD} style={fieldStyle} value={f.hours} onChange={set("hours")} />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Short description</label>
              <textarea rows={2} className={FIELD} style={{ ...fieldStyle, resize: "vertical" }} value={f.description} onChange={set("description")} placeholder="What your store specialises in, since when…" />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489" }}>Delivery areas</label>
              <input className={FIELD} style={fieldStyle} value={f.deliveryAreas} onChange={set("deliveryAreas")} placeholder="Goregaon, Aarey, Jogeshwari, Andheri" />
            </div>

            <button
              type="submit"
              disabled={busy}
              className="w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2 disabled:opacity-50"
              style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
            >
              {busy ? "Creating your store…" : "Create store & continue"} <ArrowRight size={15} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
