import { describe, expect, it } from "vitest";
import { parsearDuracionHHMM } from "./parsear-duracion-hhmm";

describe("parsearDuracionHHMM", () => {
  it("parsea horas y minutos a minutos totales", () => {
    expect(parsearDuracionHHMM("02:30")).toBe(150);
  });

  it("parsea un valor sin ceros a la izquierda en las horas", () => {
    expect(parsearDuracionHHMM("2:05")).toBe(125);
  });

  it("acepta minutos igual a 59", () => {
    expect(parsearDuracionHHMM("0:59")).toBe(59);
  });

  it("tolera espacios alrededor del valor", () => {
    expect(parsearDuracionHHMM("  01:00  ")).toBe(60);
  });

  it("devuelve null cuando los minutos son inválidos (>= 60)", () => {
    expect(parsearDuracionHHMM("01:60")).toBeNull();
  });

  it("devuelve null ante un formato sin separador", () => {
    expect(parsearDuracionHHMM("0130")).toBeNull();
  });

  it("devuelve null ante una cadena vacía", () => {
    expect(parsearDuracionHHMM("")).toBeNull();
  });

  it("devuelve null ante texto no numérico", () => {
    expect(parsearDuracionHHMM("ab:cd")).toBeNull();
  });
});
