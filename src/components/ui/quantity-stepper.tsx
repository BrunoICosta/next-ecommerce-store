"use client";

import { Minus, Plus } from "lucide-react";

import { useI18n } from "@/i18n/i18n-provider";
import { cn } from "@/lib/cn";

interface QuantityStepperProps {
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  label?: string;
  size?: "sm" | "md";
}

export function QuantityStepper({
  value,
  onChange,
  min = 1,
  max = 10,
  label,
  size = "md",
}: QuantityStepperProps) {
  const { t } = useI18n();
  const groupLabel = label ?? t.product.quantity;
  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      role="group"
      aria-label={groupLabel}
      className={cn(
        "inline-flex items-center rounded-full border border-border bg-card",
        size === "sm" ? "p-0.5" : "p-1",
      )}
    >
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={t.product.decrease}
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <output
        aria-live="polite"
        aria-label={`${groupLabel}: ${value}`}
        className={cn(
          "text-center font-semibold tabular-nums",
          size === "sm" ? "w-7 text-sm" : "w-9",
        )}
      >
        {value}
      </output>
      <button
        type="button"
        className={buttonClass}
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={t.product.increase}
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
