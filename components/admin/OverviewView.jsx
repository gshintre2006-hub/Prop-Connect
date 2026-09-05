"use client";

import { useRouter } from "next/navigation";
import { Store, Boxes, Users, AlertTriangle, ChevronRight } from "lucide-react";
import { C } from "@/lib/tokens";
import { useAdminData } from "./AdminDataContext";

const STATUS_LABEL = {
  available: { label: "Available", bg: "#e5f3e8", ink: "#2f7a45" },
  reserved: { label: "Reserved", bg: "#e3edf5", ink: "#2c5f7c" },
  rented: { label: "Out on rent", bg: C.accent, ink: "#8a4a44" },
  maintenance: { label: "Maintenance", bg: "#fbf0dd", ink: "#8a5f1c" },
  hidden: { label: "Hidden", bg: "#eee", ink: "#777" },
};

function Metric({ icon: Icon, label, val, bg, ink, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl p-4 text-left transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: bg, color: ink }}>
        <Icon size={16} />
      </div>
      <div className="text-2xl" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{val}</div>
      <div className="text-[0.68rem] mt-0.5" style={{ color: "#8AA2A6" }}>{label}</div>
    </button>
  );
}

export function OverviewView() {
  const router = useRouter();
  const { overview, loading, error } = useAdminData();

  if (loading) return <div className="text-sm" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>Loading the console…</div>;

  if (error) {
    return (
      <div className="rounded-2xl p-5 flex items-start gap-3" style={{ backgroundColor: "#F5DCDA" }}>
        <AlertTriangle size={16} color={C.highlight} className="mt-0.5 shrink-0" />
        <div className="text-sm" style={{ color: C.highlight }}>
          <div style={{ fontWeight: 600 }}>{error}</div>
          <div className="text-xs mt-1">
            If this mentions the service role key, add <code>SUPABASE_SERVICE_ROLE_KEY</code> in Vercel and redeploy.
          </div>
        </div>
      </div>
    );
  }

  const c = overview?.counts || { stores: 0, props: 0, users: 0 };
  const sb = overview?.statusBreakdown || {};

  return (
    <div>
      <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Overview</h1>
      <p className="text-sm mb-6" style={{ color: "#7C9599" }}>Everything vendors have onboarded onto PropConnect.</p>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 mb-8">
        <Metric icon={Store} label="Vendor stores" val={c.stores} bg="#c9dee2" ink="#013e4f" onClick={() => router.push("/admin/stores")} />
        <Metric icon={Boxes} label="Vendor props" val={c.props} bg="#e5f3e8" ink="#2f7a45" onClick={() => router.push("/admin/props")} />
        <Metric icon={Users} label="Registered users" val={c.users} bg="#e3edf5" ink="#2c5f7c" onClick={() => router.push("/admin/users")} />
      </div>

      {Object.keys(sb).length > 0 && (
        <div className="mb-8">
          <h2 className="text-[0.9rem] mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Prop status across the network</h2>
          <div className="flex flex-wrap gap-2">
            {Object.entries(sb).map(([k, n]) => {
              const st = STATUS_LABEL[k] || { label: k, bg: "#eee", ink: "#777" };
              return (
                <span key={k} className="text-xs px-3 py-1.5 rounded-full" style={{ backgroundColor: st.bg, color: st.ink, fontFamily: "Jost, sans-serif" }}>
                  {st.label}: {n}
                </span>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[0.9rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Newest stores</h2>
            <button onClick={() => router.push("/admin/stores")} className="text-xs flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>All stores <ChevronRight size={13} /></button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            {(overview?.recentStores || []).length === 0 ? (
              <div className="p-6 text-center text-xs" style={{ color: "#9AAEB1" }}>No stores yet.</div>
            ) : (
              overview.recentStores.map((s, i) => (
                <div key={s.id} className="px-4 py-3 text-sm" style={{ borderBottom: i < overview.recentStores.length - 1 ? `1px solid ${C.line}` : "none", color: C.ink, fontFamily: "Jost, sans-serif" }}>
                  <div style={{ fontWeight: 500 }}>{s.name}</div>
                  <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>{s.location || "—"} · {new Date(s.created_at).toLocaleDateString()}</div>
                </div>
              ))
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[0.9rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Newest props</h2>
            <button onClick={() => router.push("/admin/props")} className="text-xs flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>All props <ChevronRight size={13} /></button>
          </div>
          <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            {(overview?.recentProps || []).length === 0 ? (
              <div className="p-6 text-center text-xs" style={{ color: "#9AAEB1" }}>No props yet.</div>
            ) : (
              overview.recentProps.map((p, i) => (
                <div key={p.id} className="px-4 py-3 text-sm flex items-center justify-between gap-3" style={{ borderBottom: i < overview.recentProps.length - 1 ? `1px solid ${C.line}` : "none", color: C.ink, fontFamily: "Jost, sans-serif" }}>
                  <div className="min-w-0">
                    <div className="truncate" style={{ fontWeight: 500 }}>{p.name}</div>
                    <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>{p.category}</div>
                  </div>
                  <span className="text-[0.62rem] px-2.5 py-1 rounded-full shrink-0" style={{ ...(STATUS_LABEL[p.status || "available"] ? { backgroundColor: STATUS_LABEL[p.status || "available"].bg, color: STATUS_LABEL[p.status || "available"].ink } : {}) }}>
                    {(STATUS_LABEL[p.status || "available"] || { label: p.status }).label}
                  </span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
