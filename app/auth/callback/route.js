import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * OAuth landing. Supabase redirects here with a `code`; we exchange it for a
 * session and write the auth cookies onto the redirect response so the server,
 * middleware and browser all see the session.
 */
export async function GET(request) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const raw = url.searchParams.get("redirectTo") || "/";
  const dest = raw.startsWith("/") ? raw : "/";

  // On Vercel the internal request is http://<internal-host>; rebuild the public
  // origin from the proxy headers so cookies aren't set on an http:// hop.
  const fwdHost = request.headers.get("x-forwarded-host");
  const fwdProto = request.headers.get("x-forwarded-proto") || url.protocol.replace(":", "");
  const origin = fwdHost ? `${fwdProto}://${fwdHost}` : url.origin;

  if (!code || !isSupabaseConfigured) {
    return NextResponse.redirect(`${origin}${dest}`);
  }

  const response = NextResponse.redirect(`${origin}${dest}`);

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

  return response;
}
