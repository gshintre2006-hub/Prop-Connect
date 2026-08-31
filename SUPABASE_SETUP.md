# Supabase auth setup

Authentication is **Google sign-in only** (OAuth covers both sign-in and
first-time sign-up). It's wired in but dormant until you connect a Supabase
project; until then the app runs and `/login` shows a "not connected" notice.

## 1. Create a project

1. Sign up at <https://supabase.com> and create a new project (free tier is fine).
2. Wait for it to finish provisioning.

## 2. Add your keys

**Project Settings → API**, copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`  (never the `service_role` key)

Paste them into **`.env.local`** (already created, git-ignored), then restart:

```bash
npm run dev
```

## 3. Configure redirect URLs

**Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`
  (add your deployed origin + `/auth/callback` later too)

## 4. Enable Google (required)

**Authentication → Providers → Google** → enable, then:

1. In [Google Cloud Console](https://console.cloud.google.com/) → **APIs & Services → Credentials**, create an **OAuth 2.0 Client ID** (type: Web application).
2. Under **Authorized redirect URIs**, add the callback URL Supabase shows on the
   Google provider page — it looks like
   `https://<your-ref>.supabase.co/auth/v1/callback`.
3. Copy the **Client ID** and **Client secret** into Supabase's Google provider
   form and save.

That's it — the "Continue with Google" button now works. Flow:
`/login` → Google consent → `https://<ref>.supabase.co/auth/v1/callback` →
back to `/auth/callback?redirectTo=…&code=…` → session cookie set → redirected
to wherever the user was headed.

## What's in the codebase

| File | Role |
| --- | --- |
| `lib/supabase/config.js` | reads env vars, `isSupabaseConfigured` flag |
| `lib/supabase/client.js` | browser client (singleton, null when unconfigured) |
| `lib/supabase/server.js` | server client for RSC / route handlers |
| `middleware.js` | refreshes the session cookie; redirects logged-out users away from `/cart`, `/checkout`, `/orders`; bounces logged-in users off `/login` |
| `components/AuthProvider.jsx` | `useAuth()` → `user`, `loading`, `configured`, `signInWithGoogle(next)`, `signOut` |
| `app/auth/callback/route.js` | OAuth code exchange, then redirects to `redirectTo` |
| `components/views/LoginView.jsx` | Google-only sign-in screen |
| `components/TopNav.jsx` | avatar + sign-out menu when authenticated, "Sign in" otherwise |

## Auth behaviour

- The **whole app** is gated: signed-out visitors are sent to `/login` first,
  then to the page they wanted (or home) after signing in.
- `/account` (avatar menu → **Profile**) shows the Google avatar + email and lets
  the user edit name / phone / company. These save to the Supabase user's
  `user_metadata` via `supabase.auth.updateUser` — no extra table required.

## Not done yet (possible next step)

Cart / favourites / orders still live in React state (`app/providers.jsx`) and
reset on reload. Moving them into Supabase tables keyed by `user.id` (with Row
Level Security) is the natural follow-up.
