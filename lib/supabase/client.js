"use client";

import { createBrowserClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

let cached = null;

/**
 * Browser Supabase client (singleton). Returns null when Supabase isn't
 * configured yet, so callers can degrade gracefully instead of crashing.
 */
export function getSupabaseBrowserClient() {
  if (!isSupabaseConfigured) return null;
  if (!cached) cached = createBrowserClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  return cached;
}
