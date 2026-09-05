"use client";

import { useRouter } from "next/navigation";
import {
  Boxes, CircleCheck, Bookmark, Truck, Wrench, CirclePlus, Upload,
  CalendarCheck, Store, ChevronRight, Package,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { useVendorData } from "./VendorDataContext";

const STATUS_LABEL = {
  available: { label: "Available", bg: "#e5f3e8", ink: "#2f7a45" },
  reserved: { label: "Reserved", bg: "#e3edf5", ink: "#2c5f7c" },
  rented: { label: "Out on rent", bg: C.accent, ink: "#8a4a44" },
  maintenance: { label: "Maintenance", bg: "#fbf0dd", ink: "#8a5f1c" },
  hidden: { label: "Hidden", bg: "#eee", ink: "#777" },
};

function MetricCard({ icon: Icon, label, val, bg, ink }) {
  return (
    <div className="rounded-2xl p-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
      <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ backgroundColor: bg, color: ink }}>
        <Icon size={16} />
      </div>
      <div className="text-xl" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{val}</div>
      <div className="text-[0.68rem] mt-0.5" style={{ color: "#8AA2A6" }}>{label}</div>
    </div>
  );
}

function QuickAction({ icon: Icon, title, sub, bg, ink, onClick }) {
  return (
    <button onClick={onClick} className="rounded-2xl p-4 flex items-center gap-3 text-left transition-transform hover:-translate-y-0.5" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
      <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ backgroundColor: bg, color: ink }}>
        <Icon size={17} />
      </div>
      <div className="min-w-0">
        <div className="text-[0.82rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{title}</div>
        <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>{sub}</div>
      </div>
    </button>
  );
}

function ListCard({ title, items, empty, action }) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-[0.9rem]" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{title}</h2>
        {action}
      </div>
      <div className="rounded-2xl overflow-hidden" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
        {items.length === 0 ? (
          <div className="p-6 text-center text-xs" style={{ color: "#9AAEB1" }}>{empty}</div>
        ) : (
          items.map((it, i) => (
            <div key={i} className="flex items-center gap-3 px-4 py-3" style={{ borderBottom: i < items.length - 1 ? `1px solid ${C.line}` : "none" }}>
              <img src={it.img} alt="" className="w-9 h-9 rounded-lg object-cover shrink-0" style={{ backgroundColor: C.bg }} />
              <div className="min-w-0 flex-1">
                <div className="text-[0.8rem] truncate" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{it.name}</div>
                <div className="text-[0.68rem]" style={{ color: "#8AA2A6" }}>{it.sub}</div>
              </div>
              {it.badge}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function DashboardView() {
  const router = useRouter();
  const { store, rawProps } = useVendorData();

  const counts = { available: 0, reserved: 0, rented: 0, maintenance: 0, hidden: 0 };
  rawProps.forEach((p) => { counts[p.status || "available"] = (counts[p.status || "available"] || 0) + 1; });

  const recent = rawProps.slice(0, 5).map((p) => ({
    img: p.img, name: p.name, sub: `${p.category} · ${p.material || "—"}`,
    badge: <span className="text-[0.62rem] px-2.5 py-1 rounded-full shrink-0" style={{ ...bg(STATUS_LABEL[p.status || "available"]) }}>{STATUS_LABEL[p.status || "available"]?.label}</span>,
  }));

  const lowStock = rawProps
    .filter((p) => (p.status || "available") === "available" && Number(p.qty) <= 1)
    .slice(0, 5)
    .map((p) => ({ img: p.img, name: p.name, sub: `${p.qty} of ${p.qty} available`, badge: <span className="text-[0.62rem] px-2.5 py-1 rounded-full shrink-0" style={{ backgroundColor: "#fbe6e5", color: "#a3352f" }}>Low stock</span> }));

  function bg(s) { return { backgroundColor: s?.bg, color: s?.ink }; }

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-3 mb-7">
        <div>
          <h1 className="text-xl mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
            Good day, {store?.name}
          </h1>
          <p className="text-sm" style={{ color: "#7C9599" }}>Here&apos;s what&apos;s happening with your inventory today.</p>
        </div>
        <button onClick={() => router.push("/vendor/inventory/new")} className="rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
          <CirclePlus size={14} /> Add new prop
        </button>
      </div>

      <div className="mb-8">
        <h2 className="text-[0.9rem] mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Inventory summary</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
          <MetricCard icon={Boxes} label="Total props" val={rawProps.length} bg="#c9dee2" ink="#013e4f" />
          <MetricCard icon={CircleCheck} label="Available" val={counts.available} bg="#e5f3e8" ink="#2f7a45" />
          <MetricCard icon={Bookmark} label="Reserved" val={counts.reserved} bg="#e3edf5" ink="#2c5f7c" />
          <MetricCard icon={Truck} label="Out on rent" val={counts.rented} bg={C.accent} ink="#8a4a44" />
          <MetricCard icon={Wrench} label="Maintenance" val={counts.maintenance} bg="#fbf0dd" ink="#8a5f1c" />
        </div>
      </div>

      <div className="mb-8">
        <h2 className="text-[0.9rem] mb-3" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Quick actions</h2>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          <QuickAction icon={CirclePlus} title="Add new prop" sub="List a new item" bg="#c9dee2" ink="#013e4f" onClick={() => router.push("/vendor/inventory/new")} />
          <QuickAction icon={Upload} title="Bulk upload" sub="Import via CSV or Excel" bg={C.accent} ink="#8a4a44" onClick={() => router.push("/vendor/bulk")} />
          <QuickAction icon={CalendarCheck} title="Update availability" sub="Change prop status" bg="#e3edf5" ink="#2c5f7c" onClick={() => router.push("/vendor/inventory")} />
          <QuickAction icon={Store} title="Store profile" sub="Edit store details" bg="#fbf0dd" ink="#8a5f1c" onClick={() => router.push("/vendor/store")} />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <ListCard
          title="Recently added props"
          items={recent}
          empty="No props yet — add your first one."
          action={<button onClick={() => router.push("/vendor/inventory")} className="text-xs flex items-center gap-1" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>View inventory <ChevronRight size={13} /></button>}
        />
        <ListCard title="Low stock alerts" items={lowStock} empty="Nothing running low." />
      </div>

      {store && (
        <a
          href={`/stores/${store.id}`}
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-3 rounded-2xl p-4 mt-2"
          style={{ backgroundColor: C.primaryTint, border: `1px solid ${C.line}` }}
        >
          <Package size={18} color={C.primary} />
          <div className="text-xs" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>
            Everything you list here appears live on PropConnect within a minute — <span className="underline">view your store page</span>.
          </div>
        </a>
      )}
    </div>
  );
}
