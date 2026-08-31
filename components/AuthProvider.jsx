"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";

const AuthContext = createContext(null);
const NOT_CONFIGURED = {
  error: { message: "Supabase isn't configured yet. See SUPABASE_SETUP.md." },
};

export function AuthProvider({ children }) {
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }
    let active = true;

    supabase.auth.getSession().then(({ data }) => {
      if (!active) return;
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, [supabase]);

  const value = useMemo(() => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    return {
      user,
      loading,
      configured: isSupabaseConfigured,
      // Google-only. OAuth covers both sign-in and first-time sign-up.
      signInWithGoogle: (next = "/") =>
        supabase
          ? supabase.auth.signInWithOAuth({
              provider: "google",
              options: {
                redirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(next)}`,
              },
            })
          : Promise.resolve(NOT_CONFIGURED),
      signOut: () =>
        supabase ? supabase.auth.signOut() : Promise.resolve({ error: null }),
      // Writes to the Supabase user's user_metadata (no DB table needed).
      updateProfile: (data) =>
        supabase
          ? supabase.auth.updateUser({ data })
          : Promise.resolve(NOT_CONFIGURED),
    };
  }, [supabase, user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within <AuthProvider>");
  return ctx;
}
