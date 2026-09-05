"use client";

import { RefreshCw } from "lucide-react";
import { C } from "@/lib/tokens";
import { useAdminData } from "./AdminDataContext";

export function AdminTopbar() {
  const { user, refresh, loading } = useAdminData();
  const initials = (user?.email || "?").slice(0, 2).toUpperCase();

  return (
    <header
      className="h-16 flex items-center justify-between px-6 sticky top-0 z-20"
      style={{ backgroundColor: C.white, borderBottom: `1px solid ${C.line}` }}
    >
      <div className="text-sm" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
        Admin Console
      </div>
      <div className="flex items-center gap-3">
        <button
          onClick={refresh}
          disabled={loading}
          className="hidden sm:flex items-center gap-1.5 text-xs px-3.5 py-2 rounded-full disabled:opacity-50"
          style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}
        >
          <RefreshCw size={13} className={loading ? "animate-spin" : ""} /> Refresh
        </button>
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
