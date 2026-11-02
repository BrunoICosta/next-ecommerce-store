export const siteConfig = {
  name: "Trama",
  url: "https://portfolio.brunoisaac.dev/next-ecommerce-store",
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
