"use client";

import { MapPin } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import { formatCep, formatDeliveryWindow, isValidCep, quoteShipping } from "../pricing";
import { useCartStore } from "../store";

interface ShippingCalculatorProps {
  merchandiseTotal: number;
}

export function ShippingCalculator({ merchandiseTotal }: ShippingCalculatorProps) {
  const cep = useCartStore((state) => state.cep);
  const shippingMethod = useCartStore((state) => state.shippingMethod);
  const setCep = useCartStore((state) => state.setCep);
  const setShippingMethod = useCartStore((state) => state.setShippingMethod);
  const [draft, setDraft] = useState(cep ? formatCep(cep) : "");
  const [error, setError] = useState<string | null>(null);
  const inputId = useId();
  const errorId = useId();

  const options = cep ? quoteShipping(cep, merchandiseTotal) : null;

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isValidCep(draft)) {
      setError("Informe um CEP válido com 8 dígitos.");
      return;
    }
    setError(null);
    setCep(draft);
  }

  return (
    <section aria-labelledby={`${inputId}-title`} className="space-y-3">
      <h2 id={`${inputId}-title`} className="flex items-center gap-2 text-sm font-semibold">
        <MapPin className="size-4 text-accent" aria-hidden />
        Calcular frete
      </h2>
      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <label htmlFor={inputId} className="sr-only">
          CEP
        </label>
        <input
          id={inputId}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          value={draft}
          onChange={(event) => setDraft(formatCep(event.target.value))}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm"
        />
        <button
          type="submit"
          className="h-10 rounded-lg bg-foreground px-4 text-sm font-semibold text-background"
        >
          Calcular
        </button>
      </form>
      {error && (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {error}
        </p>
      )}

      {options && (
        <fieldset>
          <legend className="sr-only">Opções de entrega para o CEP {formatCep(cep ?? "")}</legend>
          <ul className="space-y-2">
            {options.map((option) => (
              <li key={option.id}>
                <label
                  className={cn(
                    "flex cursor-pointer items-center gap-3 rounded-xl border p-3 text-sm transition",
                    shippingMethod === option.id
                      ? "border-foreground bg-muted/60"
                      : "border-border hover:border-muted-foreground",
                  )}
                >
                  <input
                    type="radio"
                    name="shipping-method"
                    value={option.id}
                    checked={shippingMethod === option.id}
                    onChange={() => setShippingMethod(option.id)}
                    className="size-4 accent-accent"
                  />
                  <span className="flex-1">
                    <span className="block font-medium">{option.label}</span>
                    <span className="text-muted-foreground">{formatDeliveryWindow(option)}</span>
                  </span>
                  <span className={cn("font-semibold", option.price === 0 && "text-success")}>
                    {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                  </span>
                </label>
              </li>
            ))}
          </ul>
        </fieldset>
      )}
    </section>
  );
}
