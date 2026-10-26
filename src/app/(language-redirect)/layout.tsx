import type { Metadata } from "next";
import type { ReactNode } from "react";

import { localizedAlternates } from "@/i18n/metadata";
import { fontVariables } from "@/lib/fonts";
import { siteConfig } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

import "../globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(`${siteConfig.url}/`),
  title: siteConfig.name,
  alternates: { ...localizedAlternates("pt-BR", "/"), canonical: undefined },
};

/**
 * Root layout for "/" only. It lives in a route group so the localized tree
 * (app/[locale]) can own `<html lang>` as its own root layout.
 */
export default function LanguageRedirectLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">{children}</body>
    </html>
  );
}
