"use client";

import { usePathname, useRouter } from "next/navigation";
import type { MouseEvent } from "react";

import { cn } from "@/lib/cn";
import { switchLocalePath } from "@/lib/routes";
import { BASE_PATH } from "@/lib/site";

import { localeNames, locales, type Locale } from "./config";
import { saveLocale } from "./detect";
import { LocaleFlag } from "./flags";
import { useI18n } from "./i18n-provider";

/**
 * Language picker as flag links: each one points to the same page in the
 * other language (real <a hreflang>, so it works without JavaScript and is
 * crawlable). Clicking saves the choice, which wins over the browser language
 * on the next visit, and keeps the current query string (filters, search).
 */
export function LanguageSwitcher({ className }: { className?: string }) {
  const { locale: current, t } = useI18n();
  const router = useRouter();
  const pathname = usePathname();

  function handleClick(event: MouseEvent<HTMLAnchorElement>, locale: Locale) {
    saveLocale(locale);
    if (locale === current) {
      event.preventDefault();
      return;
    }
    // Let modified clicks (new tab, etc.) behave like normal links.
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    const { search, hash } = window.location;
    router.push(`${switchLocalePath(pathname, locale)}${search}${hash}`, { scroll: false });
  }

  return (
    <div
      role="group"
      aria-label={t.header.language}
      className={cn("flex items-center gap-1", className)}
    >
      {locales.map((locale) => {
        const active = locale === current;
        return (
          <a
            key={locale}
            href={`${BASE_PATH}${switchLocalePath(pathname, locale)}`}
            hrefLang={locale}
            lang={locale}
            aria-label={localeNames[locale]}
            title={localeNames[locale]}
            aria-current={active ? "true" : undefined}
            onClick={(event) => handleClick(event, locale)}
            className={cn(
              "inline-flex size-10 items-center justify-center rounded-full transition",
              active
                ? "ring-2 ring-foreground ring-offset-2 ring-offset-background"
                : "opacity-55 grayscale hover:opacity-100 hover:grayscale-0 focus-visible:opacity-100 focus-visible:grayscale-0",
            )}
          >
            <LocaleFlag locale={locale} />
          </a>
        );
      })}
    </div>
  );
}
