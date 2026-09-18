"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import posthog from "posthog-js";
import { Logo } from "@/components/ui/Logo";
import { insforge } from "@/lib/insforge-client";
import { syncSessionCookies } from "@/actions/auth";
import { Loader2, AlertCircle } from "lucide-react";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;

    async function handleOAuthCallback() {
      const errorParam = searchParams.get("error");
      const errorDescription = searchParams.get("error_description");
      if (errorParam) {
        if (isMounted) {
          setErrorMsg(errorDescription || errorParam || "Authentication was cancelled or failed.");
        }
        return;
      }

      const code = searchParams.get("insforge_code");
      if (!code) {
        // Check if already authenticated
        const { data } = await insforge.auth.getCurrentUser();
        if (data?.user) {
          router.replace("/dashboard");
        } else {
          if (isMounted) {
            setErrorMsg("No authorization code provided in the callback.");
          }
        }
        return;
      }

      try {
        const { data, error } = await insforge.auth.exchangeOAuthCode(code);
        if (error || !data) {
          if (isMounted) {
            setErrorMsg(error?.message || "Failed to exchange authorization code.");
          }
          return;
        }

        if (data.accessToken) {
          await syncSessionCookies({
            accessToken: data.accessToken,
            refreshToken: data.refreshToken ?? null,
            analytics: isPostHogConfigured
              ? {
                  distinctId: posthog.get_distinct_id(),
                  sessionId: posthog.get_session_id(),
                }
              : undefined,
          });
        }

        if (isPostHogConfigured) {
          if (data.user?.id) {
            posthog.identify(data.user.id, {
              email: data.user.email,
              name: data.user.profile?.name,
            });
          }
          posthog.capture("oauth_login_completed", {
            session_persisted: Boolean(data.accessToken),
          });
        }

        // Redirect to dashboard
        router.replace("/dashboard");
        router.refresh();
      } catch (err) {
        if (isPostHogConfigured) posthog.captureException(err);
        console.error("[OAuthCallback] exchange error:", err);
        if (isMounted) {
          setErrorMsg("An unexpected error occurred during authentication.");
        }
      }
    }

    handleOAuthCallback();

    return () => {
      isMounted = false;
    };
  }, [searchParams, router]);

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-sm text-center">
        <div className="flex justify-center mb-6">
          <Logo />
        </div>

        {errorMsg ? (
          <div className="space-y-4">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-error-light/20 text-error mb-1">
              <AlertCircle className="w-6 h-6 text-error" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Authentication Failed
            </h2>
            <p className="text-sm text-text-secondary leading-relaxed">
              {errorMsg}
            </p>
            <div className="pt-2">
              <Link
                href="/login"
                className="inline-flex items-center justify-center w-full rounded-lg bg-accent text-accent-foreground px-4 py-2.5 text-sm font-medium hover:bg-accent-dark transition-colors"
              >
                Back to Login
              </Link>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="flex justify-center my-2">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
            <h2 className="text-lg font-semibold text-text-primary">
              Signing you in...
            </h2>
            <p className="text-sm text-text-secondary">
              Completing secure authentication. You will be redirected shortly.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function CallbackPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
          <div className="w-full max-w-md bg-surface rounded-2xl border border-border p-8 shadow-sm text-center">
            <div className="flex justify-center mb-6">
              <Logo />
            </div>
            <div className="flex justify-center my-2">
              <Loader2 className="w-8 h-8 text-accent animate-spin" />
            </div>
            <p className="text-sm text-text-secondary">Loading...</p>
          </div>
        </div>
      }
    >
      <CallbackContent />
    </Suspense>
  );
}
