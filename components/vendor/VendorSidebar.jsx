"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Boxes, CirclePlus, Upload, Network, CalendarCheck,
  Store, BarChart3, Settings, LifeBuoy, LogOut,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

const WORKSPACE = [
  { href: "/vendor", icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/vendor/inventory", icon: Boxes, label: "Inventory" },
  { href: "/vendor/inventory/new", icon: CirclePlus, label: "Add new prop", exact: true },
  { href: "/vendor/bulk", icon: Upload, label: "Bulk upload" },
  { href: "/vendor/categories", icon: Network, label: "Categories" },
  { href: "/vendor/availability", icon: CalendarCheck, label: "Availability" },
];
const STORE_NAV = [
  { href: "/vendor/store", icon: Store, label: "Store profile" },
  { href: "/vendor/reports", icon: BarChart3, label: "Reports" },
  { href: "/vendor/settings", icon: Settings, label: "Settings" },
  { href: "/vendor/support", icon: LifeBuoy, label: "Support" },
];

function NavItem({ href, icon: Icon, label, exact }) {
  const pathname = usePathname();
  const active = exact ? pathname === href : pathname === href || pathname.startsWith(`${href}/`);
  return (
    <Link
      href={href}
      className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.83rem] mb-0.5 transition-colors"
      style={{
        backgroundColor: active ? C.primary : "transparent",
        color: active ? C.white : C.ink,
        fontFamily: "Jost, sans-serif",
      }}
    >
      <Icon size={16} color={active ? C.white : "#8AA2A6"} /> {label}
    </Link>
  );
}

export function VendorSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
    router.push("/vendor/login");
  };

  return (
    <aside
      className="w-[230px] shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ backgroundColor: C.white, borderRight: `1px solid ${C.line}` }}
    >
      <div className="flex items-center gap-2 px-5 pt-6 pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
        <Logo variant="mark" size={26} />
        <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-sm">
          Prop<span style={{ color: C.highlight }}>Connect</span>
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[0.62rem] uppercase tracking-[0.1em] px-3 pb-2 pt-1" style={{ color: "#9AAEB1" }}>Workspace</div>
        {WORKSPACE.map((n) => <NavItem key={n.href} {...n} />)}
        <div className="text-[0.62rem] uppercase tracking-[0.1em] px-3 pb-2 pt-4" style={{ color: "#9AAEB1" }}>Store</div>
        {STORE_NAV.map((n) => <NavItem key={n.href} {...n} />)}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.line}` }}>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.83rem] w-full"
          style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}
        >
          <LogOut size={16} /> Logout
        </button>
      </div>
      <div className="px-5 py-3 text-[0.65rem]" style={{ color: "#9AAEB1", borderTop: `1px solid ${C.line}` }}>
        © PropConnect · Vendor Portal
      </div>
    </aside>
  );
}
