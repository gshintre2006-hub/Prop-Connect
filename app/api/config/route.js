import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Diagnostic only — reports WHICH integration keys the running server can see.
// Returns booleans + env-var NAMES (never values).
export async function GET() {
  const has = (v) => Boolean(v && String(v).trim());
  const e = process.env;

  return NextResponse.json({
    supabase: has(e.NEXT_PUBLIC_SUPABASE_URL) && has(e.NEXT_PUBLIC_SUPABASE_ANON_KEY),
    maps: has(e.NEXT_PUBLIC_GOOGLE_MAPS_KEY) || has(e.NEXT_PUBLIC_GOOGLE_MAP_KEY),
    gemini: has(e.GEMINI_API_KEY),
    anthropic: has(e.ANTHROPIC_API_KEY),
    razorpayKeyId: has(e.NEXT_PUBLIC_RAZORPAY_KEY_ID) || has(e.RAZORPAY_KEY_ID),
    razorpaySecret: has(e.RAZORPAY_KEY_SECRET),
    requireAuth: e.NEXT_PUBLIC_REQUIRE_AUTH !== "false",
    // names only, no values — helps spot typos / wrong prefixes
    relevantEnvNames: Object.keys(e)
      .filter((k) => /GOOGLE|MAPS?_KEY|GEMINI|RAZORPAY|ANTHROPIC|SUPABASE/i.test(k))
      .sort(),
  });
}
