import { Check } from "lucide-react";

import { cn } from "@/lib/cn";

import type { CheckoutStep } from "../store";

const STEPS: { step: CheckoutStep; label: string }[] = [
  { step: 1, label: "Dados" },
  { step: 2, label: "Entrega" },
  { step: 3, label: "Pagamento" },
];

interface CheckoutStepperProps {
  current: CheckoutStep;
  /** Highest step the shopper may jump back to. */
  onSelect: (step: CheckoutStep) => void;
}

export function CheckoutStepper({ current, onSelect }: CheckoutStepperProps) {
  return (
    <nav aria-label="Etapas do checkout">
      <ol className="flex items-center gap-2 sm:gap-4">
        {STEPS.map(({ step, label }, index) => {
          const done = step < current;
          const active = step === current;
          return (
            <li key={step} className="flex flex-1 items-center gap-2 sm:gap-4">
              <button
                type="button"
                disabled={!done}
                onClick={() => onSelect(step)}
                aria-current={active ? "step" : undefined}
                className="flex items-center gap-2 rounded-full text-sm font-semibold disabled:cursor-default"
              >
                <span
                  className={cn(
                    "flex size-8 shrink-0 items-center justify-center rounded-full border-2 text-sm transition",
                    done && "border-accent bg-accent text-accent-foreground",
                    active && "border-foreground bg-foreground text-background",
                    !done && !active && "border-border text-muted-foreground",
                  )}
                >
                  {done ? <Check className="size-4" aria-hidden /> : step}
                </span>
                <span className={cn(!active && !done && "text-muted-foreground")}>
                  {label}
                  {done && <span className="sr-only"> (concluída)</span>}
                </span>
              </button>
              {index < STEPS.length - 1 && (
                <span
                  className={cn("h-0.5 flex-1 rounded-full", done ? "bg-accent" : "bg-border")}
                  aria-hidden
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
