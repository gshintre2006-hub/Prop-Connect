"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, CalendarDays, Wallet, CreditCard, Building2, Banknote, ClipboardList,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { Button } from "@/components/ui";
import { useStore } from "@/app/providers";

const PAYMENT_OPTIONS = [
  { key: "upi", label: "UPI", icon: Wallet, sub: "Google Pay, PhonePe, Paytm" },
  { key: "card", label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay" },
  { key: "netbanking", label: "Net Banking", icon: Building2, sub: "All major banks" },
  { key: "cod", label: "Cash on Delivery", icon: Banknote, sub: "Pay in cash when props are delivered" },
  { key: "invoice", label: "Production House Invoice", icon: ClipboardList, sub: "Bill to studio account, 30-day terms" },
];

export function CheckoutView() {
  const router = useRouter();
  const { cart, placeOrder } = useStore();
  const [billing, setBilling] = useState("perRental");
  const [payment, setPayment] = useState("upi");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deposit = cart.reduce((s, i) => s + i.deposit * i.qty, 0);
  const total = subtotal + deposit + 600;

  const submit = () => {
    placeOrder();
    router.push("/orders");
  };

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-6 py-10">
      <button onClick={() => router.push("/cart")} className="flex items-center gap-1.5 text-sm mb-6" style={{ color: C.primary, fontFamily: "Jost, sans-serif" }}>
        <ArrowLeft size={15} /> Back to cart
      </button>
      <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-2xl mb-7">Checkout</h1>

      <div className="grid lg:grid-cols-[1.3fr,1fr] gap-8">
        <div className="space-y-6">
          <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <h3 className="text-sm mb-4 flex items-center gap-2" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
              <CalendarDays size={15} /> Billing cycle
            </h3>
            <div className="space-y-2.5">
              <label className="flex items-start gap-3 rounded-xl p-3.5 cursor-pointer" style={{ border: `1.3px solid ${billing === "perRental" ? C.primary : C.line}`, backgroundColor: billing === "perRental" ? C.primaryTint : "transparent" }}>
                <input type="radio" checked={billing === "perRental"} onChange={() => setBilling("perRental")} className="mt-1" style={{ accentColor: C.primary }} />
                <div>
                  <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Per-rental payment</div>
                  <div className="text-xs mt-0.5" style={{ color: "#8AA2A6" }}>Pay once for this rental's duration.</div>
                </div>
              </label>
              <label className="flex items-start gap-3 rounded-xl p-3.5 cursor-pointer" style={{ border: `1.3px solid ${billing === "monthly" ? C.primary : C.line}`, backgroundColor: billing === "monthly" ? C.primaryTint : "transparent" }}>
                <input type="radio" checked={billing === "monthly"} onChange={() => setBilling("monthly")} className="mt-1" style={{ accentColor: C.primary }} />
                <div className="flex-1">
                  <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Monthly, project-wise billing</div>
                  <div className="text-xs mt-0.5" style={{ color: "#8AA2A6" }}>Consolidate all props for this production into one monthly invoice, tagged to your project.</div>
                  {billing === "monthly" && (
                    <input placeholder="Project name — e.g. Kohraam S2" className="w-full mt-3 rounded-lg px-3 py-2 text-xs outline-none" style={{ border: `1px solid ${C.line}`, fontFamily: "Jost, sans-serif" }} />
                  )}
                </div>
              </label>
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <h3 className="text-sm mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Payment method</h3>
            <div className="space-y-2.5">
              {PAYMENT_OPTIONS.map((opt) => (
                <label key={opt.key} className="flex items-center gap-3 rounded-xl p-3.5 cursor-pointer" style={{ border: `1.3px solid ${payment === opt.key ? C.primary : C.line}`, backgroundColor: payment === opt.key ? C.primaryTint : "transparent" }}>
                  <input type="radio" checked={payment === opt.key} onChange={() => setPayment(opt.key)} style={{ accentColor: C.primary }} />
                  <opt.icon size={17} color={C.primary} />
                  <div className="flex-1">
                    <div className="text-sm" style={{ color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>{opt.label}</div>
                    <div className="text-[0.72rem]" style={{ color: "#8AA2A6" }}>{opt.sub}</div>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="rounded-2xl p-6" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
            <h3 className="text-sm mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Delivery address</h3>
            <textarea rows={3} defaultValue="Set 4, Studio Compound, Aarey Road, Goregaon East, Mumbai 400065" className="w-full rounded-xl px-3.5 py-3 text-sm outline-none" style={{ border: `1px solid ${C.line}`, fontFamily: "Jost, sans-serif", color: C.ink }} />
          </div>
        </div>

        <div className="rounded-2xl p-6 h-fit" style={{ backgroundColor: C.white, border: `1px solid ${C.line}` }}>
          <h3 className="text-base mb-4" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Order summary</h3>
          {cart.map((i) => (
            <div key={i.id} className="flex justify-between text-xs py-1.5" style={{ color: "#7C9599" }}>
              <span>{i.name} × {i.qty}</span><span>₹{i.price * i.qty}</span>
            </div>
          ))}
          <div className="space-y-2 mt-3 pt-3 text-sm" style={{ borderTop: `1px dashed ${C.line}` }}>
            <div className="flex justify-between"><span style={{ color: "#8AA2A6" }}>Deposit (refundable)</span><span>₹{deposit.toLocaleString("en-IN")}</span></div>
            <div className="flex justify-between"><span style={{ color: "#8AA2A6" }}>Delivery</span><span>₹600</span></div>
          </div>
          <div className="flex justify-between mt-4 pt-4 text-base" style={{ borderTop: `1px dashed ${C.line}` }}>
            <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>Total payable</span>
            <span style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 700 }}>₹{total.toLocaleString("en-IN")}</span>
          </div>
          <Button variant="accent" size="lg" className="w-full mt-6" onClick={submit} disabled={cart.length === 0}>Confirm &amp; pay</Button>
          <p className="text-[0.68rem] text-center mt-3" style={{ color: "#9AAEB1" }}>Deposit is refunded after items are returned in original condition.</p>
        </div>
      </div>
    </div>
  );
}
