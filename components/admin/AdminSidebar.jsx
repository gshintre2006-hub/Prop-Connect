"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard, Store, Boxes, Users, ExternalLink, LogOut, ShieldCheck,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

const NAV = [
  { href: "/admin", icon: LayoutDashboard, label: "Overview", exact: true },
  { href: "/admin/stores", icon: Store, label: "Vendor stores" },
  { href: "/admin/props", icon: Boxes, label: "All props" },
  { href: "/admin/users", icon: Users, label: "Users" },
];

const LINKS = [
  { href: "/", icon: ExternalLink, label: "Open PropConnect" },
  { href: "/vendor", icon: ExternalLink, label: "Open Vendor Portal" },
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

export function AdminSidebar() {
  const router = useRouter();
  const { signOut } = useAuth();

  const logout = async () => {
    await signOut();
    router.push("/login");
  };

  return (
    <aside
      className="w-[230px] shrink-0 h-screen sticky top-0 flex flex-col"
      style={{ backgroundColor: C.white, borderRight: `1px solid ${C.line}` }}
    >
      <div className="flex flex-col gap-1.5 px-5 pt-6 pb-4" style={{ borderBottom: `1px solid ${C.line}` }}>
        <div className="flex items-center gap-2.5">
          <Logo variant="mark" size={34} />
          <span style={{ fontFamily: "Jost, sans-serif", fontWeight: 600 }} className="text-base">
            <span style={{ color: C.primary }}>Prop</span><span style={{ color: C.highlight }}>Connect</span>
          </span>
        </div>
        <span className="text-[0.62rem] uppercase tracking-[0.15em] flex items-center gap-1" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif", fontWeight: 600 }}>
          <ShieldCheck size={11} /> Admin Console
        </span>
      </div>

      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <div className="text-[0.62rem] uppercase tracking-[0.1em] px-3 pb-2 pt-1" style={{ color: "#9AAEB1" }}>Manage</div>
        {NAV.map((n) => <NavItem key={n.href} {...n} />)}
        <div className="text-[0.62rem] uppercase tracking-[0.1em] px-3 pb-2 pt-4" style={{ color: "#9AAEB1" }}>Jump to</div>
        {LINKS.map((n) => (
          <Link
            key={n.href}
            href={n.href}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.83rem] mb-0.5"
            style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}
          >
            <n.icon size={16} color="#8AA2A6" /> {n.label}
          </Link>
        ))}
      </nav>

      <div className="px-3 py-3" style={{ borderTop: `1px solid ${C.line}` }}>
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[0.83rem] w-full"
          style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}
        >
          <LogOut size={16} /> Sign out
        </button>
      </div>
      <div className="px-5 py-3 text-[0.65rem]" style={{ color: "#9AAEB1", borderTop: `1px solid ${C.line}` }}>
        © PropConnect · Admin
      </div>
    </aside>
  );
}
