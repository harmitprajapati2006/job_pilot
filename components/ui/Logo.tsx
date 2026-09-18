import Link from "next/link";

type Props = {
  className?: string;
  size?: number;
};

export function Logo({ className = "", size = 32 }: Props) {
  return (
    <Link href="/" className={`inline-flex items-center gap-2.5 ${className}`}>
      <div
        className="flex items-center justify-center rounded-[10px] bg-gradient-to-tr from-[#5E4CFF] via-[#7C5CFC] to-[#9B82FC] shadow-sm flex-shrink-0"
        style={{ width: size, height: size }}
      >
        <svg
          width={size * 0.55}
          height={size * 0.55}
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* 4-quadrant rounded app/bento grid icon */}
          <rect x="3" y="3" width="7" height="7" rx="2" fill="white" />
          <rect x="14" y="3" width="7" height="7" rx="2" fill="white" fillOpacity="0.8" />
          <rect x="3" y="14" width="7" height="7" rx="2" fill="white" fillOpacity="0.8" />
          <rect x="14" y="14" width="7" height="7" rx="2" fill="white" />
        </svg>
      </div>
      <span className="text-[19px] font-bold tracking-tight text-text-primary">
        JobPilot
      </span>
    </Link>
  );
}
