import { describe, expect, it } from "vitest";

import {
  detectCardBrand,
  isValidCpf,
  isValidExpiry,
  isValidLuhn,
  maskCardNumber,
  maskCpf,
  maskExpiry,
  maskPhone,
} from "./validators";

describe("isValidCpf", () => {
  it("accepts valid CPFs with or without punctuation", () => {
    expect(isValidCpf("529.982.247-25")).toBe(true);
    expect(isValidCpf("52998224725")).toBe(true);
  });

  it("rejects wrong check digits, repeated digits and wrong lengths", () => {
    expect(isValidCpf("529.982.247-24")).toBe(false);
    expect(isValidCpf("111.111.111-11")).toBe(false);
    expect(isValidCpf("123")).toBe(false);
  });
});

describe("isValidLuhn", () => {
  it("validates well-known test card numbers", () => {
    expect(isValidLuhn("4111 1111 1111 1111")).toBe(true);
    expect(isValidLuhn("5555 5555 5555 4444")).toBe(true);
    expect(isValidLuhn("4111 1111 1111 1112")).toBe(false);
    expect(isValidLuhn("4111")).toBe(false);
  });
});

describe("isValidExpiry", () => {
  const now = new Date(2026, 9, 15); // 15 Oct 2026

  it("accepts the current month and future dates", () => {
    expect(isValidExpiry("10/26", now)).toBe(true);
    expect(isValidExpiry("01/30", now)).toBe(true);
  });

  it("rejects past dates, invalid months and malformed input", () => {
    expect(isValidExpiry("09/26", now)).toBe(false);
    expect(isValidExpiry("13/27", now)).toBe(false);
    expect(isValidExpiry("1027", now)).toBe(false);
  });
});

describe("detectCardBrand", () => {
  it("detects the main brands", () => {
    expect(detectCardBrand("4111111111111111")).toBe("visa");
    expect(detectCardBrand("5555555555554444")).toBe("mastercard");
    expect(detectCardBrand("378282246310005")).toBe("amex");
    expect(detectCardBrand("6362970000457013")).toBe("elo");
    expect(detectCardBrand("9999")).toBe("unknown");
  });
});

describe("masks", () => {
  it("formats CPF, phone, card number and expiry as the user types", () => {
    expect(maskCpf("52998224725")).toBe("529.982.247-25");
    expect(maskCpf("5299")).toBe("529.9");
    expect(maskPhone("11912345678")).toBe("(11) 91234-5678");
    expect(maskPhone("1132345678")).toBe("(11) 3234-5678");
    expect(maskCardNumber("4111111111111111")).toBe("4111 1111 1111 1111");
    expect(maskExpiry("1028")).toBe("10/28");
  });
});
