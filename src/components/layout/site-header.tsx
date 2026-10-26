"use client";

import Link from "next/link";

import { CartButton } from "@/features/cart/components/cart-button";
import { WishlistLink } from "@/features/wishlist/components/wishlist-link";
import { useI18n } from "@/i18n/i18n-provider";

import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";
import { getNavLinks } from "./nav-links";
import { SearchForm } from "./search-form";
import { ThemeToggle } from "./theme-toggle";

export function SiteHeader() {
  const { t, routes } = useI18n();
  const navLinks = getNavLinks(routes, t.header.nav);

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
      <div className="bg-foreground px-4 py-2 text-center text-xs font-medium text-background">
        {t.header.announcement} <strong>BEMVINDO10</strong>
        <span className="hidden sm:inline"> {t.header.announcementSuffix}</span>
      </div>
      <div className="relative mx-auto flex h-16 max-w-7xl items-center gap-4 px-4 sm:px-6">
        <MobileMenu />
        <Logo />
        <nav aria-label={t.header.categoriesNav} className="ml-6 hidden md:block">
          <ul className="flex items-center gap-1 text-sm font-medium">
            {navLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-full px-3 py-2 text-muted-foreground transition hover:bg-muted hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="ml-auto flex items-center gap-1">
          <SearchForm className="mr-2 hidden w-56 lg:block xl:w-72" />
          <ThemeToggle />
          <WishlistLink />
          <CartButton />
        </div>
      </div>
    </header>
  );
}
