import { describe, expect, it } from "vitest";
import { rangoSemanaLaboralActual } from "./rango-semana-laboral";

describe("rangoSemanaLaboralActual", () => {
  it("devuelve Lunes 00:00:00.000 a Viernes 23:59:59.999 cuando la fecha es Lunes", () => {
    // Arrange: Lunes 2026-07-13
    const fecha = new Date(2026, 6, 13, 10, 30);

    // Act
    const { inicio, fin } = rangoSemanaLaboralActual(fecha);

    // Assert
    expect(inicio).toEqual(new Date(2026, 6, 13, 0, 0, 0, 0));
    expect(fin).toEqual(new Date(2026, 6, 17, 23, 59, 59, 999));
  });

  it("devuelve el mismo rango cuando la fecha es Miércoles de esa semana", () => {
    // Arrange: Miércoles 2026-07-15
    const fecha = new Date(2026, 6, 15, 23, 59);

    // Act
    const { inicio, fin } = rangoSemanaLaboralActual(fecha);

    // Assert
    expect(inicio).toEqual(new Date(2026, 6, 13, 0, 0, 0, 0));
    expect(fin).toEqual(new Date(2026, 6, 17, 23, 59, 59, 999));
  });

  it("devuelve la semana laboral que precede al fin de semana cuando la fecha es Domingo", () => {
    // Arrange: Domingo 2026-07-19 pertenece a la semana calendario que inició el Lunes 2026-07-13
    const fecha = new Date(2026, 6, 19);

    // Act
    const { inicio, fin } = rangoSemanaLaboralActual(fecha);

    // Assert
    expect(inicio).toEqual(new Date(2026, 6, 13, 0, 0, 0, 0));
    expect(fin).toEqual(new Date(2026, 6, 17, 23, 59, 59, 999));
  });
});
