# PropConnect — Next.js

Mobile-first prop-rental marketplace, converted from the original single-file React
component to a **Next.js 14 App Router** project.

## Prerequisites

Node.js is **not currently installed** on this machine. Install Node 18.18+ or 20+
(<https://nodejs.org>), then:

```bash
npm install
npm run dev
```

Open <http://localhost:3000>.

## One manual step — brand artwork

The original file embedded two base64 PNG data URIs (`LOGO_FULL`, `LOGO_MARK`).
They were too large to copy verbatim. Open **`lib/logos.js`** and paste the exact
`data:image/png;base64,…` strings from your original React file over the two
placeholders. Nothing else needs to change — the app runs with transparent
placeholders until then.

## Project structure

```
app/
  layout.jsx            root: <html>, fonts, <Providers> (global cart/favs/orders state)
  globals.css           Tailwind + Jost web font + scrollbar
  providers.jsx         "use client" context replacing the old <App/> useState blob
  not-found.jsx         404
  login/page.jsx        /login  (no nav chrome)
  (app)/
    layout.jsx          shared TopNav + mobile bottom tab bar, bottom padding
    page.jsx            /            Home
    browse/page.jsx     /browse?q=   Browse + filters (reads ?q= from the search bar)
    props/[id]/page.jsx /props/p1    Prop detail (real route param, not React state)
    stores/page.jsx     /stores      Store directory
    stores/[id]/page.jsx /stores/st1 Store detail
    cart/page.jsx        /cart
    checkout/page.jsx    /checkout
    orders/page.jsx      /orders      Rental journey tracker
    moodboard/page.jsx   /moodboard   Drag-and-drop reference board
components/
  ui.jsx                Logo, Pill, Button, SectionTitle, JourneyTracker, DimensionImage, Footer
  PropCard.jsx
  TopNav.jsx
  views/                one component per screen (the old *View functions)
lib/
  tokens.js             palette (C) + loremflickr img() helper
  data.js               CATEGORIES, STORES, PROPS, JOURNEY_STEPS
  logos.js              brand PNG data URIs  <-- paste real values here
```

## What changed in the conversion

- **Routing**: the `view` state machine became real URLs via the App Router.
  `setView("detail")` + `selectedProp` → `/props/[id]`; likewise for stores.
- **Shared state** (cart, favourites, orders, moodboard images) moved from the
  `<App/>` component into a `Providers` context so it persists across route
  changes. `placeOrder` now lives there too.
- **Search** flows through the URL: the nav search box pushes `/browse?q=…`, and
  the browse page reads it from `searchParams` (keyed remount on change).
- `"use client"` is applied to every interactive component; the thin
  `page.jsx` files and `[id]` routes stay server components.
- Images are still plain `<img>` with the same loremflickr URLs (no `next/image`).
- Jost is still loaded via the Google Fonts `@import` in `globals.css`, matching
  the original. Swapping to `next/font/google` is an optional later optimisation.
- The app now opens at `/` (Home); the sign-in screen is at `/login` and simply
  routes to `/` (there is no real auth in the mock).

## Scripts

| command         | what it does            |
| --------------- | ----------------------- |
| `npm run dev`   | dev server on :3000     |
| `npm run build` | production build        |
| `npm start`     | serve the build         |
