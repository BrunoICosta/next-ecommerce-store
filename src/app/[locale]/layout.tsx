import type { Metadata, Viewport } from "next";

import { SiteFooter } from "@/components/layout/site-footer";
import { SiteHeader } from "@/components/layout/site-header";
import { StoreHydration } from "@/components/providers/store-hydration";
import { CartDrawer } from "@/features/cart/components/cart-drawer";
import { ogImage } from "@/features/seo/og-image";
import { ogLocale } from "@/i18n/config";
import { I18nProvider } from "@/i18n/i18n-provider";
import { localeParams, resolveLocale } from "@/i18n/server";
import { fontVariables } from "@/lib/fonts";
import { absoluteUrl, siteConfig } from "@/lib/site";
import { themeInitScript } from "@/lib/theme";

import "../globals.css";

/** One static tree per language: /pt-BR/... and /en/... */
export const dynamicParams = false;

export function generateStaticParams() {
  return localeParams();
}

export async function generateMetadata({ params }: LayoutProps<"/[locale]">): Promise<Metadata> {
  const { locale, t } = await resolveLocale(params);
  const image = absoluteUrl(`/${locale}/og.png`);
  return {
    metadataBase: new URL(`${siteConfig.url}/`),
    title: { default: t.meta.title, template: `%s | ${siteConfig.name}` },
    description: t.meta.description,
    applicationName: siteConfig.name,
    authors: [{ name: siteConfig.author.name, url: siteConfig.author.url }],
    keywords: t.meta.keywords,
    openGraph: {
      type: "website",
      locale: ogLocale[locale],
      alternateLocale: Object.entries(ogLocale)
        .filter(([code]) => code !== locale)
        .map(([, value]) => value),
      siteName: siteConfig.name,
      title: t.meta.title,
      description: t.meta.description,
      images: [ogImage(image, t.meta.title)],
    },
    twitter: {
      card: "summary_large_image",
      title: t.meta.title,
      description: t.meta.description,
      images: [image],
    },
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#faf8f5" },
    { media: "(prefers-color-scheme: dark)", color: "#100f0e" },
  ],
};

/** Root layout of the localized tree: `<html lang>` follows the URL locale. */
export default async function LocaleLayout({ children, params }: LayoutProps<"/[locale]">) {
  const { locale, t } = await resolveLocale(params);

  return (
    <html lang={locale} className={`${fontVariables} h-full antialiased`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeInitScript }} />
      </head>
      <body className="flex min-h-full flex-col font-sans">
        <I18nProvider locale={locale}>
          <a
            href="#conteudo"
            className="sr-only z-50 rounded-md bg-accent px-4 py-2 text-accent-foreground focus:not-sr-only focus:fixed focus:top-3 focus:left-3"
          >
            {t.common.skipToContent}
          </a>
          <SiteHeader />
          <div id="conteudo" className="flex-1">
            {children}
          </div>
          <SiteFooter />
          <CartDrawer />
          <StoreHydration />
        </I18nProvider>
      </body>
    </html>
  );
}
