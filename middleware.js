import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { SUPABASE_URL, SUPABASE_ANON_KEY, isSupabaseConfigured, REQUIRE_AUTH } from "@/lib/supabase/config";

// The only routes reachable while signed out. Everything else needs a session.
const PUBLIC = ["/login", "/auth"];
const OAUTH_JUNK = ["code", "state", "error", "error_code", "error_description"];

export async function middleware(request) {
  let response = NextResponse.next({ request });

  // Supabase not wired up yet -> don't gate anything, keep the app usable.
  if (!isSupabaseConfigured) return response;

  const path = request.nextUrl.pathname;

  // Safety net: if an OAuth `code` lands on any route other than the dedicated
  // callback (e.g. Supabase fell back to the Site URL), exchange it here, set
  // the session cookies, and bounce to a clean URL.
  const code = request.nextUrl.searchParams.get("code");
  if (code && path !== "/auth/callback") {
    const clean = request.nextUrl.clone();
    OAUTH_JUNK.forEach((k) => clean.searchParams.delete(k));
    const redirect = NextResponse.redirect(clean);
    const sb = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(list) {
          list.forEach(({ name, value, options }) =>
            redirect.cookies.set(name, value, options)
          );
        },
      },
    });
    await sb.auth.exchangeCodeForSession(code);
    return redirect;
  }

  const supabase = createServerClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  // Refreshes the session cookie if needed.
  const { data: { user } } = await supabase.auth.getUser();

  const isPublic = PUBLIC.some((p) => path === p || path.startsWith(`${p}/`));
  // /account always needs a session; everything else only when REQUIRE_AUTH is on.
  const gated = REQUIRE_AUTH ? !isPublic : path === "/account" || path.startsWith("/account/");

  // Signed out on a gated route -> send to login, remember where they were headed.
  if (!user && gated) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    url.searchParams.set("redirectTo", path);
    return NextResponse.redirect(url);
  }

  // Signed in and sitting on /login -> bounce to their destination (or home).
  if (user && path === "/login") {
    const url = request.nextUrl.clone();
    const rt = request.nextUrl.searchParams.get("redirectTo");
    url.pathname = rt && rt.startsWith("/") ? rt : "/";
    url.search = "";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    // everything except Next internals and static asset files
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
