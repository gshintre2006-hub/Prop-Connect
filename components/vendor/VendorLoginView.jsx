"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mail, Check, Store } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

function humanise(raw) {
  let msg = raw || "Sign-in failed.";
  try { msg = decodeURIComponent(msg); } catch {}
  msg = msg.replace(/\+/g, " ");
  if (/otp|expired|invalid|token/i.test(msg)) return "That sign-in link is expired or already used. Request a fresh one.";
  return msg;
}

export function VendorLoginView({ redirectTo = "/vendor", initialError = "" }) {
  const router = useRouter();
  const { user, loading, configured, signInWithEmail } = useAuth();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(initialError ? humanise(initialError) : "");

  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [loading, user, redirectTo, router]);

  const sendLink = async (e) => {
    e.preventDefault();
    setError("");
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    setBusy(true);
    const { error: authError } = await signInWithEmail(email.trim(), redirectTo);
    setBusy(false);
    if (authError) setError(humanise(authError.message));
    else setSent(true);
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[400px]">
        <div className="flex flex-col items-center mb-7">
          <Logo variant="full" size={148} />
          <span
            className="mt-3 text-[0.68rem] uppercase tracking-[0.18em] px-3 py-1 rounded-full"
            style={{ backgroundColor: C.primaryTint, color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 600 }}
          >
            Vendor Portal
          </span>
        </div>

        <div className="rounded-[28px] p-6 sm:p-9" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          <div className="w-11 h-11 rounded-2xl flex items-center justify-center mb-4" style={{ backgroundColor: C.primaryTint }}>
            <Store size={20} color={C.primary} />
          </div>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-xl mb-1">
            Sign in to your store
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B8489" }}>
            Manage inventory for your registered PropConnect store. We&apos;ll email you a one-tap sign-in link — first time here creates your vendor account automatically.
          </p>

          {!configured && (
            <div className="flex items-start gap-2.5 rounded-xl p-3.5 mb-5 text-xs" style={{ backgroundColor: "#FFF4E5", color: "#8A5A00" }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <span>Supabase isn&apos;t connected yet — the vendor portal needs it to store your inventory.</span>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>
          )}

          {sent ? (
            <div className="rounded-xl p-4 text-sm flex items-start gap-2.5" style={{ backgroundColor: "#DCEEE4", color: "#1F7A52" }}>
              <Check size={16} className="mt-0.5 shrink-0" />
              <div>
                <div style={{ fontWeight: 600 }}>Check your inbox</div>
                <div className="text-xs mt-1">
                  We sent a sign-in link to <strong>{email}</strong>. Open it in this browser to finish signing in.
                </div>
                <button onClick={() => { setSent(false); setError(""); }} className="text-xs mt-2 underline" style={{ color: "#1F7A52" }}>
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={sendLink} className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Store email</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="hello@yourstudioprops.com"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
                />
              </div>
              <button
                type="submit"
                disabled={busy}
                className="w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
              >
                <Mail size={15} /> {busy ? "Sending…" : "Email me a sign-in link"}
              </button>
            </form>
          )}

          <p className="text-[0.7rem] mt-5 text-center" style={{ color: "#9AAEB1" }}>
            Every vendor sees only their own inventory. Find. Connect. Create.
          </p>
        </div>
        <p className="text-center text-[0.7rem] mt-6" style={{ color: "#9DB2B5", fontFamily: "Jost, sans-serif" }}>
          Renting props instead? <a href="/" className="underline" style={{ color: C.primary }}>Go to PropConnect</a>
        </p>
      </div>
    </div>
  );
}
