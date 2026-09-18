"use client";

import Image from "next/image";
import Link from "next/link";
import posthog from "posthog-js";
import { Lock, Play } from "lucide-react";

const isPostHogConfigured = Boolean(
  process.env.NEXT_PUBLIC_POSTHOG_PROJECT_TOKEN &&
    process.env.NEXT_PUBLIC_POSTHOG_HOST,
);

function captureHomepageCta(destination: string) {
  if (!isPostHogConfigured) return;

  posthog.capture("homepage_cta_clicked", {
    cta_location: "hero",
    destination,
  });
}

export function Hero() {
  return (
    <section className="max-w-[1380px] mx-auto px-4 sm:px-6 pt-4 sm:pt-6">
      <div className="rounded-[28px] border border-border/80 bg-gradient-to-b from-[#edf1ff]/80 via-[#f8f9ff]/70 to-[#eff3fb]/80 px-6 py-14 sm:py-20 lg:py-24 shadow-sm relative overflow-hidden text-center">
        {/* Hero Copy */}
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl sm:text-5xl lg:text-[54px] font-bold text-text-primary tracking-tight leading-[1.14]">
            Job hunting is hard. <br />
            Your tools shouldn&apos;t be.
          </h1>
          <p className="mt-5 text-base sm:text-lg text-text-secondary max-w-xl mx-auto leading-relaxed">
            Stop applying blind. JobPilot finds the jobs, researches the companies,
            and gives you everything you need to stand out.
          </p>

          {/* CTA Buttons */}
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

        {/* Dashboard Preview Browser Mockup */}
        <div className="mt-12 sm:mt-16 max-w-4xl mx-auto rounded-2xl border border-border bg-surface shadow-2xl overflow-hidden text-left">
          {/* Browser Address Bar */}
          <div className="h-10 px-4 border-b border-border bg-surface flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              <span className="w-2.5 h-2.5 rounded-full bg-border-muted" />
              <span className="w-2.5 h-2.5 rounded-full bg-border-muted" />
              <span className="w-2.5 h-2.5 rounded-full bg-border-muted" />
            </div>

            <div className="flex items-center justify-center gap-1.5 px-4 py-0.5 rounded-full bg-surface-secondary text-xs text-text-secondary border border-border-light font-mono">
              <Lock className="w-3 h-3 text-text-muted" />
              <span>jobpilot.ai/dashboard</span>
            </div>

            <div className="w-12" />
          </div>

          {/* Browser Content */}
          <div className="relative bg-surface max-h-[460px] sm:max-h-[520px] overflow-hidden">
            <Image
              src="/images/dashboard.png"
              alt="JobPilot Dashboard Preview"
              width={1400}
              height={900}
              className="w-full h-auto object-cover object-top"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
