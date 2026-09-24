# Progress Tracker

Update this file after every completed feature. Any AI agent reading this should immediately know what is done, what is in progress, and what is next.

---

## Current Status

**Phase:** Phase 1 — Foundation (Completed)
**Last completed:** 04 Database Schema
**Next:** 05 Profile Page — Full UI

---

## Progress

### Phase 1 — Foundation

- [x] 01 Homepage
- [x] 02 Auth
- [x] 03 PostHog Initialization
- [x] 04 Database Schema

### Phase 2 — Profile Page

- [ ] 05 Profile Page — Full UI
- [ ] 06 Profile Save Logic
- [ ] 07 AI Profile Extraction from Resume
- [ ] 08 Resume PDF Generation from Profile

### Phase 3 — Find Jobs Page

- [ ] 09 Find Jobs Page — Full UI
- [ ] 10 Adzuna Job Discovery
- [ ] 11 Filter + Sort + Pagination

### Phase 4 — Job Details Page

- [ ] 12 Job Details Page — Full UI
- [ ] 13 Company Research Agent

### Phase 5 — Dashboard

- [ ] 14 Dashboard Page — Full UI
- [ ] 15 Stats Bar — Real Data
- [ ] 16 Recent Activity — Real Data
- [ ] 17 Analytics Charts — PostHog Data

---

## Decisions Made During Build

- Configured Tailwind CSS v4 `@theme` token definitions in `app/globals.css` with semantic color palettes, surface scales, borders, radii, and typography tokens matching `context/ui-tokens.md`.
- Switched default layout font in `app/layout.tsx` to `next/font/google` Inter setting `--font-sans`.
- Built Homepage components matching `context/designs/landing-page.png`:
  - `Navbar` with brand logo, links, and "Start for free" button
  - `Hero` with rounded gradient card container, responsive typography, and embedded dashboard preview mockup (`/images/dashboard.png`)
  - `Features` section with "Manage Your Job Search With Ease" (with live styled jobs table) and "Apply With More Confidence, Every Time" (with code terminal preview `agent_log.ts`)
  - `Testimonial` section with quote and Tom Wilson avatar (`/images/tom-wilson.jpg`)
  - `BottomCta` with matching rounded gradient container and action buttons
  - `Footer` with brand logo and navigation links
- Implemented Feature 02 Auth using InsForge:
  - Installed `@insforge/sdk@latest`
  - Created `.env.local` with `NEXT_PUBLIC_INSFORGE_URL` and `NEXT_PUBLIC_INSFORGE_ANON_KEY`
  - Created `lib/insforge-client.ts` (browser client) and `lib/insforge-server.ts` (server client factory)
  - Created `actions/auth.ts` for secure cookie synchronization (`setAuthCookies`, `clearAuthCookies`)
  - Built `AuthProvider` and `useAuth` hook in `lib/auth-context.tsx` with user state and session tracking
  - Built Login page in `app/(auth)/login/page.tsx` with Google and GitHub OAuth buttons
  - Built OAuth Callback handler in `app/(auth)/callback/page.tsx` for PKCE code exchange and cookie persistence
  - Configured Next.js Route Protection in `middleware.ts` guarding `/dashboard`, `/profile`, and `/find-jobs`
  - Enhanced `Navbar.tsx` with dynamic user profile, sign out button, and active route highlights
- Implemented Feature 03 PostHog Initialization:
  - Installed `posthog-js` and `posthog-node` dependencies
  - Configured `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and `NEXT_PUBLIC_POSTHOG_HOST` in `.env.local`
  - Created `lib/posthog-client.ts` for browser initialization and client-side captures
  - Created `lib/posthog-server.ts` with immediate flush configuration (`flushAt: 1`, `flushInterval: 0`)
  - Created `components/providers/PostHogProvider.tsx` with automated `$pageview` telemetry
  - Integrated `posthog.identify()` upon successful authentication and user sync
  - Integrated `posthog.reset()` on user sign out
  - Wired event tracking: `oauth_login_started`, `oauth_login_completed`, `user_logged_out`, `auth_session_synced`, `auth_session_cleared`, and `homepage_cta_clicked` (Hero, Navbar, and BottomCta)
- Implemented Feature 04 Database Schema:
  - Created all 4 core tables in InsForge PostgreSQL: `profiles`, `agent_runs`, `jobs`, `agent_logs` matching `context/architecture.md` specifications.
  - Configured Row Level Security (RLS) on all 4 tables with 16 granular policies scoping access to `auth.uid() = id` (for profiles) and `auth.uid() = user_id` (for agent_runs, jobs, agent_logs).
  - Granted `SELECT`, `INSERT`, `UPDATE`, `DELETE` to `authenticated` and `SELECT` to `anon` for PostgREST compatibility.
  - Implemented `handle_new_user` trigger on `auth.users` to automatically populate new user profiles upon OAuth registration, and backfilled existing user account.
  - Created private `resumes` storage bucket with authenticated access requirement.
  - Created TypeScript database definitions in `types/database.ts` and re-exported via `types/index.ts`.
- Added placeholder routes for `/dashboard` and `/find-jobs`:
  - The Navbar, the homepage CTAs, and the post-login redirect already link to these routes, so without a page each click showed the framework 404.
  - Both pages render the shared `ComingSoon` component (`components/layout/ComingSoon.tsx`) with the Navbar, a card that explains the upcoming feature, a "Set up your profile" CTA, and the Footer.
  - Replace each placeholder with the real page in feature 09 (Find Jobs) and feature 14 (Dashboard).

---

## Notes

- Tailwind CSS v4 is running via `@tailwindcss/postcss` in `postcss.config.mjs` with CSS-first configuration (`@theme` in `globals.css`, no `tailwind.config.ts` required).


