import posthog from "posthog-js";

export function initPostHog() {
  if (typeof window !== "undefined") {
    const key =
      process.env.NEXT_PUBLIC_POSTHOG_KEY ||
      process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN;
    const host =
      process.env.NEXT_PUBLIC_POSTHOG_HOST || "https://us.i.posthog.com";

    if (key && !posthog.__loaded) {
      posthog.init(key, {
        api_host: host,
        capture_pageview: false,
        capture_exceptions: true,
      });
    }
  }
}

export { posthog };
