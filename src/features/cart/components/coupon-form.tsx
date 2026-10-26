"use client";

import { TicketPercent, X } from "lucide-react";
import { useId, useState, type FormEvent } from "react";

import { useI18n } from "@/i18n/i18n-provider";

import { useCartStore, type CouponError } from "../store";
import type { Coupon } from "../types";

export function CouponForm({ coupon }: { coupon: Coupon | null }) {
  const applyCoupon = useCartStore((state) => state.applyCoupon);
  const removeCoupon = useCartStore((state) => state.removeCoupon);
  const [code, setCode] = useState("");
  const [error, setError] = useState<CouponError | null>(null);
  const { t: dictionary } = useI18n();
  const t = dictionary.coupon;
  const inputId = useId();
  const errorId = useId();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const result = applyCoupon(code);
    if (result.ok) {
      setCode("");
      setError(null);
    } else {
      setError(result.error);
    }
  }

  if (coupon) {
    return (
      <div className="flex items-center justify-between gap-3 rounded-xl border border-success/40 bg-success/10 p-3 text-sm">
        <span className="flex items-center gap-2">
          <TicketPercent className="size-4 text-success" aria-hidden />
          <span>
            <strong>{coupon.code}</strong> {t.applied}
            <span className="block text-muted-foreground">{t.description}</span>
          </span>
        </span>
        <button
          type="button"
          onClick={removeCoupon}
          className="inline-flex size-8 items-center justify-center rounded-full hover:bg-muted"
          aria-label={t.remove(coupon.code)}
        >
          <X className="size-4" aria-hidden />
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <form onSubmit={handleSubmit} className="flex gap-2" noValidate>
        <label htmlFor={inputId} className="sr-only">
          {t.label}
        </label>
        <input
          id={inputId}
          value={code}
          onChange={(event) => setCode(event.target.value.toUpperCase())}
          placeholder={t.placeholder}
          autoComplete="off"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          className="h-10 min-w-0 flex-1 rounded-lg border border-border bg-card px-3 text-sm uppercase placeholder:normal-case"
        />
        <button
          type="submit"
          className="h-10 rounded-lg border border-border px-4 text-sm font-semibold hover:border-foreground"
        >
          {t.apply}
        </button>
      </form>
      {error ? (
        <p id={errorId} role="alert" className="text-sm text-danger">
          {t.errors[error]}
        </p>
      ) : (
        <p className="text-xs text-muted-foreground">
          {t.hint[0]}
          <strong>{t.hint[1]}</strong>
          {t.hint[2]}
        </p>
      )}
    </div>
  );
}
