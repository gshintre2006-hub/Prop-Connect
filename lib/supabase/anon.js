import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "./config";

let cached = null;

/**
 * Stateless anon-key client for PUBLIC reads (the shared vendor catalog).
 * Works identically in Server Components, Route Handlers and the browser —
 * no cookies, no session — so it's the one client both the consumer app and
 * the vendor portal use to read each other's public data. Returns null when
 * Supabase isn't configured so callers can degrade to "no vendor data".
 */
export function getAnonSupabaseClient() {
  if (!isSupabaseConfigured) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: { persistSession: false },
    });
  }
  return cached;
}
