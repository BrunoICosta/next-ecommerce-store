import type { Product } from "@/features/catalog";
import { getColor } from "@/features/catalog";
import { routes } from "@/lib/routes";
import { absoluteUrl, siteConfig } from "@/lib/site";

/** schema.org Product markup so search engines can show price and rating. */
export function productJsonLd(product: Product, categoryName: string) {
  const url = absoluteUrl(routes.product(product.slug));
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    sku: product.id,
    category: categoryName,
    color: product.colors.map((color) => getColor(color).name).join(", "),
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
