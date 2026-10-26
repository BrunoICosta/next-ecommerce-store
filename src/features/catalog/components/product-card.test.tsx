import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";

import { useWishlistStore } from "@/features/wishlist/store";

import { getProductBySlug } from "../queries";
import { ProductCard } from "./product-card";

import { renderWithI18n } from "@/test/render";

const product = getProductBySlug("tenis-corrida-leve", "pt-BR")!;

describe("ProductCard", () => {
  beforeEach(async () => {
    useWishlistStore.setState({ productIds: [] });
    await useWishlistStore.persist.rehydrate();
  });

  it("renders name, link, prices, discount and rating", () => {
    renderWithI18n(<ProductCard product={product} isNew locale="pt-BR" />);

    const link = screen.getByRole("link", { name: "Tênis Corrida Leve" });
    expect(link.getAttribute("href")).toMatch(/^\/pt-BR\/produto\/tenis-corrida-leve\/?$/);
    expect(screen.getByText("-17%")).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
    expect(screen.getByText(/499,90/)).toBeInTheDocument();
    expect(screen.getByText(/599,90/).closest("s")).not.toBeNull();
    expect(screen.getByRole("img", { name: /Avaliação 4,7 de 5/ })).toBeInTheDocument();
  });

  it("shows the artwork in the preferred color when filtering", () => {
    renderWithI18n(
      <ProductCard product={product} preferredColors={["terracota"]} locale="pt-BR" />,
    );
    expect(
      screen.getByRole("img", { name: "Tênis Corrida Leve na cor Terracota" }),
    ).toBeInTheDocument();
  });

  it("toggles the wishlist", async () => {
    const user = userEvent.setup();
    renderWithI18n(<ProductCard product={product} locale="pt-BR" />);

    await user.click(
      screen.getByRole("button", { name: /Adicionar Tênis Corrida Leve aos favoritos/ }),
    );
    expect(useWishlistStore.getState().productIds).toEqual([product.id]);

    const remove = screen.getByRole("button", { name: /Remover Tênis Corrida Leve dos favoritos/ });
    expect(remove).toHaveAttribute("aria-pressed", "true");
    await user.click(remove);
    expect(useWishlistStore.getState().productIds).toEqual([]);
  });
});
