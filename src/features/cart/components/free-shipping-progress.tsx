import { Truck } from "lucide-react";

import { formatPrice } from "@/lib/format";

import { amountUntilFreeShipping, FREE_SHIPPING_THRESHOLD } from "../pricing";

export function FreeShippingProgress({ merchandiseTotal }: { merchandiseTotal: number }) {
  const missing = amountUntilFreeShipping(merchandiseTotal);
  const progress = Math.min(100, Math.round((merchandiseTotal / FREE_SHIPPING_THRESHOLD) * 100));

  return (
    <div className="rounded-2xl bg-muted p-4 text-sm">
      <p className="flex items-center gap-2">
        <Truck className="size-4 shrink-0 text-accent" aria-hidden />
        {missing > 0 ? (
          <span>
            Faltam <strong>{formatPrice(missing)}</strong> para o frete grátis.
          </span>
        ) : (
          <span className="font-semibold text-success">
            Você ganhou frete grátis na entrega econômica!
          </span>
        )}
      </p>
      <div
        className="mt-3 h-2 overflow-hidden rounded-full bg-border"
        role="progressbar"
        aria-label="Progresso para frete grátis"
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
