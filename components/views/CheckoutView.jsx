"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Script from "next/script";
import {
  ArrowLeft, CalendarDays, Wallet, CreditCard, Building2, Banknote, ClipboardList, ShieldCheck,
} from "lucide-react";
import { C } from "@/lib/tokens";
import { Button } from "@/components/ui";
import { isRazorpayConfigured, isTestMode, waitForRazorpay } from "@/lib/razorpay";
import { useStore } from "@/app/providers";
import { useAuth } from "@/components/AuthProvider";

const PAYMENT_OPTIONS = [
  { key: "upi", label: "UPI", icon: Wallet, sub: "Google Pay, PhonePe, Paytm", online: true },
  { key: "card", label: "Credit / Debit Card", icon: CreditCard, sub: "Visa, Mastercard, RuPay", online: true },
  { key: "netbanking", label: "Net Banking", icon: Building2, sub: "All major banks", online: true },
  { key: "cod", label: "Cash on Delivery", icon: Banknote, sub: "Pay in cash when props are delivered", online: false },
  { key: "invoice", label: "Production House Invoice", icon: ClipboardList, sub: "Bill to studio account, 30-day terms", online: false },
];

export function CheckoutView() {
  const router = useRouter();
  const { cart, placeOrder } = useStore();
  const { user } = useAuth();

  const [billing, setBilling] = useState("perRental");
  const [payment, setPayment] = useState("upi");
  const [paying, setPaying] = useState(false);
  const [payErr, setPayErr] = useState("");

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const deposit = cart.reduce((s, i) => s + i.deposit * i.qty, 0);
  const total = subtotal + deposit + 600;
  const online = PAYMENT_OPTIONS.find((o) => o.key === payment)?.online;

  const finish = (meta) => {
    placeOrder({ method: payment, billing, ...meta });
    router.push("/orders");
  };

  const submit = async () => {
    setPayErr("");
    if (cart.length === 0) return;

    // COD / invoice — no gateway
    if (!online) {
      finish({ paymentStatus: payment === "cod" ? "cod" : "invoiced" });
      return;
    }

    // Online but Razorpay isn't wired up — complete in demo mode
    if (!isRazorpayConfigured) {
      finish({ paymentStatus: "demo" });
      return;
    }

    setPaying(true);
    try {
      const res = await fetch("/api/razorpay/order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount: total, notes: { billing, items: String(cart.length) } }),
      });
      if (res.status === 501) { finish({ paymentStatus: "demo" }); return; }
      const order = await res.json();
      if (!res.ok) throw new Error(order.error || "Couldn't start the payment.");

      const Razorpay = await waitForRazorpay();
      if (!Razorpay) throw new Error("Payment window failed to load. Check your connection and retry.");

      const rzp = new Razorpay({
        key: order.keyId,
        order_id: order.id,
        amount: order.amount,
        currency: order.currency,
        name: "PropConnect",
        description: `${cart.length} prop rental${cart.length === 1 ? "" : "s"}`,
        prefill: {
          name: user?.user_metadata?.full_name || user?.user_metadata?.name || "",
          email: user?.email || "",
          contact: user?.user_metadata?.phone || "",
        },
        theme: { color: C.primary },
        handler: async (resp) => {
          try {
            const v = await fetch("/api/razorpay/verify", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(resp),
            });
            const vd = await v.json();
            if (v.ok && vd.ok) {
              finish({ paymentStatus: "paid", paymentId: resp.razorpay_payment_id });
            } else {
              setPayErr("We couldn't verify that payment. If you were charged, it auto-refunds in 5–7 days.");
            }
          } catch {
            setPayErr("Payment verification failed. Please contact support with your payment id.");
          } finally {
            setPaying(false);
          }
        },
        modal: { ondismiss: () => setPaying(false) },
      });
      rzp.on("payment.failed", (r) => {
        setPaying(false);
        setPayErr(r?.error?.description || "The payment failed. Try another method.");
      });
      rzp.open();
    } catch (e) {
      setPaying(false);
      setPayErr(e.message || "Something went wrong starting the payment.");
    }
  };

  const payLabel = paying
    ? "Opening payment…"
    : !online
      ? `Place order${payment === "cod" ? " (COD)" : " (Invoice)"}`
      : `Pay ₹${total.toLocaleString("en-IN")}`;

  return (
    <div className="max-w-[1000px] mx-auto px-5 sm:px-6 py-10">
      {isRazorpayConfigured && (
        <Script src="https://checkout.razorpay.com/v1/checkout.js" strategy="afterInteractive" />
      )}

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
            <h3 className="text-sm mb-4 flex items-center justify-between" style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }}>
              <span>Payment method</span>
              {isRazorpayConfigured && (
                <span className="text-[0.62rem] flex items-center gap-1" style={{ color: "#1F7A52", fontFamily: "Jost, sans-serif" }}>
                  <ShieldCheck size={11} /> Razorpay{isTestMode ? " · test mode" : ""}
                </span>
              )}
            </h3>
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
            {online && !isRazorpayConfigured && (
              <p className="text-[0.68rem] mt-3" style={{ color: "#9AAEB1" }}>
                Payment gateway isn&apos;t connected — the order will be placed in demo mode without a real charge.
              </p>
            )}
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

          {payErr && (
            <div className="rounded-xl p-3 mt-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{payErr}</div>
          )}

          <Button variant="accent" size="lg" className="w-full mt-5" onClick={submit} disabled={cart.length === 0 || paying}>
            {payLabel}
          </Button>
          <p className="text-[0.68rem] text-center mt-3" style={{ color: "#9AAEB1" }}>Deposit is refunded after items are returned in original condition.</p>
        </div>
      </div>
    </div>
  );
}
