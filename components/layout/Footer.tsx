import Link from "next/link";
import { Logo } from "@/components/ui/Logo";

type Props = {
  className?: string;
};

export function Footer({ className = "" }: Props) {
  return (
    <footer className={`w-full bg-surface border-t border-border mt-auto ${className}`}>
      <div className="max-w-[1440px] mx-auto px-6 lg:px-8 py-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center">
          <Logo />
        </div>
        <div className="flex flex-wrap items-center gap-6 text-sm text-text-secondary">
          <Link
            href="/dashboard"
            className="hover:text-text-primary transition-colors"
          >
            Dashboard
          </Link>
          <Link
            href="#privacy"
            className="hover:text-text-primary transition-colors"
          >
            Privacy Policy
          </Link>
          <Link
            href="#terms"
            className="hover:text-text-primary transition-colors"
          >
            Terms & Condition
          </Link>
        </div>
      </div>
    </footer>
  );
}
