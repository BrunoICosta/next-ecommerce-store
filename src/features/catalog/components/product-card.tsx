import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Price } from "@/components/ui/price";
import { Rating } from "@/components/ui/rating";
import { WishlistButton } from "@/features/wishlist/components/wishlist-button";
import { routes } from "@/lib/routes";

import { getColor } from "../data/colors";
import { getDiscountPercent } from "../queries";
import type { ColorId, Product } from "../types";
import { ProductArt } from "./product-art";

interface ProductCardProps {
  product: Product;
  isNew?: boolean;
  /** When the shopper filters by color, show the product in that color. */
  preferredColors?: ColorId[];
}

export function ProductCard({ product, isNew = false, preferredColors = [] }: ProductCardProps) {
  const discount = getDiscountPercent(product);
  const coverColor =
    product.colors.find((color) => preferredColors.includes(color)) ?? product.colors[0];

  return (
    <article className="group relative flex h-full flex-col">
      <div className="relative overflow-hidden rounded-2xl bg-muted">
        <ProductArt
          category={product.category}
          color={coverColor}
          label={`${product.name} na cor ${getColor(coverColor).name}`}
          className="aspect-[4/5] w-full transition duration-500 group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
          {discount > 0 && <Badge tone="accent">-{discount}%</Badge>}
          {isNew && <Badge>Novo</Badge>}
        </div>
        <WishlistButton
          productId={product.id}
          productName={product.name}
          className="absolute top-3 right-3 z-10"
        />
      </div>
      <div className="mt-3 flex flex-1 flex-col gap-1">
        <h3 className="leading-snug font-medium">
          <Link
            href={routes.product(product.slug)}
            className="after:absolute after:inset-0 after:rounded-2xl focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-4 focus-visible:after:outline-accent"
          >
            {product.name}
          </Link>
        </h3>
        <Rating value={product.rating} count={product.reviewCount} className="text-xs" />
        <div className="mt-auto flex items-end justify-between gap-2 pt-1">
          <Price price={product.price} compareAtPrice={product.compareAtPrice} />
          <ul className="flex -space-x-1" aria-label="Cores disponíveis">
            {product.colors.map((colorId) => {
              const color = getColor(colorId);
              return (
                <li
                  key={colorId}
                  className="size-3.5 rounded-full border border-background ring-1 ring-border"
                  style={{ backgroundColor: color.hex }}
                  title={color.name}
                >
                  <span className="sr-only">{color.name}</span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </article>
  );
}
