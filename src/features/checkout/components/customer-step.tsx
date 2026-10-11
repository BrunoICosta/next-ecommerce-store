"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowRight } from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import { TextField } from "@/components/ui/form-field";

import { customerSchema, type CustomerData } from "../schemas";
import { maskCpf, maskPhone } from "../validators";

interface CustomerStepProps {
  defaultValues: CustomerData | null;
  onSubmit: (data: CustomerData) => void;
}

const EMPTY: CustomerData = { fullName: "", email: "", cpf: "", phone: "" };

export function CustomerStep({ defaultValues, onSubmit }: CustomerStepProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CustomerData>({
    resolver: zodResolver(customerSchema),
    defaultValues: defaultValues ?? EMPTY,
    mode: "onTouched",
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Seus dados</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Usamos estas informações para emitir a nota fiscal e enviar atualizações do pedido.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <TextField
          label="Nome completo"
          autoComplete="name"
          containerClassName="sm:col-span-2"
          error={errors.fullName?.message}
          {...register("fullName")}
        />
        <TextField
          label="E-mail"
          type="email"
          autoComplete="email"
          containerClassName="sm:col-span-2"
          error={errors.email?.message}
          {...register("email")}
        />
        <TextField
          label="CPF"
          inputMode="numeric"
          placeholder="000.000.000-00"
          hint="Dica para testar: 529.982.247-25"
          error={errors.cpf?.message}
          {...register("cpf", {
            setValueAs: maskCpf,
            onChange: (event) => {
              event.target.value = maskCpf(event.target.value);
            },
          })}
        />
        <TextField
          label="Celular"
          type="tel"
          inputMode="tel"
          autoComplete="tel-national"
          placeholder="(11) 91234-5678"
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
          Continuar para entrega
          <ArrowRight className="size-4" aria-hidden />
        </Button>
      </div>
    </form>
  );
}
