"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Barcode, CreditCard, LoaderCircle, Lock, QrCode } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-field";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

import { getInstallmentOptions } from "../order";
import { createPaymentSchema, type PaymentData, type PaymentMethod } from "../schemas";
import { detectCardBrand, maskCardNumber, maskExpiry, onlyDigits } from "../validators";

const METHODS: { id: PaymentMethod; icon: typeof CreditCard }[] = [
  { id: "card", icon: CreditCard },
  { id: "pix", icon: QrCode },
  { id: "boleto", icon: Barcode },
];

const BRAND_LABEL = { visa: "Visa", mastercard: "Mastercard", amex: "Amex", elo: "Elo" } as const;

interface PaymentStepProps {
  /** Amount due (in cents) for the selected method, including shipping and discounts. */
  amountFor: (method: PaymentMethod) => number;
  onMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onSubmit: (data: PaymentData) => Promise<void>;
}

export function PaymentStep({ amountFor, onMethodChange, onBack, onSubmit }: PaymentStepProps) {
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.checkout.payment;
  const schema = useMemo(() => createPaymentSchema(dictionary.validation), [dictionary]);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: {
      method: "card",
      cardNumber: "",
      cardName: "",
      expiry: "",
      cvv: "",
      installments: "1",
    },
  });

  const method = useWatch({ control, name: "method" });
  const cardNumber = useWatch({ control, name: "cardNumber" });
  const brand = detectCardBrand(cardNumber);
  const amount = amountFor(method);

  useEffect(() => {
    onMethodChange(method);
  }, [method, onMethodChange]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <fieldset>
        <legend className="sr-only">{t.method}</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {METHODS.map(({ id, icon: Icon }) => (
            <label
              key={id}
              className={cn(
                "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent sm:flex-col sm:items-start",
                method === id
                  ? "border-foreground bg-muted/60"
                  : "border-border hover:border-muted-foreground",
              )}
            >
              <input type="radio" value={id} className="sr-only" {...register("method")} />
              <Icon className={cn("size-6", method === id && "text-accent")} aria-hidden />
              <span>
                <span className="block font-semibold">{t.methods[id].label}</span>
                <span className="text-muted-foreground">{t.methods[id].description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {method === "card" && (
        <div className="grid gap-4 sm:grid-cols-4">
          <TextField
            label={t.cardNumber}
            inputMode="numeric"
            autoComplete="cc-number"
            placeholder="0000 0000 0000 0000"
            containerClassName="sm:col-span-4"
            error={errors.cardNumber?.message}
            adornment={
              brand !== "unknown" && (
                <span className="text-xs font-bold text-muted-foreground uppercase">
                  {BRAND_LABEL[brand]}
                </span>
              )
            }
            className="pr-24"
            {...register("cardNumber", {
              setValueAs: maskCardNumber,
              onChange: (event) => {
                event.target.value = maskCardNumber(event.target.value);
              },
            })}
          />
          <TextField
            label={t.cardName}
            autoComplete="cc-name"
            containerClassName="sm:col-span-4"
            className="uppercase"
            error={errors.cardName?.message}
            {...register("cardName")}
          />
          <TextField
            label={t.expiry}
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder={t.expiryPlaceholder}
            containerClassName="sm:col-span-2"
            error={errors.expiry?.message}
            {...register("expiry", {
              setValueAs: maskExpiry,
              onChange: (event) => {
                event.target.value = maskExpiry(event.target.value);
              },
            })}
          />
          <TextField
            label={t.cvv}
            inputMode="numeric"
            autoComplete="cc-csc"
            placeholder="123"
            maxLength={4}
            containerClassName="sm:col-span-2"
            error={errors.cvv?.message}
            {...register("cvv", {
              setValueAs: (value: string) => onlyDigits(value),
            })}
          />
          <SelectField
            label={t.installments}
            containerClassName="sm:col-span-4"
            error={errors.installments?.message}
            {...register("installments")}
          >
            {getInstallmentOptions(amount).map(({ count, amount: installment }) => (
              <option key={count} value={String(count)}>
                {t.installmentOption(count, installment)}
              </option>
            ))}
          </SelectField>
        </div>
      )}

      {method === "pix" && (
        <div className="flex gap-4 rounded-2xl bg-muted p-5 text-sm">
          <QrCode className="size-10 shrink-0 text-accent" aria-hidden />
          <p>
            {t.pixInfo(amount)[0]}
            <strong>{t.pixInfo(amount)[1]}</strong>
            {t.pixInfo(amount)[2]}
          </p>
        </div>
      )}

      {method === "boleto" && (
        <div className="flex gap-4 rounded-2xl bg-muted p-5 text-sm">
          <Barcode className="size-10 shrink-0 text-accent" aria-hidden />
          <p>{t.boletoInfo}</p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" size="lg" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="size-4" aria-hidden />
          {dictionary.common.back}
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting} aria-live="polite">
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              {t.processing}
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden />
              {t.submit[method]} {formatPrice(amount, locale)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
