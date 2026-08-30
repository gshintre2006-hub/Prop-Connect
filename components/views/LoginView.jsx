"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn, UserPlus, AlertTriangle, Mail } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo, Button } from "@/components/ui";
import { useAuth } from "@/components/AuthProvider";

export function LoginView({ redirectTo = "/" }) {
  const router = useRouter();
  const { user, loading, configured, signInWithPassword, signUp, signInWithOAuth } = useAuth();

  const [mode, setMode] = useState("signin"); // "signin" | "signup"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  // Already signed in? Leave the login screen.
  useEffect(() => {
    if (!loading && user) router.replace(redirectTo);
  }, [loading, user, redirectTo, router]);

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email || !password) {
      setError("Enter your email and password.");
      return;
    }
    setBusy(true);
    const fn = mode === "signin" ? signInWithPassword : signUp;
    const { data, error: authError } = await fn(email, password);
    setBusy(false);

    if (authError) {
      setError(authError.message);
      return;
    }
    if (mode === "signup" && !data?.session) {
      setInfo("Check your inbox to confirm your email, then sign in.");
      setMode("signin");
      return;
    }
    router.replace(redirectTo);
    router.refresh();
  };

  const google = async () => {
    setError("");
    const { error: authError } = await signInWithOAuth("google");
    if (authError) setError(authError.message);
    // On success Supabase redirects the browser away, so nothing else to do.
  };

  const isSignup = mode === "signup";

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-9">
          <Logo variant="full" size={148} />
        </div>

        <div className="rounded-[28px] p-6 sm:p-9" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-xl mb-1">
            {isSignup ? "Create your account" : "Welcome back"}
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B8489" }}>
            {isSignup
              ? "Sign up to save props, build moodboards and track rentals."
              : "Sign in to search, save and rent props from every partner store."}
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
          {info && (
            <div className="flex items-center gap-2 rounded-xl p-3 mb-4 text-xs" style={{ backgroundColor: "#DCEEE4", color: "#1F7A52" }}>
              <Mail size={13} className="shrink-0" /> {info}
            </div>
          )}

          <form onSubmit={submit} className="space-y-4">
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
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  autoComplete={isSignup ? "new-password" : "current-password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={isSignup ? "At least 6 characters" : "Your password"}
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-11"
                  style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
                />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={16} color="#9AAEB1" /> : <Eye size={16} color="#9AAEB1" />}
                </button>
              </div>
            </div>

            <Button variant="primary" className="w-full" size="lg" disabled={busy}>
              {isSignup ? <UserPlus size={16} /> : <LogIn size={16} />}
              {busy ? "Please wait…" : isSignup ? "Create account" : "Sign in"}
            </Button>
          </form>

          <div className="flex items-center gap-3 my-5">
            <div className="h-px flex-1" style={{ backgroundColor: C.line }} />
            <span className="text-[0.7rem]" style={{ color: "#9AAEB1", fontFamily: "Jost, sans-serif" }}>or</span>
            <div className="h-px flex-1" style={{ backgroundColor: C.line }} />
          </div>

          <button
            type="button"
            onClick={google}
            className="w-full rounded-full py-3 text-sm flex items-center justify-center gap-2"
            style={{ border: `1.3px solid ${C.line}`, color: C.ink, fontFamily: "Jost, sans-serif" }}
          >
            <span style={{ fontWeight: 700, color: "#4285F4" }}>G</span> Continue with Google
          </button>

          <p className="text-center text-xs mt-5" style={{ color: "#8AA2A6" }}>
            {isSignup ? "Already have an account?" : "New to PropConnect?"}{" "}
            <button
              type="button"
              onClick={() => { setMode(isSignup ? "signin" : "signup"); setError(""); setInfo(""); }}
              style={{ color: C.primary, fontWeight: 600 }}
            >
              {isSignup ? "Sign in" : "Create an account"}
            </button>
          </p>
        </div>
        <p className="text-center text-[0.7rem] mt-6" style={{ color: "#9DB2B5", fontFamily: "Jost, sans-serif" }}>
          Serving 40+ rental prop stores across Aarey · Film City · Goregaon
        </p>
      </div>
    </div>
  );
}
