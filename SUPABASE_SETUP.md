# Supabase auth setup

Authentication is wired in but dormant until you connect a Supabase project.
Until then the app runs normally and `/login` shows a "not connected" notice.

## 1. Create a project

1. Sign up at <https://supabase.com> and create a new project (free tier is fine).
2. Wait for it to finish provisioning.

## 2. Add your keys

**Project Settings → API**, copy:

- **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
- **anon / public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

Paste them into **`.env.local`** (already created, git-ignored), replacing the
placeholders. Then restart the dev server:

```bash
npm run dev
```

## 3. Configure redirect URLs

**Authentication → URL Configuration**:

- **Site URL**: `http://localhost:3000`
- **Redirect URLs**: add `http://localhost:3000/auth/callback`
  (add your deployed URL + `/auth/callback` later too)

## 4. Email / password

On by default. New sign-ups get a confirmation email; the link lands on
`/auth/callback`, which exchanges the code for a session and redirects home.
To skip confirmation while developing: **Authentication → Providers → Email →**
turn off "Confirm email".

## 5. Google sign-in (optional)

The login screen has a "Continue with Google" button. To make it work:

1. **Authentication → Providers → Google** → enable.
2. Create an OAuth client in Google Cloud Console; set the authorized redirect to
   the callback URL Supabase shows on that page.
3. Paste the client ID + secret into Supabase and save.

## What's in the codebase

| File | Role |
| --- | --- |
| `lib/supabase/config.js` | reads env vars, `isSupabaseConfigured` flag |
| `lib/supabase/client.js` | browser client (singleton, null when unconfigured) |
| `lib/supabase/server.js` | server client for RSC / route handlers |
| `middleware.js` | refreshes the session cookie; redirects logged-out users away from `/cart`, `/checkout`, `/orders`; bounces logged-in users off `/login` |
| `components/AuthProvider.jsx` | `useAuth()` → `user`, `loading`, `signInWithPassword`, `signUp`, `signInWithOAuth`, `signOut` |
| `app/auth/callback/route.js` | OAuth / email-confirm code exchange |
| `components/views/LoginView.jsx` | real sign-in / sign-up form |
| `components/TopNav.jsx` | avatar + sign-out menu when authenticated |

## Not done yet (possible next step)

Cart / favourites / orders still live in React state (`app/providers.jsx`) and
reset on reload. Moving them into Supabase tables keyed by `user.id` (with Row
Level Security) is the natural follow-up now that there's a real user to attach
them to.
