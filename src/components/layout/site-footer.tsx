"use client";

import Link from "next/link";

import { getCategories } from "@/features/catalog";
import { useI18n } from "@/i18n/i18n-provider";
import { siteConfig } from "@/lib/site";

import { Logo } from "./logo";

export function SiteFooter() {
  const { locale, t, routes } = useI18n();

  return (
    <footer className="mt-24 border-t border-border bg-muted/50">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-4">
        <div className="md:col-span-2">
          <Logo />
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">{t.footer.about}</p>
        </div>
        <nav aria-label={t.footer.categoriesNav}>
          <h2 className="text-sm font-semibold">{t.footer.categories}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            {getCategories(locale).map((category) => (
              <li key={category.slug}>
                <Link href={routes.category(category.slug)} className="hover:text-foreground">
                  {category.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div>
          <h2 className="text-sm font-semibold">{t.footer.service}</h2>
          <ul className="mt-3 space-y-2 text-sm text-muted-foreground">
            <li>{t.footer.freeReturns}</li>
            <li>{t.footer.payments}</li>
            <li>
              <a
                href={siteConfig.repository}
                className="underline-offset-4 hover:text-foreground hover:underline"
              >
                {t.footer.sourceCode}
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="border-t border-border">
        <p className="mx-auto max-w-7xl px-4 py-6 text-xs text-muted-foreground sm:px-6">
          © 2026 {siteConfig.name}. {t.footer.builtBy}{" "}
          <a
            href={siteConfig.author.url}
            className="font-medium underline underline-offset-4 hover:text-foreground"
          >
            {siteConfig.author.name}
          </a>
          .
        </p>
      </div>
    </footer>
  );
}
