import { describe, expect, it } from "vitest";

import { createRoutes, switchLocalePath } from "./routes";

describe("createRoutes", () => {
  it("prefixes every route with the locale", () => {
    const routes = createRoutes("en");
    expect(routes.home).toBe("/en/");
    expect(routes.product("tenis-trail")).toBe("/en/produto/tenis-trail/");
    expect(routes.category("bones")).toBe("/en/produtos/?categoria=bones");
  });
});

describe("switchLocalePath", () => {
  it("swaps only the locale segment", () => {
    expect(switchLocalePath("/pt-BR/produto/tenis-trail/", "en")).toBe("/en/produto/tenis-trail/");
    expect(switchLocalePath("/en/", "pt-BR")).toBe("/pt-BR/");
  });

  it("falls back to the locale home for the root path", () => {
    expect(switchLocalePath("/", "en")).toBe("/en/");
  });
});
