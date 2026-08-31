"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { AlertTriangle } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export function LoginView({ redirectTo = "/", initialError = "" }) {
  const router = useRouter();
  const { user, loading, configured, signInWithGoogle } = useAuth();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);

  // Already signed in? Leave the login screen.
  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [loading, user, redirectTo, router]);

  const google = async () => {
    setError("");
    setBusy(true);
    const { error: authError } = await signInWithGoogle(redirectTo);
    if (authError) {
      setError(authError.message);
      setBusy(false);
    }
    // On success Supabase redirects the browser to Google, so nothing else to do.
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
            Continue with your Google account to search, save and rent props from every partner store. New accounts are created automatically.
          </p>

          {!configured && (
            <div className="flex items-start gap-2.5 rounded-xl p-3.5 mb-5 text-xs" style={{ backgroundColor: "#FFF4E5", color: "#8A5A00" }}>
              <AlertTriangle size={15} className="mt-0.5 shrink-0" />
              <span>
                Supabase isn&apos;t connected yet. Add your project URL and anon key to
                <code className="mx-1 px-1 rounded" style={{ backgroundColor: "rgba(0,0,0,0.06)" }}>.env.local</code>
                and restart the dev server — see <strong>SUPABASE_SETUP.md</strong>.
              </span>
            </div>
          )}

          {error && (
            <div className="rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#F5DCDA", color: C.highlight }}>{error}</div>
          )}

          <button
            type="button"
            onClick={google}
            disabled={busy}
            className="w-full rounded-full py-3.5 text-sm flex items-center justify-center gap-2.5 transition-all disabled:opacity-50"
            style={{ border: `1.3px solid ${C.line}`, color: C.ink, fontFamily: "Jost, sans-serif", fontWeight: 500 }}
          >
            <span style={{ fontWeight: 700, color: "#4285F4", fontSize: "1rem" }}>G</span>
            {busy ? "Redirecting to Google…" : "Continue with Google"}
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
