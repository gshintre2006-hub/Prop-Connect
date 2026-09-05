"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { isAdminEmail } from "@/lib/adminEmails";

const AdminDataContext = createContext(null);

export function AdminDataProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const isAdmin = !authLoading && !!user && isAdminEmail(user.email);

  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const refresh = useCallback(async () => {
    if (!isAdmin) { setLoading(false); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/admin/overview", { cache: "no-store" });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "Couldn't load the console.");
      setOverview(json);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, [isAdmin]);

  useEffect(() => {
    if (authLoading) return;
    refresh();
  }, [authLoading, refresh]);

  const value = {
    user,
    isAdmin,
    authLoading,
    needsSignIn: !authLoading && !user,
    notAdmin: !authLoading && !!user && !isAdmin,
    overview,
    loading,
    error,
    refresh,
  };

  return <AdminDataContext.Provider value={value}>{children}</AdminDataContext.Provider>;
}

export function useAdminData() {
  const ctx = useContext(AdminDataContext);
  if (!ctx) throw new Error("useAdminData must be used within <AdminDataProvider>");
  return ctx;
}
