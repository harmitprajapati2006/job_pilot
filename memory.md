# Memory — PostHog Initialization (Feature 03)

Last updated: 2026-09-18 09:59 IST

## What was built

- Dependencies installed: `posthog-js` (browser telemetry) and `posthog-node` (server-side tracking).
- `.env.local`: Configured `NEXT_PUBLIC_POSTHOG_KEY`, `NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`, and `NEXT_PUBLIC_POSTHOG_HOST`.
- `lib/posthog-client.ts`: Browser PostHog initialization helper (`initPostHog()`) with error capturing.
- `lib/posthog-server.ts`: Server PostHog factory (`createPostHogServer`, `getPostHogClient`) configured with `flushAt: 1` and `flushInterval: 0` for immediate delivery in serverless functions.
- `components/providers/PostHogProvider.tsx`: Application-wide provider component with automatic `$pageview` route change telemetry wrapped in `<Suspense>`.
- `app/layout.tsx`: Wrapped root layout body in `<PostHogProvider>`.
- `lib/auth-context.tsx`: Wired `posthog.identify()` upon login/session restoration, `user_logged_out` tracking, and `posthog.reset()` on logout.
- `app/(auth)/callback/page.tsx`: Explicit `posthog.identify()` on OAuth code exchange and capture of `oauth_login_completed`.
- `app/(auth)/login/page.tsx`: Capture of `oauth_login_started` tracking provider selection.
- `actions/auth.ts`: Server Action telemetry for `auth_session_synced` and `auth_session_cleared`.
- `components/homepage/Hero.tsx`, `components/homepage/BottomCta.tsx`, `components/layout/Navbar.tsx`: Wired `homepage_cta_clicked` with location and destination metadata.
- `context/progress-tracker.md`: Marked `[x] 03 PostHog Initialization` complete; next is `04 Database Schema`.

## Decisions made

- Dual-configured PostHog keys in `.env.local` to support both project standards (`NEXT_PUBLIC_POSTHOG_KEY`) and wizard conventions (`NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN`).
- Implemented native `PostHogProvider` and `PostHogPageViewTracker` wrapped in `<Suspense>` to prevent App Router de-optimization while capturing route changes.
- Embedded `posthog.identify(userId)` directly in the auth lifecycle (OAuth callback and auth context) ensuring all downstream events are attributed to the authenticated user.

## Problems solved

- Resolved ESM module path discrepancies in `posthog-js/react` by utilizing a clean React 19-compatible provider in `components/providers/PostHogProvider.tsx`.
- Guaranteed immediate server event delivery by enforcing `flushAt: 1` and `flushInterval: 0` in `lib/posthog-server.ts`.

## Current state

- Phase 1 Features 01 (Homepage), 02 (Auth), and 03 (PostHog Initialization) are 100% completed and verified.
- `npm run build` succeeds with 0 TypeScript/Next.js errors.
- `npm run lint` passes with 0 errors and 0 warnings.
- Dev server is running locally on port 3000.

## Next session starts with

- Feature 04: Database Schema (Creating `profiles`, `agent_runs`, `jobs`, and `agent_logs` tables in InsForge PostgreSQL, creating the `resumes` storage bucket, and configuring RLS policies).

## Open questions

- None. Database schema columns, types, and constraints are defined in `context/architecture.md` and `context/build-plan.md`.
