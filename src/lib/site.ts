export const siteConfig = {
  name: "Trama",
  title: "Trama — roupas, tênis e acessórios",
  description:
    "Loja de moda casual com camisetas, moletons, calças, tênis e acessórios. Frete grátis acima de R$ 299 e troca fácil em até 30 dias.",
  url: "https://brunoicosta.github.io/next-ecommerce-store",
  locale: "pt_BR",
  author: {
    name: "Bruno Vinicius Isaac Costa",
    url: "https://github.com/BrunoICosta",
  },
  repository: "https://github.com/BrunoICosta/next-ecommerce-store",
} as const;

export const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

/** Absolute URL for SEO tags (canonical, Open Graph, sitemap). */
export function absoluteUrl(path = "/"): string {
  const normalized = path.startsWith("/") ? path : `/${path}`;
  return `${siteConfig.url}${normalized}`;
}
