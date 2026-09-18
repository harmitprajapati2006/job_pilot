"use server";

import { cookies } from "next/headers";
import { setAuthCookies, clearAuthCookies } from "@insforge/sdk/ssr";
import { getPostHogClient } from "@/lib/posthog-server";

type AnalyticsContext = {
  distinctId: string;
  sessionId?: string;
};

export async function syncSessionCookies(tokens: {
  accessToken: string;
  refreshToken?: string | null;
  analytics?: AnalyticsContext;
}): Promise<{ success: boolean; error?: string }> {
  const posthog = getPostHogClient();

  try {
    const cookieStore = await cookies();
    setAuthCookies(cookieStore, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
    if (posthog && tokens.analytics) {
      posthog.capture({
        distinctId: tokens.analytics.distinctId,
        event: "auth_session_synced",
        properties: {
          $session_id: tokens.analytics.sessionId,
          source: "server_action",
        },
      });
      await posthog.flush();
    }
    return { success: true };
  } catch (error) {
    if (posthog && tokens.analytics) {
      posthog.captureException(error, tokens.analytics.distinctId, {
        $session_id: tokens.analytics.sessionId,
      });
      await posthog.flush();
    }
    console.error("[actions/auth] syncSessionCookies error:", error);
    return { success: false, error: "Failed to set session cookies" };
  }
}

export async function clearSessionCookies(
  analytics?: AnalyticsContext,
): Promise<{
  success: boolean;
  error?: string;
}> {
  const posthog = getPostHogClient();

  try {
    const cookieStore = await cookies();
    clearAuthCookies(cookieStore);
    if (posthog && analytics) {
      posthog.capture({
        distinctId: analytics.distinctId,
        event: "auth_session_cleared",
        properties: {
          $session_id: analytics.sessionId,
          source: "server_action",
        },
      });
      await posthog.flush();
    }
    return { success: true };
  } catch (error) {
    if (posthog && analytics) {
      posthog.captureException(error, analytics.distinctId, {
        $session_id: analytics.sessionId,
      });
      await posthog.flush();
    }
    console.error("[actions/auth] clearSessionCookies error:", error);
    return { success: false, error: "Failed to clear session cookies" };
  }
}
