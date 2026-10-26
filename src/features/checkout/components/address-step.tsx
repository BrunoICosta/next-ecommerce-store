"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-field";
import { formatCep, isValidCep, quoteShipping, sanitizeCep } from "@/features/cart/pricing";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/cn";
import { useI18n } from "@/i18n/i18n-provider";
import { formatPrice } from "@/lib/format";

import { BRAZILIAN_STATES, createAddressSchema, type AddressData } from "../schemas";
import { CepNotFoundError, fetchAddressByCep } from "../viacep";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found" }
  | { status: "error"; reason: "notFound" | "failed" };

interface AddressStepProps {
  defaultValues: AddressData | null;
  merchandiseTotal: number;
  onBack: () => void;
  onSubmit: (data: AddressData) => void;
}

export function AddressStep({
  defaultValues,
  merchandiseTotal,
  onBack,
  onSubmit,
}: AddressStepProps) {
  const cartCep = useCartStore((state) => state.cep);
  const cartMethod = useCartStore((state) => state.shippingMethod);
  const setCep = useCartStore((state) => state.setCep);
  const setShippingMethod = useCartStore((state) => state.setShippingMethod);
  const { locale, t: dictionary } = useI18n();
  const t = dictionary.checkout.address;
  const schema = useMemo(() => createAddressSchema(dictionary.validation), [dictionary]);

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    control,
    formState: { errors },
  } = useForm<AddressData>({
    resolver: zodResolver(schema),
    mode: "onTouched",
    defaultValues: defaultValues ?? {
      cep: cartCep ? formatCep(cartCep) : "",
      street: "",
      number: "",
      complement: "",
      neighborhood: "",
      city: "",
      state: "",
      shippingMethod: cartMethod,
    },
  });

  const cep = useWatch({ control, name: "cep" });
  const shippingMethod = useWatch({ control, name: "shippingMethod" });
  const [lookup, setLookup] = useState<LookupState>({ status: "idle" });
  const lastLookup = useRef<string | null>(defaultValues ? sanitizeCep(defaultValues.cep) : null);

  // Keep the cart summary (shipping cost) in sync with the form.
  useEffect(() => {
    setCep(isValidCep(cep) ? cep : null);
  }, [cep, setCep]);

  useEffect(() => {
    setShippingMethod(shippingMethod);
  }, [shippingMethod, setShippingMethod]);

  useEffect(() => {
    const digits = sanitizeCep(cep);
    if (!isValidCep(digits) || digits === lastLookup.current) return;
    lastLookup.current = digits;

    const controller = new AbortController();
    setLookup({ status: "loading" });
    fetchAddressByCep(digits, { signal: controller.signal })
      .then((address) => {
        const options = { shouldValidate: true, shouldDirty: true };
        setValue("street", address.street, options);
        setValue("neighborhood", address.neighborhood, options);
        setValue("city", address.city, options);
        setValue("state", address.state, options);
        setLookup({ status: "found" });
        setFocus(address.street ? "number" : "street");
      })
      .catch((error: unknown) => {
        if (controller.signal.aborted) return;
        setLookup({
          status: "error",
          reason: error instanceof CepNotFoundError ? "notFound" : "failed",
        });
      });

    return () => controller.abort();
  }, [cep, setValue, setFocus]);

  const options = isValidCep(cep) ? quoteShipping(cep, merchandiseTotal) : null;

  const cepAdornment =
    lookup.status === "loading" ? (
      <LoaderCircle className="size-4 animate-spin text-muted-foreground" aria-hidden />
    ) : lookup.status === "found" ? (
      <CheckCircle2 className="size-4 text-success" aria-hidden />
    ) : null;

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-6">
        <TextField
          label={t.cep}
          inputMode="numeric"
          autoComplete="postal-code"
          placeholder="00000-000"
          containerClassName="sm:col-span-2"
          adornment={cepAdornment}
          error={errors.cep?.message}
          hint={
            <a
              href="https://buscacepinter.correios.com.br/app/endereco/index.php"
              target="_blank"
              rel="noreferrer"
              className="underline underline-offset-2"
            >
              {t.unknownCep}
            </a>
          }
          {...register("cep", {
            setValueAs: formatCep,
            onChange: (event) => {
              event.target.value = formatCep(event.target.value);
              if (!isValidCep(event.target.value)) setLookup({ status: "idle" });
            },
          })}
        />
        <div className="sm:col-span-4" aria-live="polite">
          {lookup.status === "loading" && (
            <p className="text-sm text-muted-foreground sm:mt-9">{t.searching}</p>
          )}
          {lookup.status === "error" && (
            <p className="text-sm text-danger sm:mt-9">
              {lookup.reason === "notFound" ? t.notFound : t.lookupFailed}
            </p>
          )}
        </div>
        <TextField
          label={t.street}
          autoComplete="address-line1"
          containerClassName="sm:col-span-4"
          error={errors.street?.message}
          {...register("street")}
        />
        <TextField
          label={t.number}
          inputMode="numeric"
          containerClassName="sm:col-span-2"
          error={errors.number?.message}
          {...register("number")}
        />
        <TextField
          label={t.complement}
          autoComplete="address-line2"
          containerClassName="sm:col-span-3"
          error={errors.complement?.message}
          {...register("complement")}
        />
        <TextField
          label={t.neighborhood}
          containerClassName="sm:col-span-3"
          error={errors.neighborhood?.message}
          {...register("neighborhood")}
        />
        <TextField
          label={t.city}
          autoComplete="address-level2"
          containerClassName="sm:col-span-4"
          error={errors.city?.message}
          {...register("city")}
        />
        <SelectField
          label={t.state}
          autoComplete="address-level1"
          containerClassName="sm:col-span-2"
          error={errors.state?.message}
          {...register("state")}
        >
          <option value="">{t.statePlaceholder}</option>
          {BRAZILIAN_STATES.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </SelectField>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">{t.method}</legend>
        {options ? (
          <div className="mt-3 grid gap-3 sm:grid-cols-2">
            {options.map((option) => (
              <label
                key={option.id}
                className={cn(
                  "flex cursor-pointer items-center gap-3 rounded-2xl border p-4 text-sm transition has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-accent",
                  shippingMethod === option.id
                    ? "border-foreground bg-muted/60"
                    : "border-border hover:border-muted-foreground",
                )}
              >
                <input
                  type="radio"
                  value={option.id}
                  className="size-4 accent-accent"
                  {...register("shippingMethod")}
                />
                <span className="flex-1">
                  <span className="block font-semibold">
                    {dictionary.shipping.methods[option.id]}
                  </span>
                  <span className="text-muted-foreground">
                    {dictionary.shipping.window(option.minDays, option.maxDays)}
                  </span>
                </span>
                <span className={cn("font-semibold", option.price === 0 && "text-success")}>
                  {option.price === 0
                    ? dictionary.shipping.free
                    : formatPrice(option.price, locale)}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">{t.methodHint}</p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden />
          {dictionary.common.back}
        </Button>
        <Button type="submit" size="lg">
          {t.next}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
