/* Who may reach the Admin Console. A comma-separated allowlist of email
   addresses — knowing an address grants nothing on its own; the person must
   still hold a live Supabase session for that exact email. Safe to expose to
   the browser (NEXT_PUBLIC_) since it's only used to show/hide the admin link;
   every admin API route re-checks the session server-side. Keep this module
   import-free so it's usable from edge middleware and the browser alike. */
export const ADMIN_EMAILS = (process.env.NEXT_PUBLIC_ADMIN_EMAILS || "")
  .split(",")
  .map((s) => s.trim().toLowerCase())
  .filter(Boolean);

export function isAdminEmail(email) {
  return Boolean(email && ADMIN_EMAILS.includes(String(email).toLowerCase()));
}

export const hasAdminAllowlist = ADMIN_EMAILS.length > 0;
