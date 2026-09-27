import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "lg";
  className?: string;
}

export function Price({ price, compareAtPrice, size = "sm", className }: PriceProps) {
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-semibold", size === "lg" ? "text-3xl" : "text-base")}>
        <span className="sr-only">{onSale ? "Preço promocional: " : "Preço: "}</span>
        {formatPrice(price)}
      </span>
      {onSale && (
        <s className={cn("text-muted-foreground", size === "lg" ? "text-base" : "text-sm")}>
          <span className="sr-only">Preço original: </span>
          {formatPrice(compareAtPrice)}
        </s>
      )}
    </p>
  );
}
