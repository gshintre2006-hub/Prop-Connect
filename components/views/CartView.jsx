"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingCart, X, Minus, Plus, FileDown } from "lucide-react";
import { C } from "@/lib/tokens";
import { storeById } from "@/lib/data";
import { Button } from "@/components/ui";
import { exportCartPdf } from "@/lib/cartPdf";
import { useStore } from "@/app/providers";

export function CartView() {
  const router = useRouter();
  const { cart, updateQty, removeItem } = useStore();
  const [pdfBusy, setPdfBusy] = useState(false);
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deposit = cart.reduce((s, i) => s + i.deposit * i.qty, 0);

  const sharePdf = () => {
    setPdfBusy(true);
    try { exportCartPdf({ cart }); } finally { setPdfBusy(false); }
  };

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-6 py-10">
      <div className="flex items-center justify-between mb-7">
        <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl">Your cart</h1>
        {cart.length > 0 && (
          <button
            onClick={sharePdf}
            disabled={pdfBusy}
            className="rounded-full px-4 py-2.5 text-xs flex items-center gap-1.5 disabled:opacity-40"
            style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
          >
            <FileDown size={14} /> {pdfBusy ? "Building…" : "Share list as PDF"}
          </button>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="text-center py-20 rounded-2xl" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <ShoppingCart size={28} color="#B7C4C6" className="mx-auto mb-3" />
          <p style={{ color: "#8AA2A6" }} className="text-sm">Your cart is empty. Browse props to get started.</p>
          <Button variant="primary" className="mt-5" onClick={() => router.push("/browse")}>Browse props</Button>
        </div>
      ) : (
        <div className="grid lg:grid-cols-[1.4fr,1fr] gap-8">
          <div className="space-y-3">
            {cart.map((item) => (
              <div key={item.id} className="flex gap-4 rounded-2xl p-4" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
                <img src={item.img} className="w-20 h-20 rounded-xl object-cover" alt="" />
                <div className="flex-1">
                  <div className="flex justify-between">
                    <h3 className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{item.name}</h3>
                    <button onClick={() => removeItem(item.id)}><X size={15} color="#B7C4C6" /></button>
                  </div>
                  <p className="text-[0.72rem] mt-0.5" style={{ color: "#8AA2A6" }}>{storeById(item.storeId).name} · ₹{item.price}/day</p>
                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-3 rounded-full px-2 py-1" style={{ backgroundColor: C.primaryTint }}>
                      <button onClick={() => updateQty(item.id, -1)}><Minus size={13} color={C.primary} /></button>
                      <span className="text-xs w-4 text-center" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>{item.qty}</span>
                      <button onClick={() => updateQty(item.id, 1)}><Plus size={13} color={C.primary} /></button>
                    </div>
                    <span className="text-sm" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}>₹{item.price * item.qty}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-2xl p-6 h-fit" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <h3 className="text-base mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Order summary</h3>
            <div className="space-y-2.5 text-sm">
              <div className="flex justify-between"><span style={{ color: "#8AA2A6" }}>Rental subtotal / day</span><span style={{ color: C.ink }}>₹{subtotal.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span style={{ color: "#8AA2A6" }}>Refundable deposit</span><span style={{ color: C.ink }}>₹{deposit.toLocaleString("en-IN")}</span></div>
              <div className="flex justify-between"><span style={{ color: "#8AA2A6" }}>Delivery &amp; handling</span><span style={{ color: C.ink }}>₹600</span></div>
            </div>
            <div className="flex justify-between mt-4 pt-4 text-base" style={{ borderTop: `1px dashed ${C.line}` }}>
              <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Estimated total</span>
              <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 700 }}>₹{(subtotal + deposit + 600).toLocaleString("en-IN")}</span>
            </div>
            <Button variant="primary" size="lg" className="w-full mt-6" onClick={() => router.push("/checkout")}>Proceed to checkout</Button>
          </div>
        </div>
      )}
    </div>
  );
}
