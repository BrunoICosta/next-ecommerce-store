"use client";

import { useEffect } from "react";

import { BASE_PATH } from "@/lib/site";

import { localeNames, locales } from "./config";
import { detectBrowserLocale } from "./detect";

export function LanguageRedirect() {
  useEffect(() => {
    // A full navigation is required: each locale tree has its own root layout.
    window.location.replace(`${BASE_PATH}/${detectBrowserLocale()}/`);
  }, []);

  return (
    <main className="flex flex-1 flex-col items-center justify-center gap-4 p-8 text-center">
      <p className="text-lg font-semibold" role="status">
        Trama
      </p>
      <ul className="flex gap-3 text-sm">
        {locales.map((locale) => (
          <li key={locale}>
            <a
              href={`${BASE_PATH}/${locale}/`}
              hrefLang={locale}
              lang={locale}
              className="rounded-full border border-border px-4 py-2 font-medium hover:border-foreground"
            >
              {localeNames[locale]}
            </a>
          </li>
        ))}
      </ul>
    </main>
  );
}
