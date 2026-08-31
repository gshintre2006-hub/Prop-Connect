import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * OAuth / email-confirmation landing. Supabase redirects here with a `code`
 * that we exchange for a session — writing the auth cookies onto the redirect
 * response so the browser AND the server/middleware both see the session.
 */
export async function GET(request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const raw = searchParams.get("redirectTo") || "/";
  const dest = raw.startsWith("/") ? raw : "/";

  const response = NextResponse.redirect(`${origin}${dest}`);

  if (code && isSupabaseConfigured) {
    const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    });

    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      return NextResponse.redirect(
        `${origin}/login?error=${encodeURIComponent(error.message)}`
      );
    }
  }

  return response;
}
