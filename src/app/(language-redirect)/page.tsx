import { LanguageRedirect } from "@/i18n/language-redirect";

/**
 * "/" has no server to read Accept-Language, so the exported index.html picks
 * the language in the browser (saved choice > browser language > pt-BR) and
 * redirects to /pt-BR/ or /en/. Links remain as a no-JavaScript fallback.
 */
export default function RootPage() {
  return <LanguageRedirect />;
}
