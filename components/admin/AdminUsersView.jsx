"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Search, AlertTriangle, ShieldCheck, Store } from "lucide-react";
import { C } from "@/lib/tokens";

function fmt(d) {
  return d ? new Date(d).toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" }) : "—";
}

export function AdminUsersView() {
  const [users, setUsers] = useState(null);
  const [error, setError] = useState("");
  const [q, setQ] = useState("");
  const [filter, setFilter] = useState("all"); // all | vendors | shoppers

  const load = useCallback(async () => {
    setError("");
    try {
      const res = await fetch("/api/admin/users", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't load users.");
      setUsers(json.users);
    } catch (e) {
      setError(e.message);
      setUsers([]);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    return (users || []).filter((u) => {
      const mq = !s || u.email?.toLowerCase().includes(s) || u.name?.toLowerCase().includes(s);
      const mf = filter === "all" || (filter === "vendors" ? !!u.store : !u.store);
      return mq && mf;
    });
  }, [users, q, filter]);

  const vendorCount = (users || []).filter((u) => u.store).length;

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Users</h1>
      <p className="text-sm mb-5" style={{ color: "#7C9599" }}>
        {users ? `${users.length} total · ${vendorCount} own a vendor store` : "Everyone who has signed in to PropConnect or the Vendor Portal."}
      </p>

      <div className="flex flex-wrap items-center gap-2.5 mb-4">
        <div className="flex items-center gap-2 rounded-lg px-3.5 py-2.5 flex-1 min-w-[220px]" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <Search size={15} color="#8AA2A6" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search email or name…" className="flex-1 text-sm outline-none bg-transparent" style={{ fontFamily: "Jost, sans-serif", color: C.ink }} />
        </div>
        <div className="flex gap-1.5">
          {[["all", "All"], ["vendors", "Vendors"], ["shoppers", "Shoppers"]].map(([k, label]) => (
            <button
              key={k}
              onClick={() => setFilter(k)}
              className="text-xs px-3 py-2 rounded-full"
              style={{
                fontFamily: "Jost, sans-serif",
                backgroundColor: filter === k ? C.primary : C.white,
                color: filter === k ? C.white : C.primary,
                border: `1px solid ${filter === k ? C.primary : C.line}`,
              }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="rounded-xl p-3 mb-4 text-xs flex items-start gap-2" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>
          <AlertTriangle size={13} className="mt-0.5 shrink-0" /> {error}
        </div>
      )}

      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {users === null ? (
          <div className="p-8 text-center text-sm" style={{ color: "#8AA2A6" }}>Loading…</div>
        ) : shown.length === 0 ? (
          <div className="p-10 text-center text-sm" style={{ color: "#8AA2A6" }}>No users match.</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm" style={{ borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ backgroundColor: C.bg }}>
                  {["User", "Sign-in", "Joined", "Last seen", "Role"].map((h) => (
                    <th key={h} className="text-left px-4 py-3 text-[0.68rem] uppercase tracking-wide whitespace-nowrap" style={{ color: "#8AA2A6", borderBottom: `1px solid ${C.line}` }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {shown.map((u) => (
                  <tr key={u.id} style={{ borderBottom: `1px solid ${C.line}` }}>
                    <td className="px-4 py-3">
                      <div className="min-w-0">
                        <div className="font-medium truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{u.name || u.email}</div>
                        {u.name && <div className="text-[0.68rem]" style={{ color: "#9AAEB1" }}>{u.email}</div>}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-xs capitalize" style={{ color: C.ink }}>{u.provider}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: C.ink }}>{fmt(u.createdAt)}</td>
                    <td className="px-4 py-3 text-xs whitespace-nowrap" style={{ color: C.ink }}>{fmt(u.lastSignInAt)}</td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap gap-1.5">
                        {u.isAdmin && (
                          <span className="text-[0.62rem] px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: C.primaryTint, color: C.primary }}>
                            <ShieldCheck size={10} /> Admin
                          </span>
                        )}
                        {u.store ? (
                          <a href={`/stores/${u.store.id}`} target="_blank" rel="noreferrer" className="text-[0.62rem] px-2 py-1 rounded-full flex items-center gap-1" style={{ backgroundColor: "#e5f3e8", color: "#2f7a45" }}>
                            <Store size={10} /> {u.store.name}
                          </a>
                        ) : (
                          <span className="text-[0.62rem] px-2 py-1 rounded-full" style={{ backgroundColor: C.bg, color: "#8AA2A6" }}>Shopper</span>
                        )}
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
