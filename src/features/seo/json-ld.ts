import type { Product } from "@/features/catalog";
import { getColor } from "@/features/catalog";
import type { Locale } from "@/i18n/config";
import { createRoutes } from "@/lib/routes";
import { absoluteUrl, siteConfig } from "@/lib/site";

/** schema.org Product markup so search engines can show price and rating. */
export function productJsonLd(product: Product, categoryName: string, locale: Locale) {
  const url = absoluteUrl(createRoutes(locale).product(product.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    inLanguage: locale,
    name: product.name,
    description: product.description,
    sku: product.id,
    category: categoryName,
    color: product.colors.map((color) => getColor(color, locale).name).join(", "),
    image: `${url}og.png`,
    url,
    brand: { "@type": "Brand", name: siteConfig.name },
    aggregateRating: {
      "@type": "AggregateRating",
      ratingValue: product.rating,
      reviewCount: product.reviewCount,
    },
    offers: {
      "@type": "Offer",
      url,
      priceCurrency: "BRL",
      price: (product.price / 100).toFixed(2),
      availability: "https://schema.org/InStock",
      itemCondition: "https://schema.org/NewCondition",
    },
  };
}
