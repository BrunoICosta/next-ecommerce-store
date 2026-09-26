import Link from "next/link";

import { siteConfig } from "@/lib/site";

export function Logo() {
  return (
    <Link
      href="/"
      className="group inline-flex items-center gap-2 rounded-md text-xl font-bold tracking-tight"
      aria-label={`${siteConfig.name} — página inicial`}
    >
      <svg viewBox="0 0 32 32" className="size-8" aria-hidden>
        <rect width={32} height={32} rx={9} className="fill-accent" />
        <path
          d="M9 11h14M9 16h14M9 21h14M11 9v14M16 9v14M21 9v14"
          className="stroke-accent-foreground"
          strokeWidth={1.6}
          strokeLinecap="round"
          opacity={0.9}
        />
      </svg>
      <span>{siteConfig.name.toLowerCase()}</span>
    </Link>
  );
}
