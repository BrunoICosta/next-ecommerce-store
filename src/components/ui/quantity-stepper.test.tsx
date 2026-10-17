import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useState } from "react";
import { describe, expect, it } from "vitest";

import { QuantityStepper } from "./quantity-stepper";

function Harness({ initial = 1, max = 3 }: { initial?: number; max?: number }) {
  const [value, setValue] = useState(initial);
  return <QuantityStepper value={value} onChange={setValue} max={max} />;
}

describe("QuantityStepper", () => {
  it("increments and decrements within bounds", async () => {
    const user = userEvent.setup();
    render(<Harness />);

    const minus = screen.getByRole("button", { name: "Diminuir quantidade" });
    const plus = screen.getByRole("button", { name: "Aumentar quantidade" });
    expect(minus).toBeDisabled();

    await user.click(plus);
    await user.click(plus);
    expect(screen.getByText("3")).toBeInTheDocument();
    expect(plus).toBeDisabled();

    await user.click(minus);
    expect(screen.getByText("2")).toBeInTheDocument();
  });
});
