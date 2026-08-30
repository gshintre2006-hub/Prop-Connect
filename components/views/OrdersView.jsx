"use client";

import { useRouter } from "next/navigation";
import { ClipboardList } from "lucide-react";
import { C } from "@/lib/tokens";
import { JOURNEY_STEPS } from "@/lib/data";
import { JourneyTracker, Pill, Button } from "@/components/ui";
import { useStore } from "@/app/providers";

export function OrdersView() {
  const router = useRouter();
  const { orders } = useStore();

  return (
    <div className="max-w-[900px] mx-auto px-5 sm:px-6 py-10">
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-1">My rentals</h1>
      <p className="text-sm mb-8" style={{ color: "#7C9599" }}>Track every prop from request through return.</p>

      {orders.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <ClipboardList size={28} color="#B7C4C6" className="mx-auto mb-3" />
          <p style={{ color: "#8AA2A6" }} className="text-sm">No rentals yet. Once you check out, they'll appear here with live tracking.</p>
          <Button variant="primary" className="mt-5" onClick={() => router.push("/browse")}>Browse props</Button>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((o) => (
            <div key={o.orderId} className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
              <div className="flex items-center justify-between mb-5">
                <div>
                  <div className="text-sm" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>Order #{o.orderId}</div>
                  <div className="text-[0.72rem]" style={{ color: "#8AA2A6" }}>{o.items.length} item(s) · Placed {o.date}</div>
                </div>
                <Pill tone="muted">{JOURNEY_STEPS[o.statusIndex].label}</Pill>
              </div>
              <JourneyTracker statusIndex={o.statusIndex} />
              <div className="mt-5 pt-5 flex flex-wrap gap-3" style={{ borderTop: `1px dashed ${C.line}` }}>
                {o.items.map((it) => (
                  <div key={it.id} className="flex items-center gap-2 rounded-full pr-3" style={{ backgroundColor: C.bg }}>
                    <img src={it.img} className="w-8 h-8 rounded-full object-cover" alt="" />
                    <span className="text-[0.72rem]" style={{ color: C.ink, fontFamily: "Jost, sans-serif" }}>{it.name}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
