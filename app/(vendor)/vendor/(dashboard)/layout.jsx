"use client";

import { C } from "@/lib/tokens";
import { VendorDataProvider, useVendorData } from "@/components/vendor/VendorDataContext";
import { StoreOnboarding } from "@/components/vendor/StoreOnboarding";
import { VendorSidebar } from "@/components/vendor/VendorSidebar";
import { VendorTopbar } from "@/components/vendor/VendorTopbar";

function Shell({ children }) {
  const { loading, needsOnboarding } = useVendorData();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: C.bg }}>
        <div className="text-sm" style={{ color: "#8AA2A6", fontFamily: "Jost, sans-serif" }}>Loading your store…</div>
      </div>
    );
  }

  if (needsOnboarding) return <StoreOnboarding />;

  return (
    <div className="flex min-h-screen">
      <VendorSidebar />
      <main className="flex-1 min-w-0 flex flex-col">
        <VendorTopbar />
        <div className="p-7 flex-1">{children}</div>
      </main>
    </div>
  );
}

export default function VendorDashboardLayout({ children }) {
  return (
    <VendorDataProvider>
      <Shell>{children}</Shell>
    </VendorDataProvider>
  );
}
