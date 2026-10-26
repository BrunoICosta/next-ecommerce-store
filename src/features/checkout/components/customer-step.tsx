"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useMemo } from "react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";
import { useI18n } from "@/i18n/i18n-provider";

import { createCustomerSchema, type CustomerData } from "../schemas";
import { maskCpf, maskPhone } from "../validators";

interface CustomerStepProps {
  defaultValues: CustomerData | null;
  onSubmit: (data: CustomerData) => void;
}

const EMPTY: CustomerData = { fullName: "", email: "", cpf: "", phone: "" };

export function CustomerStep({ defaultValues, onSubmit }: CustomerStepProps) {
  const { t: dictionary } = useI18n();
  const t = dictionary.checkout.customer;
  const schema = useMemo(() => createCustomerSchema(dictionary.validation), [dictionary]);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(schema),
    defaultValues: defaultValues ?? EMPTY,
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">{t.title}</h2>
        <p className="mt-1 text-sm text-muted-foreground">{t.subtitle}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label={t.fullName}
          autoComplete="name"
          containerClassName="sm:col-span-2"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label={t.email}
          type="email"
          autoComplete="email"
          containerClassName="sm:col-span-2"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label={t.cpf}
          inputMode="numeric"
          placeholder="000.000.000-00"
          hint={t.cpfHint}
          error={errors.cpf?.message}
          {...register("cpf", {
            setValueAs: maskCpf,
            onChange: (event) => {
              event.target.value = maskCpf(event.target.value);
            },
          })}
        />
        <TextField
          label={t.phone}
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder={t.phonePlaceholder}
          error={errors.phone?.message}
          {...register("phone", {
            setValueAs: maskPhone,
            onChange: (event) => {
              event.target.value = maskPhone(event.target.value);
            },
          })}
        />
      </div>

      <div className="flex justify-end">
        <Button type="submit" size="lg">
          {t.next}
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
