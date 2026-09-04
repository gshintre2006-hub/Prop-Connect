"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import { isSupabaseConfigured } from "@/lib/supabase/config";
import { readAvatar, writeAvatar } from "@/lib/avatar";

/* An old build stored the profile photo as a base64 data URL in user_metadata,
   which rides inside the session JWT / auth cookie and eventually trips
   Vercel's 494 REQUEST_HEADER_TOO_LARGE. Move any such value to this device
   and strip it from the account so the cookie shrinks on the next refresh. */
function debloatAvatar(supabase, u) {
  const v = u?.user_metadata?.avatar_url;
  if (typeof v === "string" && v.startsWith("data:")) {
    try { if (!readAvatar()) writeAvatar(v); } catch {}
    supabase.auth.updateUser({ data: { avatar_url: null } }).catch(() => {});
  }
}

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
      const u = data.session?.user ?? null;
      setUser(u);
      setLoading(false);
      if (u) debloatAvatar(supabase, u);
    });

    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      if (session?.user) debloatAvatar(supabase, session.user);
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
      // Passwordless email link — works with zero extra Supabase config.
      // First-time emails create the account automatically.
      signInWithEmail: (email, next = "/") =>
        supabase
          ? supabase.auth.signInWithOtp({
              email,
              options: {
                shouldCreateUser: true,
                emailRedirectTo: `${origin}/auth/callback?redirectTo=${encodeURIComponent(next)}`,
              },
            })
          : Promise.resolve(NOT_CONFIGURED),
      // OAuth covers both sign-in and first-time sign-up.
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
