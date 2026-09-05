import { createSupabaseServerClient } from "@/lib/supabase/server";
import { isAdminEmail } from "@/lib/adminEmails";

/**
 * Server-side admin gate for /api/admin/* route handlers. Resolves the signed-in
 * user from the request cookies and asserts they're on the admin allowlist.
 * Returns { ok: true, user } or { ok: false, status, error }.
 */
export async function resolveAdmin() {
  const supabase = createSupabaseServerClient();
  if (!supabase) return { ok: false, status: 503, error: "Supabase is not configured." };

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { ok: false, status: 401, error: "Sign in first." };
  if (!isAdminEmail(user.email)) return { ok: false, status: 403, error: "This account isn't an admin." };

  return { ok: true, user };
}
