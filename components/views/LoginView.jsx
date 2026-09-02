"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle, Mail, Check } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

function humanise(raw) {
  let msg = raw || "Sign-in failed.";
  try { msg = decodeURIComponent(msg); } catch {}
  try { msg = decodeURIComponent(msg); } catch {}
  msg = msg.replace(/\+/g, " ");
  if (/exchange external code/i.test(msg)) {
    return "Google rejected the sign-in (Supabase → Google OAuth client secret is wrong). Use the email option above instead, or fix the secret in the Supabase dashboard.";
  }
  if (/code verifier/i.test(msg)) {
    return "That link has to be opened in the same browser you requested it from. Request a new link and open it here.";
  }
  if (/otp|expired|invalid|token/i.test(msg) && !/exchange/i.test(msg)) {
    return "That sign-in link is expired or already used. Request a fresh one.";
  }
  return msg;
}

export function LoginView({ redirectTo = "/", initialError = "" }) {
  const router = useRouter();
  const { user, loading, configured, signInWithEmail, signInWithGoogle } = useAuth();

  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState("");        // "" | "email" | "google"
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(initialError ? humanise(initialError) : "");

  // Supabase returns OAuth errors in the URL *hash* (#error=...), invisible to the server.
  useEffect(() => {
    if (typeof window === "undefined") return;
    const h = window.location.hash;
    if (h && /error/i.test(h)) {
      const p = new URLSearchParams(h.replace(/^#/, ""));
      setError(humanise(p.get("error_description") || p.get("error") || ""));
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
  }, []);

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
    setBusy("email");
    const { error: authError } = await signInWithEmail(email.trim(), redirectTo);
    setBusy("");
    if (authError) setError(humanise(authError.message));
    else setSent(true);
  };

  const google = async () => {
    setError("");
    setBusy("google");
    const { error: authError } = await signInWithGoogle(redirectTo);
    if (authError) { setError(humanise(authError.message)); setBusy(""); }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-9">
          <Logo variant="full" size={148} />
        </div>

        <div className="rounded-[28px] p-6 sm:p-9" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-xl mb-1">
            Sign in to PropConnect
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B8489" }}>
            We&apos;ll email you a one-tap sign-in link. New accounts are created automatically.
          </p>

          {!configured && (
            <div className="flex items-start gap-2.5 rounded-xl p-3.5 mb-5 text-xs" style={{ backgroundColor: "#FFF4E5", color: "#8A5A00" }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <span>
                Supabase isn&apos;t connected yet. Add your project URL and anon key to
                <code className="mx-1 px-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>.env.local</code>
                — see <strong>SUPABASE_SETUP.md</strong>.
              </span>
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
                <button
                  onClick={() => { setSent(false); setError(""); }}
                  className="text-xs mt-2 underline"
                  style={{ color: "#1F7A52" }}
                >
                  Use a different email
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={sendLink} className="space-y-3">
              <div>
                <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Email address</label>
                <input
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@studio.com"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                  style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
                />
              </div>
              <button
                type="submit"
                disabled={busy !== ""}
                className="w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
                style={{ backgroundColor: C.primary, color: C.white, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
              >
                <Mail size={15} /> {busy === "email" ? "Sending…" : "Email me a sign-in link"}
              </button>
            </form>
          )}

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ backgroundColor: C.line }} />
            <span className="text-[0.7rem]" style={{ color: "#9AAEB1", fontFamily: "Jost, sans-serif" }}>or</span>
            <div className="h-px flex-1" style={{ backgroundColor: C.line }} />
          </div>

          <button
            type="button"
            onClick={google}
            disabled={busy !== ""}
            className="w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
            style={{ border: `1.3px solid ${C.line}`, color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
          >
            <span style={{ fontWeight: 700, color: "#4285F4", fontSize: "1rem" }}>G</span>
            {busy === "google" ? "Redirecting to Google…" : "Continue with Google"}
          </button>

          <p className="text-[0.7rem] mt-4 text-center" style={{ color: "#9AAEB1" }}>
            By continuing you agree to the PropConnect terms of service.
          </p>
        </div>
        <p className="text-center text-[0.7rem] mt-6" style={{ color: "#9DB2B5", fontFamily: "Jost, sans-serif" }}>
          Serving 40+ rental prop stores across Aarey · Film City · Goregaon
        </p>
      </div>
    </div>
  );
}
