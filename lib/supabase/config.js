/* Central place to read the Supabase env vars + know whether they're real. */
export const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
export const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

/**
 * True only when both env vars are set AND they aren't the placeholders from
 * `.env.example`. When false the app still runs — the login screen just shows a
 * "connect Supabase" notice instead of erroring.
 */
export const isSupabaseConfigured =
  Boolean(SUPABASE_URL && SUPABASE_ANON_KEY) &&
  !SUPABASE_URL.includes("your-project-ref") &&
  !SUPABASE_ANON_KEY.includes("your-anon-key");

/**
 * When true, the whole app is gated behind sign-in (visitors bounce to /login).
 * When false (default), the app is fully browsable and sign-in is optional —
 * only /account needs a session. Flip it by setting NEXT_PUBLIC_REQUIRE_AUTH
 * to "true" in Vercel once the login flow is working end to end.
 */
export const REQUIRE_AUTH = process.env.NEXT_PUBLIC_REQUIRE_AUTH === "true";
