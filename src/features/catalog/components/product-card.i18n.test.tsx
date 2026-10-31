import { screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import { renderWithI18n } from "@/test/render";

import { getProductBySlug } from "../queries";
import { ProductCard } from "./product-card";

describe("ProductCard in each language", () => {
  it("renders Portuguese copy and pt-BR formatting", () => {
    const product = getProductBySlug("tenis-corrida-leve", "pt-BR")!;
    renderWithI18n(<ProductCard product={product} isNew locale="pt-BR" />);

    expect(screen.getByRole("link", { name: "Tênis Corrida Leve" })).toBeInTheDocument();
    expect(screen.getByText("Novo")).toBeInTheDocument();
    expect(screen.getByText(/^R\$\s499,90$/)).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Avaliação 4,7 de 5/ })).toBeInTheDocument();
    expect(screen.getByRole("list", { name: "Cores disponíveis" })).toBeInTheDocument();
  });

  it("renders English copy and en formatting, still in BRL", () => {
    const product = getProductBySlug("tenis-corrida-leve", "en")!;
    renderWithI18n(<ProductCard product={product} isNew locale="en" />, { locale: "en" });

    const link = screen.getByRole("link", { name: "Lightweight Running Shoes" });
    expect(link.getAttribute("href")).toMatch(/^\/en\/produto\/tenis-corrida-leve\/?$/);
    expect(screen.getByText("New")).toBeInTheDocument();
    expect(screen.getByText("R$499.90")).toBeInTheDocument();
    expect(screen.getByRole("img", { name: /Rated 4\.7 out of 5/ })).toBeInTheDocument();
    expect(
      screen.getByRole("img", { name: "Lightweight Running Shoes in Royal blue" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Add Lightweight Running Shoes to wishlist" }),
    ).toBeInTheDocument();
  });
});
