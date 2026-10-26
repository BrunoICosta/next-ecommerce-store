"use client";

import { Trash2 } from "lucide-react";
import Link from "next/link";

import { QuantityStepper } from "@/components/ui/quantity-stepper";
import { getColor, sizeLabel } from "@/features/catalog";
import { useI18n } from "@/i18n/i18n-provider";
import { ProductArt } from "@/features/catalog/components/product-art";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import { MAX_QUANTITY_PER_ITEM } from "../pricing";
import { useCartStore } from "../store";
import type { CartLine } from "../types";

interface CartLineItemProps {
  line: CartLine;
  compact?: boolean;
  onNavigate?: () => void;
}

export function CartLineItem({ line, compact = false, onNavigate }: CartLineItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const { product } = line;
  const { locale, t, routes } = useI18n();
  const colorName = getColor(line.color, locale).name;
  const variant = `${colorName}${line.size === "U" ? "" : ` · ${t.common.sizeShort(sizeLabel(line.size, locale))}`}`;

  return (
    <div className="flex gap-4">
      <Link
        href={routes.product(product.slug)}
        onClick={onNavigate}
        className={cn(
          "shrink-0 overflow-hidden rounded-xl bg-muted",
          compact ? "w-20" : "w-24 sm:w-28",
        )}
        tabIndex={-1}
        aria-hidden
      >
        <ProductArt
          category={product.category}
          color={line.color}
          label=""
          className="aspect-[4/5] w-full"
        />
      </Link>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <Link
              href={routes.product(product.slug)}
              onClick={onNavigate}
              className="line-clamp-2 font-medium hover:underline"
            >
              {product.name}
            </Link>
            <p className="mt-0.5 text-sm text-muted-foreground">{variant}</p>
            {!compact && (
              <p className="mt-0.5 text-sm text-muted-foreground">
                {t.common.each(line.unitPrice)}
              </p>
            )}
          </div>
          <p className="shrink-0 font-semibold">{formatPrice(line.lineTotal, locale)}</p>
        </div>
        <div className="mt-auto flex items-center justify-between pt-3">
          <QuantityStepper
            size="sm"
            value={line.quantity}
            max={MAX_QUANTITY_PER_ITEM}
            onChange={(quantity) => updateQuantity(line.key, quantity)}
            label={t.cart.quantityOf(product.name)}
          />
          <button
            type="button"
            onClick={() => removeItem(line.key)}
            className="inline-flex items-center gap-1.5 rounded-full px-2 py-1 text-sm text-muted-foreground hover:bg-muted hover:text-danger"
            aria-label={t.cart.removeAria(product.name, variant)}
          >
            <Trash2 className="size-4" aria-hidden />
            {!compact && <span>{t.cart.remove}</span>}
          </button>
        </div>
      </div>
    </div>
  );
}
