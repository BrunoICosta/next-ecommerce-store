import { z } from "zod";

import { isValidCep } from "@/features/cart/pricing";

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

const required = (label: string) => `Informe ${label}.`;

export const customerSchema = z.object({
  fullName: z
    .string()
    .trim()
    .min(1, required("seu nome completo"))
    .refine((value) => value.split(/\s+/).length >= 2, "Informe nome e sobrenome."),
  email: z.string().trim().min(1, required("seu e-mail")).pipe(z.email("E-mail inválido.")),
  cpf: z
    .string()
    .min(1, required("seu CPF"))
    .refine(isValidCpf, "CPF inválido. Confira os números."),
  phone: z
    .string()
    .min(1, required("um telefone"))
    .refine((value) => [10, 11].includes(onlyDigits(value).length), "Telefone inválido."),
});

export const addressSchema = z.object({
  cep: z.string().min(1, required("o CEP")).refine(isValidCep, "CEP inválido."),
  street: z.string().trim().min(1, required("a rua")),
  number: z.string().trim().min(1, required("o número")).max(10, "Número muito longo."),
  complement: z.string().trim().max(60, "Complemento muito longo.").optional(),
  neighborhood: z.string().trim().min(1, required("o bairro")),
  city: z.string().trim().min(1, required("a cidade")),
  state: z.string().refine(isBrazilianState, "Selecione o estado."),
  shippingMethod: z.enum(["pac", "sedex"]),
});

export const PAYMENT_METHODS = ["card", "pix", "boleto"] as const;
export const MAX_INSTALLMENTS = 6;

/**
 * Flat shape (instead of a discriminated union) keeps react-hook-form typing
 * simple; card fields are only validated when the card method is selected.
 */
export const paymentSchema = z
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

    if (!isValidLuhn(data.cardNumber)) issue("cardNumber", "Número de cartão inválido.");
    if (data.cardName.length < 3) issue("cardName", "Informe o nome impresso no cartão.");
    if (!isValidExpiry(data.expiry)) issue("expiry", "Validade inválida ou vencida.");
    if (!/^\d{3,4}$/.test(data.cvv)) issue("cvv", "CVV inválido.");
    const installments = Number(data.installments);
    if (!Number.isInteger(installments) || installments < 1 || installments > MAX_INSTALLMENTS) {
      issue("installments", "Selecione o número de parcelas.");
    }
  });

export type CustomerData = z.infer<typeof customerSchema>;
export type AddressData = z.infer<typeof addressSchema>;
export type PaymentData = z.infer<typeof paymentSchema>;
export type PaymentMethod = PaymentData["method"];
