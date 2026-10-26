import type { Locale } from "@/i18n/config";

/**
 * Centralized internal URLs, prefixed with the locale segment. Paths end with
 * "/" because the static export uses `trailingSlash: true` (each route is a
 * folder with an index.html on Pages). Path segments stay the same in every
 * language; only the prefix changes (/pt-BR/produtos/, /en/produtos/).
 */
export function createRoutes(locale: Locale) {
  const prefix = `/${locale}`;
  return {
    home: `${prefix}/`,
    products: (query?: string) => (query ? `${prefix}/produtos/?${query}` : `${prefix}/produtos/`),
    product: (slug: string) => `${prefix}/produto/${slug}/`,
    category: (slug: string) => `${prefix}/produtos/?categoria=${slug}`,
    cart: `${prefix}/carrinho/`,
    wishlist: `${prefix}/favoritos/`,
    checkout: `${prefix}/checkout/`,
    orderConfirmation: `${prefix}/pedido/confirmado/`,
  };
}

export type Routes = ReturnType<typeof createRoutes>;

/** Swaps the locale segment of an internal path: /pt-BR/produtos/ -> /en/produtos/. */
export function switchLocalePath(pathname: string, locale: Locale): string {
  const segments = pathname.split("/");
  // segments[0] is "" because pathname starts with "/".
  if (segments.length > 1 && segments[1] !== "") {
    segments[1] = locale;
    return segments.join("/");
  }
  return `/${locale}/`;
}
