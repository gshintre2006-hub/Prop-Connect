import { createClient } from "@supabase/supabase-js";
import { SUPABASE_URL } from "./config";

/* Service-role Supabase client — bypasses Row-Level Security, so it is
   SERVER-ONLY and must never be imported into a client component. Used
   exclusively by /api/admin/* routes, each of which verifies the caller is an
   allow-listed admin (see lib/admin.js) before touching this. */
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

export const isServiceRoleConfigured = Boolean(SUPABASE_URL && SERVICE_ROLE_KEY);

let cached = null;

export function getServiceRoleClient() {
  if (!isServiceRoleConfigured) return null;
  if (!cached) {
    cached = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
      auth: { persistSession: false, autoRefreshToken: false },
    });
  }
  return cached;
}
