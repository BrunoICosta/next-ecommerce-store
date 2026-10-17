import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { DEFAULT_FILTERS } from "../filters";
import { getCategoryCounts } from "../queries";
import { ActiveFilters } from "./active-filters";
import { FilterPanel } from "./filter-panel";

describe("FilterPanel", () => {
  it("emits patches for categories, colors, sizes and price", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    render(
      <FilterPanel
        filters={{ ...DEFAULT_FILTERS, categories: ["tenis"] }}
        categoryCounts={getCategoryCounts()}
        onChange={onChange}
      />,
    );

    await user.click(screen.getByRole("checkbox", { name: /Camisetas/ }));
    expect(onChange).toHaveBeenLastCalledWith({ categories: ["tenis", "camisetas"] });

    await user.click(screen.getByRole("checkbox", { name: /Tênis/ }));
    expect(onChange).toHaveBeenLastCalledWith({ categories: [] });

    await user.click(screen.getByRole("button", { name: "Preto" }));
    expect(onChange).toHaveBeenLastCalledWith({ colors: ["preto"] });

    await user.click(screen.getByRole("button", { name: "Tamanho 42" }));
    expect(onChange).toHaveBeenLastCalledWith({ sizes: ["42"] });

    await user.type(screen.getByLabelText("Mínimo (R$)"), "300");
    await user.type(screen.getByLabelText("Máximo (R$)"), "100");
    await user.click(screen.getByRole("button", { name: "Ok" }));
    expect(onChange).toHaveBeenLastCalledWith({ minPrice: 100, maxPrice: 300 });
  });
});

describe("ActiveFilters", () => {
  it("renders a removable chip per filter and a clear-all action", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClear = vi.fn();
    render(
      <ActiveFilters
        filters={{ ...DEFAULT_FILTERS, query: "boné", colors: ["preto", "vinho"], maxPrice: 100 }}
        onChange={onChange}
        onClear={onClear}
      />,
    );

    expect(screen.getAllByRole("button", { name: /Remover filtro/ })).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "Remover filtro Vinho" }));
    expect(onChange).toHaveBeenCalledWith({ colors: ["preto"] });

    await user.click(screen.getByRole("button", { name: "Limpar tudo" }));
    expect(onClear).toHaveBeenCalled();
  });

  it("renders nothing without active filters", () => {
    const { container } = render(
      <ActiveFilters filters={DEFAULT_FILTERS} onChange={vi.fn()} onClear={vi.fn()} />,
    );
    expect(container).toBeEmptyDOMElement();
  });
});
