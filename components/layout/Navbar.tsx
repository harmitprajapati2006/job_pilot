"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import posthog from "posthog-js";
import { Logo } from "@/components/ui/Logo";
import { useAuth } from "@/lib/auth-context";
import { LogOut, User as UserIcon } from "lucide-react";


type Props = {
  className?: string;
};

export function Navbar({ className = "" }: Props) {
  const { user, loading, signOut } = useAuth();
  const pathname = usePathname();

  const navLinks = [
    { href: "/dashboard", label: "Dashboard" },
    { href: "/find-jobs", label: "Find Jobs" },
    { href: "/profile", label: "Profile" },
  ];

  return (
    <header className={`w-full bg-surface border-b border-border sticky top-0 z-50 ${className}`}>
      <div className="max-w-[1440px] mx-auto h-16 px-6 lg:px-8 flex items-center justify-between">
        {/* Left: Brand Logo */}
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Center: Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => {
            const isActive = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-sm font-medium transition-colors ${
                  isActive
                    ? "text-accent"
                    : "text-text-secondary hover:text-text-primary"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Right: CTA / Auth Button */}
        <div className="flex items-center gap-3">
          {!loading && user ? (
            <div className="flex items-center gap-3">
              <Link
                href="/profile"
                className="flex items-center gap-2 text-sm font-medium text-text-primary hover:text-accent transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-accent-muted flex items-center justify-center text-accent text-xs font-semibold border border-border">
                  {user.name ? (
                    user.name[0].toUpperCase()
                  ) : (
                    <UserIcon className="w-4 h-4" />
                  )}
                </div>
                <span className="hidden sm:inline max-w-[120px] truncate text-xs font-medium text-text-secondary">
                  {user.name || user.email}
                </span>
              </Link>
              <button
                type="button"
                onClick={() => signOut()}
                title="Sign out"
                className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-surface px-3 py-1.5 text-xs font-medium text-text-secondary hover:text-text-primary hover:bg-surface-secondary transition-colors"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Sign out</span>
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              onClick={() => {
                if (
                  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
                  process.env.NEXT_PUBLIC_POSTHOG_HOST
                ) {
                  posthog.capture("homepage_cta_clicked", {
                    cta_location: "navbar",
                    destination: "/login",
                  });
                }
              }}
              className="inline-flex items-center justify-center rounded-lg bg-text-black text-white px-4 py-2 text-sm font-medium hover:bg-black transition-colors"
            >
              Start for free
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
