/**
 * Centralized internal URLs. Paths end with "/" because the static export uses
 * `trailingSlash: true` (each route is a folder with an index.html on Pages).
 */
export const routes = {
  home: "/",
  products: (query?: string) => (query ? `/produtos/?${query}` : "/produtos/"),
  product: (slug: string) => `/produto/${slug}/`,
  category: (slug: string) => `/produtos/?categoria=${slug}`,
  cart: "/carrinho/",
  wishlist: "/favoritos/",
  checkout: "/checkout/",
  orderConfirmation: "/pedido/confirmado/",
} as const;
