# RetroScope 🎞️

A cinematic, mood-driven movie discovery experience built on **TanStack Start v1**, **React 19**, **Tailwind v4**, and **Lovable Cloud (Supabase)**. Pick a feeling, get a reel; pick a runtime, get a story; sign in and the app remembers you.

> Demo working model. Trailers play, posters are real, auth is live, complaints and notifications round-trip through Postgres, admin can broadcast to every member, and the projection-room dashboard reads its numbers from your own database.

---

## 1. Quick Start

```bash
bun install
cp .env.example .env       # then fill in your Supabase keys
bun run dev                # http://localhost:8080
```

### Environment Variable Setup

**1. Create your local `.env` file**
Duplicate the `.env.example` file and rename it to `.env`:
```bash
cp .env.example .env
```

**2. Get your Supabase credentials**
To find your required variables:
1. Log into your [Supabase Dashboard](https://supabase.com/dashboard).
2. Select your project and go to **Project Settings** > **API**.
3. Copy the **Project URL** and paste it as `VITE_SUPABASE_URL` and `SUPABASE_URL`.
4. Copy the **anon / public** key and paste it as `VITE_SUPABASE_ANON_KEY`.
5. Copy the **service_role / secret** key and paste it as `SUPABASE_SERVICE_ROLE_KEY`.

| Variable                          | Where it's used                |
| --------------------------------- | ------------------------------ |
| `VITE_SUPABASE_URL`               | Browser Supabase client        |
| `VITE_SUPABASE_ANON_KEY`          | Browser Supabase client        |
| `VITE_SUPABASE_PROJECT_ID`        | Build-time tagging             |
| `SUPABASE_URL`                    | Server functions               |
| `SUPABASE_SERVICE_ROLE_KEY`       | Admin server fns (never bundle)|

**3. Configure Vercel Deployment**
When deploying to Vercel, you must manually add these environment variables to your project:
1. Go to your Vercel Project Dashboard.
2. Navigate to **Settings** > **Environment Variables**.
3. Add all the variables listed above.
4. Trigger a new deployment (or redeploy) for the variables to take effect.

The repo already targets a Lovable Cloud project; to self-host create your own Supabase project, run the migrations under `supabase/migrations/`, and replace the keys above.

### Seed the demo admin

```bash
curl https://YOUR-HOST/api/public/seed-admin
# → { ok: true, email: "admin@retroscope.app", password: "Admin1234!" }
```

Then sign in at `/login` with those credentials and the projection-room sidebar unlocks.

---

## 2. Tech Stack

- **TanStack Start v1** — file-based routing, server functions (`createServerFn`), SSR on Cloudflare Workers
- **React 19** + **Vite 7** + **Bun**
- **Tailwind v4** via native CSS `@import` and design tokens in `src/styles.css` (oklch palette)
- **Framer Motion** for the cinematic micro-animations
- **Recharts** for the admin analytics
- **Lovable Cloud / Supabase** for Postgres, Auth (email + password), and Row-Level Security
- **Zod** for server-fn input validation

---

## 3. Site Map — every route, what it does, how it helps

### Public

| Route | Purpose | Why it matters |
| --- | --- | --- |
| `/` | Cinematic landing: hero projector beam, mood grid, runtime buckets, featured rows. | First impression — the home page sells the *feeling* before showing the catalogue. |
| `/login` | Email + password sign-in (Supabase Auth). | Gate keeper. Redirects back to the page you tried to visit. |
| `/signup` | Create account; profile + `user` role are auto-provisioned by a database trigger. | Zero-friction onboarding; no email confirmation required for the demo. |
| `/forgot-password` | Sends a magic reset link via Supabase. | Self-service recovery, no support ticket. |
| `/reset-password` | Captures the recovery token from the URL and sets a new password. | Required companion to `forgot-password`; without it Supabase auto-logs the user in without resetting. |
| `/search` | Filter movies by mood and runtime bucket. | The "I have N minutes and I feel Y" finder. |
| `/movies/$movieId` | Full movie detail: banner, synopsis, cast, trailer modal, reaction timeline, watchlist toggle. | The destination; everything else funnels here. |
| `/sitemap.xml` | Dynamic sitemap covering every movie. | Search-engine indexing for the public catalogue. |
| `/robots.txt` | Disallows `/admin`, `/login`, password routes. | Keeps the projection booth out of Google. |

### Authenticated (`/_authenticated/*` layout — redirects to `/login` if signed out)

| Route | Purpose | How you'd use it |
| --- | --- | --- |
| `/watchlist` | Three "VHS shelves" of saved movies. | Plan tonight's reel; bookmark a binge. |
| `/history` | Vintage ticket-stub timeline of watched titles. | Look back, rewatch, brag. |
| `/notifications` | Live read of the `notifications` table for the signed-in user. Mark as read. | See admin broadcasts and trial reminders the moment they're sent. |
| `/complaints` | File a support ticket (category + body + optional screenshot) **and** see all your past tickets with admin replies. | Channel feedback straight to the projection desk. |
| `/profile` | Avatar, bio, favourite genres, plan, DNA archetype. | The "you" of RetroScope. |
| `/dna` | Visual "Cinema DNA" summary derived from your viewing history. | Self-discovery, social share. |
| `/subscription` | Plans (Free Reel · RetroScope Gold · Director's Cut), trial countdown. | Upgrade path. |
| `/heatmap/$movieId` | Scene-level reaction heatmap for a specific movie. | Find the "best 90 seconds" of any film. |

### Admin (`/_authenticated/admin/*` — requires `admin` role from `user_roles` table)

| Route | Purpose | How it helps the operator |
| --- | --- | --- |
| `/admin` | Live KPIs (members, open complaints, total plays) and top-watched chart, both pulled from Postgres via the `adminAnalytics` server function. | Single glance at platform health. |
| `/admin/movies` | Catalogue table (title, year, atmosphere, runtime, rating). | Curate the library. |
| `/admin/moods` | Manage the 8 mood archetypes. | Keep recommendations on brand. |
| `/admin/heatmap` | Aggregate reaction heatmaps across the catalogue. | Spot which scenes consistently spike. |
| `/admin/themes` | Tweak the visual identity (palette, grain, projector beam). | Re-skin without redeploying code. |
| `/admin/scheduler` | Plan upcoming "Retro Night" collections. | Drive engagement with timed events. |
| `/admin/complaints` | Inbox of every user complaint with inline reply + resolve actions (`complaints` table, RLS-protected). | Close the support loop without leaving the app. |
| `/admin/broadcast` | Type once, send to every member. Calls the `broadcastNotification` server function which inserts one row per user into `notifications`. | Announce drops, outages, or events instantly. |

### Server endpoints

| Endpoint | What it does |
| --- | --- |
| `GET /api/public/seed-admin` | Idempotently creates `admin@retroscope.app` / `Admin1234!` and grants the `admin` role. Safe to call multiple times. |
| `GET /sitemap.xml` | Dynamic sitemap, `Cache-Control: public, max-age=3600`. |

---

## 4. Feature Deep Dive — what it is, how to use it, why it helps

### 🎭 Mood + Runtime Discovery
- **What** — 8 emotional archetypes (Lonely, Happy, Emotional, Night Vibes, Mind-Blowing, Thriller Rush, Rainy Mood, Comfort Watch) × 4 runtime buckets (20m → Weekend Binge).
- **Use** — pick a mood card on the home page or hit `/search` and tweak both filters.
- **Why** — beats "scroll Netflix for 40 minutes." The mood/runtime combination is the actual decision a user makes; the app makes that decision the primary UI affordance.

### 🎬 Movie Detail + Trailer Modal
- **What** — full-bleed banner, real Wikipedia/Wikimedia poster, cast, synopsis, embedded YouTube trailer.
- **Use** — click any poster anywhere in the app.
- **Why** — recruiter-grade demo: the trailer plays for real, the "Watch full film" CTA opens a stylised lock overlay (no copyright drama).

### 🔥 Reaction Heatmap
- **What** — timeline of emoji peaks (`😮 plot twist`, `😭 emotional spike`, `🔥 iconic scene`, `🤯 mind blown`).
- **Use** — open any movie, scroll to "Reaction Reel."
- **Why** — unique signal you won't find on IMDb; lets users skip to the best 90 seconds.

### 📼 Watchlist (3 VHS shelves)
- **What** — three named shelves (Rainy Sundays · Late Reels · To Rewatch) rendered on a wooden VHS rack.
- **Use** — toggle "Save to shelf" on any movie detail page.
- **Why** — playlists with personality; the visual metaphor makes saving fun instead of utilitarian.

### 🎟️ Ticket-Stub Watch History
- **What** — every watch session becomes a perforated vintage ticket with date, mood, and your rating.
- **Use** — visit `/history`.
- **Why** — turns history into a collectable; doubles as social proof for sharing.

### 🧬 Cinema DNA
- **What** — analyses your history and assigns an archetype (Midnight Thriller Fan, Rainy-Day Romantic, etc.).
- **Use** — `/dna` after watching a few reels.
- **Why** — gives users an identity within the product; great for re-engagement emails.

### 🔔 Live Notifications
- **What** — Postgres-backed feed scoped to the signed-in user via RLS.
- **Use** — bell icon in the nav; mark read with the check button on each card.
- **Why** — real broadcast channel instead of fake placeholder data.

### 📣 Admin Broadcast
- **What** — admin types title + body once; a server function (RLS bypass via service role, role-checked first) inserts one notification per user.
- **Use** — `/admin/broadcast`. Submit. Every signed-in user sees it on their next refresh of `/notifications`.
- **Why** — the platform's PA system. No third-party email tool needed.

### 📬 Complaints Round-Trip
- **What** — users insert into `complaints` (RLS: own rows only). Admins can read **all** rows, write `admin_reply`, and flip `status` to `resolved`. The reply appears under the user's ticket immediately.
- **Use** — user files at `/complaints`; admin reads/replies at `/admin/complaints`.
- **Why** — closed-loop support without leaving the app; demonstrates RLS-by-role in one feature.

### 👑 Subscription & Trial
- **What** — three plans + a 15-day Gold trial computed from `profiles.trial_started_at`.
- **Use** — `/subscription` shows current plan and countdown; `setPlan` mutates `profiles.plan`.
- **Why** — wires the UI to a real database column; ready to swap in Stripe.

### 🎛️ Admin Analytics (live)
- **What** — `adminAnalytics` server fn aggregates `profiles`, `complaints.status='open'`, `watch_history` rows + top-5 movies by play count.
- **Use** — `/admin` overview.
- **Why** — the numbers move when real users do real things. Demo-ready without being demo-fake.

### 🔐 Auth + Roles
- **What** — Supabase email/password auth. A trigger on `auth.users` auto-creates a `profiles` row and grants the default `user` role. Admin role lives in a separate `user_roles` table (never on `profiles`, to avoid privilege-escalation patterns). `has_role(uuid, app_role)` is a `SECURITY DEFINER` function used by every RLS policy.
- **Use** — sign up, get `user` role; grant `admin` via the seed endpoint or `INSERT INTO user_roles`.
- **Why** — production-grade authorisation in one migration file.

### ⚡ Perf
- **Route preloading** — `defaultPreload: "intent"` + 30s stale time so hovering a `<Link>` prefetches the chunk and the loader data; navigation feels instant.
- **Automatic code splitting** — each route is its own bundle thanks to the TanStack Start Vite plugin.
- **Per-route head metadata** — every shareable page sets its own `title`, `description`, `og:*`, canonical, JSON-LD where relevant.

### 🎨 Cinematic UX
- **Projector beam** light cone on the hero
- **Film grain** + **VHS scanline** overlays
- **Dust particles** drifting across dark sections
- **Interval banner** transitions between sections
- **Film-reel progress** indicator

All implemented as composable React components under `src/components/cinematic/`.

---

## 5. Database

Migrations live in `supabase/migrations/` and create:

- `profiles` — 1:1 with `auth.users`, holds username, bio, plan, trial start, DNA type
- `user_roles` — `(user_id, role)` with `app_role` enum (`user` | `admin`); RLS uses `has_role()`
- `complaints` — subject, body, status, admin_reply
- `notifications` — title, body, read flag, per-user rows
- `watchlist` — user_id × movie_id
- `watch_history` — user_id × movie_id + progress
- `handle_new_user()` trigger auto-creates profile + default role on signup

Every user-data table has RLS on by default. Users see only their own rows; admins use server functions (service role + manual `has_role` check) for cross-user reads/writes.

---

## 6. Project Layout

```
src/
  routes/                # File-based routes; index.tsx is /
    _authenticated/      # Layout that gates child routes behind auth
      admin/             # Layout that additionally gates on admin role
    api/public/          # Public HTTP endpoints (e.g. seed-admin)
    sitemap[.]xml.ts     # Dynamic sitemap
  components/
    cinematic/           # Projector beam, grain, VHS overlay…
    movie/               # PosterCard, MovieRow, FakePlayerModal, VintageTicket
    layout/              # TopNav, MobileNav, Footer
    premium/             # LockOverlay for gated content
    ui/                  # shadcn primitives
  data/                  # MOVIES catalogue + MOODS + TIME_BUCKETS
  integrations/supabase/ # Auto-generated clients (browser, server, admin, auth)
  lib/
    admin.functions.ts   # createServerFn: broadcastNotification, adminAnalytics, seedDemoAdmin
    auth.tsx             # AuthProvider + useAuth
  styles.css             # Tailwind v4 tokens (oklch palette)
supabase/
  migrations/            # SQL schema + RLS policies
  config.toml            # Project id
```

---

## 7. Build & Deploy

- **Dev** — `bun run dev`
- **Type-check + build** — `bun run build`
- **Production target** — Cloudflare Workers (via `wrangler.jsonc`); also works on Vercel/Netlify with a Node SSR adapter.
- **Hosting on Lovable** — push to the connected Lovable project and click *Publish*.

---

## 8. Credits

- Posters: Wikipedia / Wikimedia (fair-use editorial thumbnails)
- Trailers: YouTube embeds
- Fonts: Bricolage Grotesque · Special Elite · Inter (Google Fonts)
- Built with [Lovable](https://lovable.dev)

---

## 9. Roadmap (not in this build)

- Stripe billing for the subscription plans
- Real movie streaming via Mux/Cloudflare Stream (currently a stylised lock overlay)
- Push notifications via web push instead of in-app feed only
- Movie catalogue CRUD wired to a `movies` Postgres table (today the catalogue ships in `src/data/movies.ts`)

Enjoy the show. 🍿