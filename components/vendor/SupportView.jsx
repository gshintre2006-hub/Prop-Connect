"use client";

import { Mail, MessageCircle, HelpCircle } from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

const FAQS = [
  { q: "How fast do my props show up on PropConnect?", a: "Within a minute of publishing — no review step for now." },
  { q: "Can shoppers see props I've marked Hidden or Maintenance?", a: "No — only props with status \"Available\", \"Reserved\" or \"Out on rent\" are shown; Hidden and Maintenance stay off the public site." },
  { q: "I made a mistake in a bulk upload — can I undo it?", a: "Delete the affected rows from Inventory, or fix them individually — bulk upload doesn't overwrite existing props, only adds new ones." },
  { q: "How do I change my store's contact details or address?", a: "Go to Store profile in the sidebar and update it there — it saves immediately." },
];

export function SupportView() {
  const { store, user } = useVendorData();
  const subject = encodeURIComponent(`Vendor Portal support — ${store?.name || "my store"}`);
  const body = encodeURIComponent(`Store: ${store?.name || "—"}\nAccount: ${user?.email || "—"}\n\nDescribe your issue here:\n`);

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Support</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>Get help with your store, listings or account.</p>

      <div className="grid sm:grid-cols-2 gap-3 mb-8">
        <a
          href={`mailto:support@propconnect.app?subject=${subject}&body=${body}`}
          className="rounded-2xl p-5 flex items-center gap-3.5"
          style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: C.primaryTint, color: C.primary }}>
            <Mail size={18} />
          </div>
          <div>
            <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Email support</div>
            <div className="text-xs" style={{ color: "#8AA2A6" }}>support@propconnect.app</div>
          </div>
        </a>
        <a
          href="https://wa.me/919999999999"
          target="_blank"
          rel="noreferrer"
          className="rounded-2xl p-5 flex items-center gap-3.5"
          style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}
        >
          <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{ backgroundColor: "#e5f3e8", color: "#2f7a45" }}>
            <MessageCircle size={18} />
          </div>
          <div>
            <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>WhatsApp</div>
            <div className="text-xs" style={{ color: "#8AA2A6" }}>Chat with the PropConnect team</div>
          </div>
        </a>
      </div>

      <h2 className="text-[0.9rem] mb-3 flex items-center gap-1.5" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
        <HelpCircle size={15} /> Frequently asked
      </h2>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {FAQS.map((f, i) => (
          <div key={i} className="px-5 py-4" style={{ borderBottom: i < FAQS.length - 1 ? `1px solid ${C.line}` : "none" }}>
            <div className="text-sm mb-1" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{f.q}</div>
            <div className="text-xs" style={{ color: "#8AA2A6" }}>{f.a}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
