import { describe, expect, it } from "vitest";
import { isValidDuration } from "./isValidDuration";

describe("isValidDuration", () => {
  it("rechaza una duración igual a cero", () => {
    expect(isValidDuration(0)).toBe(false);
  });

  it("rechaza una duración negativa", () => {
    expect(isValidDuration(-1)).toBe(false);
  });

  it("acepta la duración mínima válida (mayor que cero)", () => {
    expect(isValidDuration(1)).toBe(true);
  });

  it("acepta una duración mayor", () => {
    expect(isValidDuration(90 * 60 * 1000)).toBe(true);
  });
});
