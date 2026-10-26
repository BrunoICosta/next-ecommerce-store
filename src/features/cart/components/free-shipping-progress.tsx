"use client";

import { Truck } from "lucide-react";

import { useI18n } from "@/i18n/i18n-provider";

import { amountUntilFreeShipping, FREE_SHIPPING_THRESHOLD } from "../pricing";

export function FreeShippingProgress({ merchandiseTotal }: { merchandiseTotal: number }) {
  const { t: dictionary } = useI18n();
  const t = dictionary.cart;
  const missing = amountUntilFreeShipping(merchandiseTotal);
  const progress = Math.min(100, Math.round((merchandiseTotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="rounded-2xl bg-muted p-4 text-sm">
      <p className="flex items-center gap-2">
        <Truck className="size-4 shrink-0 text-accent" aria-hidden />
        {missing > 0 ? (
          <span>
            {t.freeShippingMissing(missing)[0]}
            <strong>{t.freeShippingMissing(missing)[1]}</strong>
            {t.freeShippingMissing(missing)[2]}
          </span>
        ) : (
          <span className="font-semibold text-success">{t.freeShippingReached}</span>
        )}
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label={t.freeShippingProgress}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-valuenow={progress}
      >
        <div
          className="h-full rounded-full bg-accent transition-[width] duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
