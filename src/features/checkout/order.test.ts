import { describe, expect, it } from "vitest";

import { calculateTotals, resolveCartLines } from "@/features/cart/pricing";
import type { CartItem } from "@/features/cart/types";

import { calculatePaymentDiscount, createOrder, getInstallmentOptions } from "./order";
import type { AddressData, CustomerData, PaymentData } from "./schemas";
import { createPaymentSchema } from "./schemas";
import { ptBR } from "@/i18n/dictionaries/pt-BR";

const items: CartItem[] = [
  { key: "p001:preto:M", productId: "p001", color: "preto", size: "M", quantity: 2 },
];
const customer: CustomerData = {
  fullName: "Maria Souza",
  email: "maria@example.com",
  cpf: "529.982.247-25",
  phone: "(11) 91234-5678",
};
const address: AddressData = {
  cep: "01310-100",
  street: "Avenida Paulista",
  number: "1000",
  complement: "",
  neighborhood: "Bela Vista",
  city: "São Paulo",
  state: "SP",
  shippingMethod: "pac",
};
const card: PaymentData = {
  method: "card",
  cardNumber: "4111 1111 1111 1111",
  cardName: "MARIA SOUZA",
  expiry: "12/30",
  cvv: "123",
  installments: "3",
};

const totals = calculateTotals({ items, coupon: null, cep: address.cep, shippingMethod: "pac" });
const lines = resolveCartLines(items, "pt-BR");
const paymentSchema = createPaymentSchema(ptBR.validation);
const fixedRandom = () => 0.5;

describe("getInstallmentOptions", () => {
  it("limits installments by the minimum installment value", () => {
    expect(getInstallmentOptions(3_000)).toHaveLength(1);
    expect(getInstallmentOptions(100_000)).toHaveLength(6);
    expect(getInstallmentOptions(10_000)[4]).toEqual({ count: 5, amount: 2_000 });
  });
});

describe("calculatePaymentDiscount", () => {
  it("gives 5% off merchandise (not shipping) only for Pix", () => {
    expect(calculatePaymentDiscount(totals, "pix")).toBe(Math.round(25_980 * 0.05));
    expect(calculatePaymentDiscount(totals, "card")).toBe(0);
  });
});

describe("paymentSchema", () => {
  it("only validates card fields when paying by card", () => {
    expect(paymentSchema.safeParse({ ...card, cardNumber: "1234" }).success).toBe(false);
    expect(
      paymentSchema.safeParse({ ...card, method: "pix", cardNumber: "", cvv: "" }).success,
    ).toBe(true);
  });
});

describe("createOrder", () => {
  const now = new Date("2026-10-16T12:00:00-03:00"); // Friday

  it("creates a card order without storing the full card number", () => {
    const order = createOrder({
      lines,
      totals,
      customer,
      address,
      payment: card,
      now,
      random: fixedRandom,
    });
    expect(order.id).toBe("TR-555555");
    expect(order.payment).toEqual({
      method: "card",
      brand: "visa",
      last4: "1111",
      installments: 3,
    });
    expect(JSON.stringify(order)).not.toContain("4111 1111");
    expect(order.totals).toMatchObject({ shipping: 1_490, paymentDiscount: 0, total: 27_470 });
    expect(order.items[0]).toMatchObject({ name: "Camiseta Essencial Pima", quantity: 2 });
  });

  it("applies the Pix discount and generates a copy-and-paste code", () => {
    const order = createOrder({
      lines,
      totals,
      customer,
      address,
      payment: { ...card, method: "pix" },
      now,
      random: fixedRandom,
    });
    expect(order.totals.paymentDiscount).toBe(1_299);
    expect(order.totals.total).toBe(25_980 + 1_490 - 1_299);
    expect(order.payment.method === "pix" && order.payment.code).toContain("BR.GOV.BCB.PIX");
  });

  it("sets the boleto due date three business days ahead", () => {
    const order = createOrder({
      lines,
      totals,
      customer,
      address,
      payment: { ...card, method: "boleto" },
      now,
      random: fixedRandom,
    });
    expect(order.payment.method).toBe("boleto");
    if (order.payment.method === "boleto") {
      expect(new Date(order.payment.dueDate).getDate()).toBe(21); // Fri 16 -> Wed 21
    }
  });
});
