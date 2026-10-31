import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { renderWithI18n } from "@/test/render";

import { LOCALE_STORAGE_KEY } from "./config";
import { LanguageSwitcher } from "./language-switcher";

const push = vi.fn();

vi.mock("next/navigation", () => ({
  usePathname: () => "/pt-BR/produtos/",
  useRouter: () => ({ push }),
}));

describe("LanguageSwitcher", () => {
  beforeEach(() => {
    push.mockClear();
    window.history.replaceState(null, "", "/?categoria=tenis");
  });

  it("shows both flags as links, each named in its own language", () => {
    renderWithI18n(<LanguageSwitcher />);

    const group = screen.getByRole("group", { name: "Idioma" });
    const portuguese = screen.getByRole("link", { name: "Português (Brasil)" });
    const english = screen.getByRole("link", { name: "English" });

    expect(group).toContainElement(portuguese);
    expect(group).toContainElement(english);
    expect(portuguese).toHaveAttribute("aria-current", "true");
    expect(portuguese).toHaveAttribute("lang", "pt-BR");
    expect(english).not.toHaveAttribute("aria-current");
    expect(english).toHaveAttribute("hreflang", "en");
    expect(english.getAttribute("href")).toMatch(/\/en\/produtos\/$/);
    expect(english).toHaveAttribute("title", "English");
  });

  it("navigates to the same page in English, keeps the query and saves the choice", async () => {
    const user = userEvent.setup();
    renderWithI18n(<LanguageSwitcher />);

    await user.click(screen.getByRole("link", { name: "English" }));

    expect(push).toHaveBeenCalledWith("/en/produtos/?categoria=tenis", { scroll: false });
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
  });

  it("labels the group in English on English pages", () => {
    renderWithI18n(<LanguageSwitcher />, { locale: "en" });

    expect(screen.getByRole("group", { name: "Language" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "English" })).toHaveAttribute("aria-current", "true");
  });
});
