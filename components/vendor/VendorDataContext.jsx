"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";
import {
  fetchMyStore, createMyStore, updateMyStore,
  fetchMyProps, createMyProp, updateMyProp, deleteMyProp,
} from "@/lib/vendor";

const VendorDataContext = createContext(null);

export function VendorDataProvider({ children }) {
  const { user, loading: authLoading } = useAuth();
  const supabase = useMemo(() => getSupabaseBrowserClient(), []);

  const [store, setStore] = useState(null);
  const [rawProps, setRawProps] = useState([]);
  const [loading, setLoading] = useState(true);

  const refreshStore = useCallback(async () => {
    if (!supabase || !user) return null;
    const s = await fetchMyStore(supabase, user.id);
    setStore(s);
    return s;
  }, [supabase, user]);

  const refreshProps = useCallback(
    async (storeId) => {
      const id = storeId || store?.id;
      if (!supabase || !id) { setRawProps([]); return; }
      const rows = await fetchMyProps(supabase, id);
      setRawProps(rows);
    },
    [supabase, store?.id]
  );

  useEffect(() => {
    let active = true;
    if (authLoading) return;
    if (!user) { setLoading(false); return; }
    setLoading(true);
    (async () => {
      const s = await refreshStore();
      if (!active) return;
      if (s) await refreshProps(s.id);
      if (active) setLoading(false);
    })();
    return () => { active = false; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authLoading, user?.id]);

  const setupStore = async (fields) => {
    const id = await createMyStore(supabase, user.id, fields);
    await refreshStore();
    return id;
  };

  const saveStoreProfile = async (fields) => {
    await updateMyStore(supabase, store.id, fields);
    await refreshStore();
  };

  const addProp = async (fields) => {
    const id = await createMyProp(supabase, store.id, fields);
    await refreshProps();
    return id;
  };

  const editProp = async (propId, fields) => {
    await updateMyProp(supabase, propId, fields);
    await refreshProps();
  };

  const removeProp = async (propId) => {
    await deleteMyProp(supabase, propId);
    await refreshProps();
  };

  const value = {
    user,
    store,
    rawProps,
    loading,
    needsOnboarding: !loading && !!user && !store,
    setupStore,
    saveStoreProfile,
    addProp,
    editProp,
    removeProp,
    refreshProps,
  };

  return <VendorDataContext.Provider value={value}>{children}</VendorDataContext.Provider>;
}

export function useVendorData() {
  const ctx = useContext(VendorDataContext);
  if (!ctx) throw new Error("useVendorData must be used within <VendorDataProvider>");
  return ctx;
}
