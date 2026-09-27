import { cn } from "@/lib/cn";

import { getNewArrivals } from "../queries";
import type { Product } from "../types";
import { ProductCard } from "./product-card";

const newArrivalIds = new Set(getNewArrivals(6).map((product) => product.id));

interface ProductGridProps {
  products: Product[];
  className?: string;
}

export function ProductGrid({ products, className }: ProductGridProps) {
  return (
    <ul
      className={cn(
        "grid grid-cols-2 gap-x-4 gap-y-8 sm:gap-x-6 md:grid-cols-3 xl:grid-cols-4",
        className,
      )}
    >
      {products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} isNew={newArrivalIds.has(product.id)} />
        </li>
      ))}
    </ul>
  );
}
