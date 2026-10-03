"use client";

import { Minus, Plus } from "lucide-react";

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
  label = "Quantidade",
  size = "md",
}: QuantityStepperProps) {
  const buttonClass = cn(
    "inline-flex items-center justify-center rounded-full transition hover:bg-muted disabled:cursor-not-allowed disabled:opacity-40",
    size === "sm" ? "size-8" : "size-10",
  );

  return (
    <div
      role="group"
      aria-label={label}
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
        aria-label="Diminuir quantidade"
      >
        <Minus className="size-4" aria-hidden />
      </button>
      <output
        aria-live="polite"
        aria-label={`${label}: ${value}`}
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
        aria-label="Aumentar quantidade"
      >
        <Plus className="size-4" aria-hidden />
      </button>
    </div>
  );
}
