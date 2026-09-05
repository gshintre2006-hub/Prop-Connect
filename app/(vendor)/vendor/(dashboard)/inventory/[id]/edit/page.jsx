"use client";

import { useRouter } from "next/navigation";
import { C } from "@/lib/tokens";
import { useVendorData } from "@/components/vendor/VendorDataContext";
import { PropForm } from "@/components/vendor/PropForm";

export default function EditPropPage({ params }) {
  const router = useRouter();
  const { rawProps, loading } = useVendorData();
  const prop = rawProps.find((p) => p.id === params.id);

  if (loading) {
    return <div className="text-sm py-16 text-center" style={{ color: "#8AA2A6" }}>Loading…</div>;
  }
  if (!prop) {
    return (
      <div className="text-center py-16">
        <p className="text-sm mb-4" style={{ color: "#8AA2A6" }}>That prop isn&apos;t in your inventory.</p>
        <button onClick={() => router.push("/vendor/inventory")} className="text-xs rounded-full px-4 py-2" style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
          Back to inventory
        </button>
      </div>
    );
  }
  return <PropForm propId={prop.id} initial={prop} />;
}
