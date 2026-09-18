"use client";

import Link from "next/link";
import posthog from "posthog-js";
import { Play } from "lucide-react";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function captureHomepageCta(destination: string) {
  if (!isPostHogConfigured) return;

  posthog.capture("homepage_cta_clicked", {
    cta_location: "bottom",
    destination,
  });
}

export function BottomCta() {
  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-6 my-12 sm:my-16">
      <div className="rounded-[28px] border border-border/80 bg-gradient-to-b from-[#edf1ff]/80 via-[#f8f9ff]/70 to-[#eff3fb]/80 px-6 py-16 sm:py-20 lg:py-24 shadow-sm text-center">
        <h2 className="text-3xl sm:text-4xl lg:text-[46px] font-bold text-text-primary tracking-tight leading-[1.2]">
          Your next job search can feel a <br className="hidden sm:inline" />
          lot less overwhelming
        </h2>
        <p className="mt-4 text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
          Set up your profile, upload your resume, and start finding matches in minutes.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
          <Link
            href="/login"
            onClick={() => captureHomepageCta("/login")}
            className="inline-flex items-center gap-2 rounded-lg bg-text-black text-white px-5 py-2.5 text-sm font-medium hover:bg-black transition-colors shadow-sm"
          >
            Get Started
            <Play className="w-3 h-3 fill-current" />
          </Link>
          <Link
            href="/find-jobs"
            onClick={() => captureHomepageCta("/find-jobs")}
            className="inline-flex items-center rounded-lg bg-surface border border-border text-text-primary px-5 py-2.5 text-sm font-medium hover:bg-surface-secondary transition-colors shadow-sm"
          >
            Find Your First Match
          </Link>
        </div>
      </div>
    </section>
  );
}
