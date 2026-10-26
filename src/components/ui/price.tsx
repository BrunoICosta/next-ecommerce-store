import type { Locale } from "@/i18n/config";
import { getDictionary } from "@/i18n/dictionaries";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

interface PriceProps {
  price: number;
  compareAtPrice?: number;
  size?: "sm" | "lg";
  className?: string;
  locale: Locale;
}

export function Price({ price, compareAtPrice, size = "sm", className, locale }: PriceProps) {
  const t = getDictionary(locale).product;
  const onSale = compareAtPrice !== undefined && compareAtPrice > price;
  return (
    <p className={cn("flex flex-wrap items-baseline gap-x-2", className)}>
      <span className={cn("font-semibold", size === "lg" ? "text-3xl" : "text-base")}>
        <span className="sr-only">{onSale ? t.salePriceLabel : t.priceLabel}</span>
        {formatPrice(price, locale)}
      </span>
      {onSale && (
        <s className={cn("text-muted-foreground", size === "lg" ? "text-base" : "text-sm")}>
          <span className="sr-only">{t.originalPriceLabel}</span>
          {formatPrice(compareAtPrice, locale)}
        </s>
      )}
    </p>
  );
}
