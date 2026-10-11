"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft, ArrowRight, CheckCircle2, LoaderCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { SelectField, TextField } from "@/components/ui/form-field";
import {
  formatCep,
  formatDeliveryWindow,
  isValidCep,
  quoteShipping,
  sanitizeCep,
} from "@/features/cart/pricing";
import { useCartStore } from "@/features/cart/store";
import { cn } from "@/lib/cn";
import { formatPrice } from "@/lib/format";

import { addressSchema, BRAZILIAN_STATES, type AddressData } from "../schemas";
import { CepNotFoundError, fetchAddressByCep } from "../viacep";

type LookupState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "found" }
  | { status: "error"; message: string };

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

  const {
    register,
    handleSubmit,
    setValue,
    setFocus,
    control,
    formState: { errors },
  } = useForm<AddressData>({
    resolver: zodResolver(addressSchema),
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
          message:
            error instanceof CepNotFoundError
              ? "CEP não encontrado. Confira o número ou preencha o endereço manualmente."
              : "Não foi possível consultar o CEP agora. Preencha o endereço manualmente.",
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
        <h2 className="text-xl font-semibold">Endereço de entrega</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Digite o CEP e preenchemos o endereço para você.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-6">
        <TextField
          label="CEP"
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
              Não sei meu CEP
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
            <p className="text-sm text-muted-foreground sm:mt-9">Buscando endereço…</p>
          )}
          {lookup.status === "error" && (
            <p className="text-sm text-danger sm:mt-9">{lookup.message}</p>
          )}
        </div>
        <TextField
          label="Rua"
          autoComplete="address-line1"
          containerClassName="sm:col-span-4"
          error={errors.street?.message}
          {...register("street")}
        />
        <TextField
          label="Número"
          inputMode="numeric"
          containerClassName="sm:col-span-2"
          error={errors.number?.message}
          {...register("number")}
        />
        <TextField
          label="Complemento (opcional)"
          autoComplete="address-line2"
          containerClassName="sm:col-span-3"
          error={errors.complement?.message}
          {...register("complement")}
        />
        <TextField
          label="Bairro"
          containerClassName="sm:col-span-3"
          error={errors.neighborhood?.message}
          {...register("neighborhood")}
        />
        <TextField
          label="Cidade"
          autoComplete="address-level2"
          containerClassName="sm:col-span-4"
          error={errors.city?.message}
          {...register("city")}
        />
        <SelectField
          label="Estado"
          autoComplete="address-level1"
          containerClassName="sm:col-span-2"
          error={errors.state?.message}
          {...register("state")}
        >
          <option value="">UF</option>
          {BRAZILIAN_STATES.map((uf) => (
            <option key={uf} value={uf}>
              {uf}
            </option>
          ))}
        </SelectField>
      </div>

      <fieldset>
        <legend className="text-sm font-semibold">Forma de entrega</legend>
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
                  <span className="block font-semibold">{option.label}</span>
                  <span className="text-muted-foreground">{formatDeliveryWindow(option)}</span>
                </span>
                <span className={cn("font-semibold", option.price === 0 && "text-success")}>
                  {option.price === 0 ? "Grátis" : formatPrice(option.price)}
                </span>
              </label>
            ))}
          </div>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            Informe o CEP para ver as opções de entrega.
          </p>
        )}
      </fieldset>

      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Button variant="ghost" size="lg" onClick={onBack}>
          <ArrowLeft className="size-4" aria-hidden />
          Voltar
        </Button>
        <Button type="submit" size="lg">
          Continuar para pagamento
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
