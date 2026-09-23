import { describe, expect, it } from "vitest";

describe("test environment", () => {
  it("runs with jsdom", () => {
    expect(typeof window).toBe("object");
    expect(document.createElement("div")).toBeInstanceOf(HTMLElement);
  });
});
