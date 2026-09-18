"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import posthog from "posthog-js";
import { insforge } from "@/lib/insforge-client";
import { clearSessionCookies } from "@/actions/auth";

export type AuthUser = {
  id: string;
  email?: string;
  name?: string;
  avatar_url?: string;
  profile?: {
    name?: string;
    avatar_url?: string;
  } | null;
};

type AuthContextType = {
  user: AuthUser | null;
  loading: boolean;
  signInWithOAuth: (provider: "google" | "github") => Promise<{ error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function identifyAuthUser(user: AuthUser) {
  if (!isPostHogConfigured) return;

  posthog.identify(user.id, {
    email: user.email,
    name: user.name,
  });
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = useCallback(async () => {
    try {
      const { data, error } = await insforge.auth.getCurrentUser();
      if (error || !data?.user) {
        setUser(null);
      } else {
        const u = data.user;
        const authUser = {
          id: u.id,
          email: u.email,
          name: u.profile?.name,
          avatar_url: u.profile?.avatar_url,
          profile: u.profile,
        };
        setUser(authUser);
        identifyAuthUser(authUser);
      }
    } catch (err) {
      console.error("[AuthProvider] refreshUser error:", err);
      setUser(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let ignore = false;

    insforge.auth
      .getCurrentUser()
      .then(({ data, error }) => {
        if (ignore) return;
        if (error || !data?.user) {
          setUser(null);
        } else {
          const u = data.user;
          const authUser = {
            id: u.id,
            email: u.email,
            name: u.profile?.name,
            avatar_url: u.profile?.avatar_url,
            profile: u.profile,
          };
          setUser(authUser);
          identifyAuthUser(authUser);
        }
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (ignore) return;
        console.error("[AuthProvider] initial fetch error:", err);
        setUser(null);
        setLoading(false);
      });

    return () => {
      ignore = true;
    };
  }, []);

  const signInWithOAuth = async (
    provider: "google" | "github"
  ): Promise<{ error?: string }> => {
    try {
      const redirectUrl = `${window.location.origin}/callback`;
      const additionalParams =
        provider === "google" ? { prompt: "select_account" } : undefined;

      const { error } = await insforge.auth.signInWithOAuth(provider, {
        redirectTo: redirectUrl,
        additionalParams,
      });

      if (error) {
        return { error: error.message || "Failed to initiate sign in" };
      }
      return {};
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error during sign in";
      return { error: message };
    }
  };

  const signOut = async () => {
    const analytics = isPostHogConfigured
      ? {
          distinctId: posthog.get_distinct_id(),
          sessionId: posthog.get_session_id(),
        }
      : undefined;

    if (isPostHogConfigured) posthog.capture("user_logged_out");

    try {
      await insforge.auth.signOut();
      await clearSessionCookies(analytics);
      if (isPostHogConfigured) posthog.reset();
      setUser(null);
      router.push("/");
      router.refresh();
    } catch (err) {
      if (isPostHogConfigured) posthog.captureException(err);
      console.error("[AuthProvider] signOut error:", err);
      await clearSessionCookies(analytics);
      if (isPostHogConfigured) posthog.reset();
      setUser(null);
      router.push("/");
      router.refresh();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        signInWithOAuth,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
