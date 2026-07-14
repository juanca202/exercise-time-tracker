import { describe, expect, it } from "vitest";
import type { RegistroDeTiempo } from "../domain";
import { obtenerMesCalendario } from "./mes-calendario";

/** Object Mother: Registro de Tiempo con un `inicio` parametrizable. */
const unRegistro = (inicio: string): RegistroDeTiempo => ({
  id: "registro-1",
  tareaId: "tarea-1",
  inicio,
  fin: inicio,
  duracionSegundos: 0,
  creadoEn: inicio,
});

describe("obtenerMesCalendario", () => {
  it("devuelve el mes calendario en formato YYYY-MM para una fecha a mitad de mes", () => {
    expect(obtenerMesCalendario(unRegistro("2026-07-13T10:00:00.000Z"))).toBe(
      "2026-07",
    );
  });

  it("devuelve el mes correcto para el primer día del mes", () => {
    expect(obtenerMesCalendario(unRegistro("2026-01-01T00:00:00.000Z"))).toBe(
      "2026-01",
    );
  });

  it("devuelve el mes correcto para el último día del mes", () => {
    expect(obtenerMesCalendario(unRegistro("2026-12-31T23:59:59.999Z"))).toBe(
      "2026-12",
    );
  });

  it("devuelve el mismo resultado para el mismo registro sin importar quién la invoque", () => {
    const registro = unRegistro("2027-02-28T12:00:00.000Z");

    expect(obtenerMesCalendario(registro)).toBe(obtenerMesCalendario(registro));
  });
});
