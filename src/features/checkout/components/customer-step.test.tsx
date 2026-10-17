import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { CustomerStep } from "./customer-step";

describe("CustomerStep", () => {
  it("shows validation errors and does not submit invalid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomerStep defaultValues={null} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria");
    await user.type(screen.getByLabelText("E-mail"), "maria@");
    await user.type(screen.getByLabelText("CPF"), "11111111111");
    await user.click(screen.getByRole("button", { name: /Continuar para entrega/ }));

    expect(await screen.findByText("Informe nome e sobrenome.")).toBeInTheDocument();
    expect(screen.getByText("E-mail inválido.")).toBeInTheDocument();
    expect(screen.getByText("CPF inválido. Confira os números.")).toBeInTheDocument();
    expect(screen.getByText("Informe um telefone.")).toBeInTheDocument();
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it("masks inputs and submits valid data", async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();
    render(<CustomerStep defaultValues={null} onSubmit={onSubmit} />);

    await user.type(screen.getByLabelText("Nome completo"), "Maria Souza");
    await user.type(screen.getByLabelText("E-mail"), "maria@example.com");
    await user.type(screen.getByLabelText("CPF"), "52998224725");
    await user.type(screen.getByLabelText("Celular"), "11912345678");

    expect(screen.getByLabelText("CPF")).toHaveValue("529.982.247-25");
    expect(screen.getByLabelText("Celular")).toHaveValue("(11) 91234-5678");

    await user.click(screen.getByRole("button", { name: /Continuar para entrega/ }));

    expect(onSubmit).toHaveBeenCalledTimes(1);
    expect(onSubmit.mock.calls[0][0]).toEqual({
      fullName: "Maria Souza",
      email: "maria@example.com",
      cpf: "529.982.247-25",
      phone: "(11) 91234-5678",
    });
  });
});
