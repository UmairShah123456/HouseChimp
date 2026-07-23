# HouseChimp

Branded digital guidebooks for short-let & serviced accommodation hosts. Hosts
build a guide per property; guests view it on mobile via a magic link.

**Stack:** Next.js (App Router, TypeScript) · Tailwind CSS v4 · Supabase
(Postgres, Auth, Storage) · deployed on Vercel.

## Design system

Tokens are extracted verbatim from the *Guest Portal Explorations* design file
(warm-editorial direction) and live in [`src/app/globals.css`](src/app/globals.css).

The palette is **hue-driven**: every accent is `oklch(L C var(--h))`, so
overriding `--h` on any subtree recolours the whole tree. That is exactly how
per-account branding works — see `ThemeScope`, fed by `accounts.accent_hue`.
Shape is scaled by `--rs` (Soft = 1) and the pill radius by `--rp`.

Defaults: **Teal (hue 200) · Soft · Outfit**.

## Local setup

Requires Docker (for local Supabase) and Node 20+.

```bash
npm install
supabase start          # boots local Postgres/Auth/Storage (see ports below)
supabase db reset       # applies migrations + seed.sql
cp .env.local.example .env.local   # then paste values from `supabase status`
npm run dev             # http://localhost:3000
```

> This project uses a **non-standard local port range (5442x)** to avoid
> colliding with other Supabase projects. `supabase status` prints the matching
> URL/keys.

### Try it

- Landing: <http://localhost:3000>
- Live guest guide: <http://localhost:3000/g/demo-aspects-court>
- Expired-link state: <http://localhost:3000/g/expired-demo>
- Invalid-link state: <http://localhost:3000/g/anything-else>

## Architecture notes

- **Guest routes bypass auth.** `getGuestGuide(token)` runs with the Supabase
  *service role* (server-only) and resolves purely off the token —
  [`src/lib/guide/queries.ts`](src/lib/guide/queries.ts). The resolver is
  request-memoised via `react/cache` in
  [`src/lib/guide/resolve.ts`](src/lib/guide/resolve.ts).
- **The authenticated dashboard is bound by RLS.** Every table has member-scoped
  policies ([`supabase/migrations/0002_rls_policies.sql`](supabase/migrations/0002_rls_policies.sql));
  the session client is in [`src/lib/supabase/server.ts`](src/lib/supabase/server.ts).
- **Section content is typed JSONB.** The per-`type` shapes are the contract
  shared by guest render and (future) host editor —
  [`src/lib/guide/types.ts`](src/lib/guide/types.ts).

## Host dashboard

Behind Supabase Auth (email/password), gated by `src/middleware.ts`:

- **Onboarding** bootstraps the account (`create_account_with_owner` RPC) + first property.
- **Properties** list/grid with empty state; create & delete.
- **Property overview** — details editor (with hero upload), magic link with a
  client-generated **QR** (downloadable), view count, and per-section status.
- **Seven guide editors** ([`src/components/dashboard/editors`](src/components/dashboard/editors))
  each with a **live phone preview** that renders the exact guest components
  ([`src/components/guest/sections`](src/components/guest/sections)) as you type.
  Edits save to Supabase and appear immediately on the guest link.
- **Media uploads** to Supabase Storage (hero photos, amenity videos, host avatar, logo).
- **Link settings** — regenerate token, expiry date, PIN.
- **Account** — name, logo, accent-hue branding (recolours the whole guest portal).
- **Team / Billing** — stubs.

> **Cloud auth note:** email confirmation is on by default. Either click the
> confirmation email after signup, or disable *Confirm email* in Supabase →
> Authentication for faster local development.

## Status

**Done:** the complete guest portal and the full host dashboard (create account →
property → build all guide sections → share magic link). Build + typecheck green;
RLS host-write chain verified end-to-end against the cloud project.

**Follow-ups:** enforce the link PIN on the guest side (stored but not yet gated),
real team invites, live map tiles, real billing.
