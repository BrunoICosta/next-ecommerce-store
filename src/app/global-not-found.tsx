import type { Metadata } from "next";

import { locales } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { fontVariables } from "@/lib/fonts";
import { BASE_PATH } from "@/lib/site";

import "./globals.css";

export const metadata: Metadata = {
  title: "404 | Trama",
  robots: { index: false },
};

/**
 * Exported as out/404.html, which GitHub Pages serves for any unknown URL.
 * It sits outside both root layouts, so it shows every language at once.
 */
export default function GlobalNotFound() {
  return (
    <html lang="pt-BR" className={`${fontVariables} h-full antialiased`}>
      <body className="flex min-h-full flex-col items-center justify-center gap-10 p-8 font-sans">
        {locales.map((locale) => {
          const t = getDictionary(locale);
          return (
            <section key={locale} lang={locale} className="max-w-lg text-center">
              <p className="text-sm font-semibold tracking-widest text-accent uppercase">
                {t.notFound.eyebrow}
              </p>
              <h1 className="mt-3 text-3xl font-bold tracking-tight">{t.notFound.title}</h1>
              <a
                href={`${BASE_PATH}/${locale}/`}
                hrefLang={locale}
                className="mt-6 inline-flex h-11 items-center rounded-full bg-accent px-5 text-sm font-semibold text-accent-foreground hover:bg-accent-hover"
              >
                {t.notFound.backHome}
              </a>
            </section>
          );
        })}
      </body>
    </html>
  );
}
