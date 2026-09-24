import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export function ComingSoon({ icon: Icon, title, description }: Props) {
  return (
    <div className="min-h-screen flex flex-col bg-background text-text-primary">
      <Navbar />
      <main className="flex-1 w-full max-w-[1440px] mx-auto p-8">
        <div className="bg-surface rounded-2xl border border-border p-6 shadow-sm">
          <div className="flex flex-col items-center text-center py-16">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-accent-muted text-accent mb-4">
              <Icon className="w-6 h-6" />
            </div>
            <h1 className="text-base font-semibold text-text-primary">{title}</h1>
            <p className="mt-2 max-w-md text-sm text-text-muted">{description}</p>
            <Link
              href="/profile"
              className="mt-6 inline-flex items-center justify-center rounded-lg bg-accent text-accent-foreground px-4 py-2 text-sm font-medium hover:bg-accent-dark transition-colors"
            >
              Set up your profile
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
