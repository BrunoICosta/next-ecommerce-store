"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, Barcode, CreditCard, LoaderCircle, Lock, QrCode } from "lucide-react";
import { useEffect } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-field";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import { getInstallmentOptions } from "../order";
import { paymentSchema, type PaymentData, type PaymentMethod } from "../schemas";
import { detectCardBrand, maskCardNumber, maskExpiry, onlyDigits } from "../validators";

const METHODS: {
  id: PaymentMethod;
  label: string;
  description: string;
  icon: typeof CreditCard;
}[] = [
  { id: "card", label: "Cartão de crédito", description: "Até 6x sem juros", icon: CreditCard },
  { id: "pix", label: "Pix", description: "5% de desconto", icon: QrCode },
  { id: "boleto", label: "Boleto", description: "Vence em 3 dias úteis", icon: Barcode },
];

const SUBMIT_LABEL: Record<PaymentMethod, string> = {
  card: "Pagar",
  pix: "Gerar Pix de",
  boleto: "Gerar boleto de",
};

const BRAND_LABEL = { visa: "Visa", mastercard: "Mastercard", amex: "Amex", elo: "Elo" } as const;

interface PaymentStepProps {
  /** Amount due (in cents) for the selected method, including shipping and discounts. */
  amountFor: (method: PaymentMethod) => number;
  onMethodChange: (method: PaymentMethod) => void;
  onBack: () => void;
  onSubmit: (data: PaymentData) => Promise<void>;
}

export function PaymentStep({ amountFor, onMethodChange, onBack, onSubmit }: PaymentStepProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<PaymentData>({
    resolver: zodResolver(paymentSchema),
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
        <h2 className="text-xl font-semibold">Pagamento</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Demonstração: use o cartão de teste 4111 1111 1111 1111, qualquer nome, validade futura e
          CVV 123.
        </p>
      </div>

      <fieldset>
        <legend className="sr-only">Forma de pagamento</legend>
        <div className="grid gap-3 sm:grid-cols-3">
          {METHODS.map(({ id, label, description, icon: Icon }) => (
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
                <span className="block font-semibold">{label}</span>
                <span className="text-muted-foreground">{description}</span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {method === "card" && (
        <div className="grid gap-4 sm:grid-cols-4">
          <TextField
            label="Número do cartão"
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
            label="Nome impresso no cartão"
            autoComplete="cc-name"
            containerClassName="sm:col-span-4"
            className="uppercase"
            error={errors.cardName?.message}
            {...register("cardName")}
          />
          <TextField
            label="Validade"
            inputMode="numeric"
            autoComplete="cc-exp"
            placeholder="MM/AA"
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
            label="CVV"
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
            label="Parcelas"
            containerClassName="sm:col-span-4"
            error={errors.installments?.message}
            {...register("installments")}
          >
            {getInstallmentOptions(amount).map(({ count, amount: installment }) => (
              <option key={count} value={String(count)}>
                {count}x de {formatPrice(installment)} sem juros
              </option>
            ))}
          </SelectField>
        </div>
      )}

      {method === "pix" && (
        <div className="flex gap-4 rounded-2xl bg-muted p-5 text-sm">
          <QrCode className="size-10 shrink-0 text-accent" aria-hidden />
          <p>
            Ao confirmar, geramos um código Pix copia e cola com validade de 30 minutos. Você paga{" "}
            <strong>{formatPrice(amount)}</strong> já com 5% de desconto.
          </p>
        </div>
      )}

      {method === "boleto" && (
        <div className="flex gap-4 rounded-2xl bg-muted p-5 text-sm">
          <Barcode className="size-10 shrink-0 text-accent" aria-hidden />
          <p>
            O boleto vence em 3 dias úteis e a compensação leva até 2 dias úteis após o pagamento. O
            prazo de entrega começa a contar depois da confirmação.
          </p>
        </div>
      )}

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" size="lg" onClick={onBack} disabled={isSubmitting}>
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Button>
        <Button type="submit" size="lg" disabled={isSubmitting} aria-live="polite">
          {isSubmitting ? (
            <>
              <LoaderCircle className="size-4 animate-spin" aria-hidden />
              Processando…
            </>
          ) : (
            <>
              <Lock className="size-4" aria-hidden />
              {SUBMIT_LABEL[method]} {formatPrice(amount)}
            </>
          )}
        </Button>
      </div>
    </form>
  );
}
