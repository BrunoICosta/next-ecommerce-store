import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { findCoupon } from "../pricing";
import { useCartStore } from "../store";
import { CouponForm } from "./coupon-form";

import { renderWithI18n } from "@/test/render";

function ConnectedCouponForm() {
  const code = useCartStore((state) => state.couponCode);
  return <CouponForm coupon={code ? findCoupon(code) : null} />;
}

describe("CouponForm", () => {
  beforeEach(() => {
    useCartStore.setState({ couponCode: null });
  });

  it("shows an error for an invalid coupon", async () => {
    const user = userEvent.setup();
    renderWithI18n(<ConnectedCouponForm />);

    await user.type(screen.getByLabelText("Cupom de desconto"), "natal50");
    await user.click(screen.getByRole("button", { name: "Aplicar" }));

    expect(screen.getByRole("alert")).toHaveTextContent("Cupom inválido ou expirado.");
    expect(screen.getByLabelText("Cupom de desconto")).toHaveAttribute("aria-invalid", "true");
  });

  it("applies BEMVINDO10 and allows removing it", async () => {
    const user = userEvent.setup();
    renderWithI18n(<ConnectedCouponForm />);

    await user.type(screen.getByLabelText("Cupom de desconto"), "bemvindo10{Enter}");
    expect(screen.getByText("BEMVINDO10")).toBeInTheDocument();
    expect(useCartStore.getState().couponCode).toBe("BEMVINDO10");

    await user.click(screen.getByRole("button", { name: "Remover cupom BEMVINDO10" }));
    expect(useCartStore.getState().couponCode).toBeNull();
    expect(screen.getByLabelText("Cupom de desconto")).toBeInTheDocument();
  });
});
