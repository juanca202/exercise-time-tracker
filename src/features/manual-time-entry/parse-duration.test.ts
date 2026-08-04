import { describe, expect, it } from "vitest";
import { parseDurationInput } from "./parse-duration";

describe("parseDurationInput", () => {
  it('convierte "02:30" a 9000 segundos', () => {
    expect(parseDurationInput("02:30")).toBe(9000);
  });

  it('convierte "00:01" a 60 segundos', () => {
    expect(parseDurationInput("00:01")).toBe(60);
  });

  it("acepta más de 99 horas", () => {
    expect(parseDurationInput("120:00")).toBe(120 * 3600);
  });

  it("devuelve null para un formato inválido", () => {
    expect(parseDurationInput("abc")).toBeNull();
    expect(parseDurationInput("02:60")).toBeNull();
    expect(parseDurationInput("2:3")).toBeNull();
    expect(parseDurationInput("")).toBeNull();
  });
});
