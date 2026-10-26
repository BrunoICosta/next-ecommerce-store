"use client";

import Link from "next/link";

import { useI18n } from "@/i18n/i18n-provider";

import { siteConfig } from "@/lib/site";

export function Logo() {
  const { t, routes } = useI18n();
  return (
    <Link
      href={routes.home}
      className="group inline-flex items-center gap-2 rounded-md text-xl font-bold tracking-tight"
      aria-label={t.header.homeLink}
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
