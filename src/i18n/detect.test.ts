import { beforeEach, describe, expect, it } from "vitest";

import { LOCALE_STORAGE_KEY } from "./config";
import { detectLocale, matchLocale, readSavedLocale, saveLocale } from "./detect";

describe("matchLocale", () => {
  it("maps any Portuguese or English variant to a supported locale", () => {
    expect(matchLocale("pt")).toBe("pt-BR");
    expect(matchLocale("pt-PT")).toBe("pt-BR");
    expect(matchLocale("EN-gb")).toBe("en");
    expect(matchLocale("es-ES")).toBeNull();
  });
});

describe("detectLocale", () => {
  it("prefers the saved choice over the browser language", () => {
    expect(detectLocale({ saved: "en", languages: ["pt-BR"] })).toBe("en");
  });

  it("ignores invalid saved values and uses the first supported browser language", () => {
    expect(detectLocale({ saved: "fr", languages: ["es-ES", "pt-BR", "en"] })).toBe("pt-BR");
    expect(detectLocale({ saved: null, languages: ["en-US"] })).toBe("en");
  });

  it("falls back to English for other languages and to pt-BR without any", () => {
    expect(detectLocale({ saved: null, languages: ["de-DE"] })).toBe("en");
    expect(detectLocale({ saved: null, languages: [] })).toBe("pt-BR");
  });
});

describe("saved locale", () => {
  beforeEach(() => window.localStorage.clear());

  it("persists the choice in localStorage", () => {
    expect(readSavedLocale()).toBeNull();
    saveLocale("en");
    expect(window.localStorage.getItem(LOCALE_STORAGE_KEY)).toBe("en");
    expect(readSavedLocale()).toBe("en");
  });
});
