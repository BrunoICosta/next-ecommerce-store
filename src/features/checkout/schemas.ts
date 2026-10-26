import { z } from "zod";

import { isValidCep } from "@/features/cart/pricing";
import type { Dictionary } from "@/i18n/dictionaries";

import { isValidCpf, isValidExpiry, isValidLuhn, onlyDigits } from "./validators";

// prettier-ignore
export const BRAZILIAN_STATES = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA", "MT", "MS", "MG", "PA",
  "PB", "PR", "PE", "PI", "RJ", "RN", "RS", "RO", "RR", "SC", "SP", "SE", "TO",
] as const;

export type BrazilianState = (typeof BRAZILIAN_STATES)[number];

export function isBrazilianState(value: string): value is BrazilianState {
  return (BRAZILIAN_STATES as readonly string[]).includes(value);
}

/** Validation messages come from the active dictionary (see i18n/dictionaries). */
export type ValidationMessages = Dictionary["validation"];

export function createCustomerSchema(m: ValidationMessages) {
  return z.object({
    fullName: z
      .string()
      .trim()
      .min(1, m.required(m.fields.fullName))
      .refine((value) => value.split(/\s+/).length >= 2, m.fullNameSurname),
    email: z.string().trim().min(1, m.required(m.fields.email)).pipe(z.email(m.email)),
    cpf: z.string().min(1, m.required(m.fields.cpf)).refine(isValidCpf, m.cpf),
    phone: z
      .string()
      .min(1, m.required(m.fields.phone))
      .refine((value) => [10, 11].includes(onlyDigits(value).length), m.phone),
  });
}

export function createAddressSchema(m: ValidationMessages) {
  return z.object({
    cep: z.string().min(1, m.required(m.fields.cep)).refine(isValidCep, m.cep),
    street: z.string().trim().min(1, m.required(m.fields.street)),
    number: z.string().trim().min(1, m.required(m.fields.number)).max(10, m.numberTooLong),
    complement: z.string().trim().max(60, m.complementTooLong).optional(),
    neighborhood: z.string().trim().min(1, m.required(m.fields.neighborhood)),
    city: z.string().trim().min(1, m.required(m.fields.city)),
    state: z.string().refine((value) => BRAZILIAN_STATES.some((uf) => uf === value), m.state),
    shippingMethod: z.enum(["pac", "sedex"]),
  });
}

export const PAYMENT_METHODS = ["card", "pix", "boleto"] as const;
export const MAX_INSTALLMENTS = 6;

/**
 * Flat shape (instead of a discriminated union) keeps react-hook-form typing
 * simple; card fields are only validated when the card method is selected.
 */
export function createPaymentSchema(m: ValidationMessages) {
  return z
    .object({
      method: z.enum(PAYMENT_METHODS),
      cardNumber: z.string(),
      cardName: z.string().trim(),
      expiry: z.string(),
      cvv: z.string(),
      installments: z.string(),
    })
    .superRefine((data, ctx) => {
      if (data.method !== "card") return;
      const issue = (path: keyof typeof data, message: string) =>
        ctx.addIssue({ code: "custom", path: [path], message });

      if (!isValidLuhn(data.cardNumber)) issue("cardNumber", m.cardNumber);
      if (data.cardName.length < 3) issue("cardName", m.cardName);
      if (!isValidExpiry(data.expiry)) issue("expiry", m.expiry);
      if (!/^\d{3,4}$/.test(data.cvv)) issue("cvv", m.cvv);
      const installments = Number(data.installments);
      if (!Number.isInteger(installments) || installments < 1 || installments > MAX_INSTALLMENTS) {
        issue("installments", m.installments);
      }
    });
}

export type CustomerData = z.infer<ReturnType<typeof createCustomerSchema>>;
export type AddressData = z.infer<ReturnType<typeof createAddressSchema>>;
export type PaymentData = z.infer<ReturnType<typeof createPaymentSchema>>;
export type PaymentMethod = PaymentData["method"];
