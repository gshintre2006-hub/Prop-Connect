"use client";

import { ExternalLink } from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

export function VendorTopbar() {
  const { store, user } = useVendorData();
  const initials = (store?.name || "?").split(/\s+/).slice(0, 2).map((w) => w[0]).join("").toUpperCase();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-20"
      style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="text-sm" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
        {store?.name || "Vendor Portal"}
      </div>
      <div className="flex items-center gap-3">
        {store && (
          <a
            href={`/stores/${store.id}`}
            target="_blank"
            rel="noreferrer"
            className="hidden sm:flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full"
            style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
          >
            <ExternalLink size={13} /> View live on PropConnect
          </a>
        )}
        <div
          className="w-9 h-9 rounded-full flex items-center justify-center text-[0.7rem]"
          style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 600 }}
          title={user?.email}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
