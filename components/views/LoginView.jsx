"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LogIn } from "lucide-react";
import { C } from "@/lib/tokens";
import { Logo, Button } from "@/components/ui";

export function LoginView() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const signIn = () => router.push("/");

  return (
    <div className="min-h-screen w-full flex items-center justify-center px-5 py-10" style={{ backgroundColor: C.bg }}>
      <div className="w-full max-w-[440px]">
        <div className="flex flex-col items-center mb-9">
          <Logo variant="full" size={148} />
        </div>

        <div className="rounded-[28px] p-6 sm:p-9" style={{ backgroundColor: C.white, border: `1px solid ${C.line}`, boxShadow: "0 20px 50px -25px rgba(0,60,75,0.25)" }}>
          <h1 style={{ color: C.primary, fontFamily: "Jost, sans-serif", fontWeight: 500 }} className="text-xl mb-1">
            Welcome back
          </h1>
          <p className="text-sm mb-6" style={{ color: "#6B8489" }}>Sign in to search, save and rent props from every partner store.</p>

          <div className="space-y-4">
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Email address</label>
              <input
                defaultValue="art.director@studio.com"
                className="w-full rounded-xl px-4 py-3 text-sm outline-none"
                style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
              />
            </div>
            <div>
              <label className="text-xs mb-1.5 block" style={{ color: "#6B8489", fontFamily: "Jost, sans-serif" }}>Password</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  defaultValue="password"
                  className="w-full rounded-xl px-4 py-3 text-sm outline-none pr-11"
                  style={{ border: `1.3px solid ${C.line}`, backgroundColor: C.bg, fontFamily: "Jost, sans-serif", color: C.ink }}
                />
                <button onClick={() => setShowPw(!showPw)} className="absolute right-3.5 top-1/2 -translate-y-1/2">
                  {showPw ? <EyeOff size={16} color="#9AAEB1" /> : <Eye size={16} color="#9AAEB1" />}
                </button>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-between mt-4 mb-6">
            <label className="flex items-center gap-2 text-xs" style={{ color: "#6B8489" }}>
              <input type="checkbox" defaultChecked style={{ accentColor: C.primary }} />
              Keep me signed in
            </label>
            <button className="text-xs" style={{ color: C.highlight, fontFamily: "Jost, sans-serif" }}>Forgot password?</button>
          </div>

          <Button variant="primary" className="w-full" size="lg" onClick={signIn}>
            <LogIn size={16} /> Sign in
          </Button>

          <p className="text-center text-xs mt-5" style={{ color: "#8AA2A6" }}>
            New to PropConnect? <button onClick={signIn} style={{ color: C.primary, fontWeight: 600 }}>Create an account</button>
          </p>
        </div>
        <p className="text-center text-[0.7rem] mt-6" style={{ color: "#9DB2B5", fontFamily: "Jost, sans-serif" }}>
          Serving 40+ rental prop stores across Aarey · Film City · Goregaon
        </p>
      </div>
    </div>
  );
}
