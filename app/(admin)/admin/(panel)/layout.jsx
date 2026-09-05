"use client";

import Link from "next/link";
import { ShieldAlert, LogIn } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { AdminDataProvider, useAdminData } from "@/components/admin/AdminDataContext";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminTopbar } from "@/components/admin/AdminTopbar";

function Centered({ children }) {
  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[400px] text-center">
        <div className="flex justify-center mb-6"><Logo variant="full" size={130} /></div>
        <div className="rounded-[24px] p-7" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          {children}
        </div>
      </div>
    </div>
  );
}

function Shell({ children }) {
  const { authLoading, needsSignIn, notAdmin } = useAdminData();

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <div className="text-sm" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>Checking access…</div>
      </div>
    );
  }

  if (needsSignIn) {
    return (
      <Centered>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: C.primaryTint }}>
          <LogIn size={20} color={C.primary} />
        </div>
        <h1 className="text-lg mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Admin sign in</h1>
        <p className="text-sm mb-5" style={{ color: "#6B8489" }}>Sign in with an owner account to open the console.</p>
        <Link href="/login?redirectTo=/admin" className="inline-block rounded-full px-5 py-3 text-sm" style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
          Go to sign in
        </Link>
      </Centered>
    );
  }

  if (notAdmin) {
    return (
      <Centered>
        <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4 mx-auto" style={{ backgroundColor: "#F5DCDA" }}>
          <ShieldAlert size={20} color={C.highlight} />
        </div>
        <h1 className="text-lg mb-1" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>No access</h1>
        <p className="text-sm mb-5" style={{ color: "#6B8489" }}>
          This account isn&apos;t on the admin allowlist. Ask the owner to add your email to <code className="px-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>NEXT_PUBLIC_ADMIN_EMAILS</code>.
        </p>
        <Link href="/" className="inline-block rounded-full px-5 py-3 text-sm" style={{ border: `1px solid ${C.line}`, color: C.primary, fontFamily: "Jost, sans-serif" }}>
          Back to PropConnect
        </Link>
      </Centered>
    );
  }

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <AdminTopbar />
        <div className="p-7 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default function AdminPanelLayout({ children }) {
  return (
    <AdminDataProvider>
      <Shell>{children}</Shell>
    </AdminDataProvider>
  );
}
