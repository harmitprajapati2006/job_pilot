import { createClient } from "@insforge/sdk";

export const insforge = createClient({
  baseUrl: process.env.NEXT_PUBLIC_INSFORGE_URL!,
  anonKey: process.env.NEXT_PUBLIC_INSFORGE_ANON_KEY!,
  // app/(auth)/callback/page.tsx owns the code exchange so it can sync session
  // cookies. A second, automatic exchange consumes the single-use PKCE verifier.
  auth: { detectOAuthCallback: false },
});
