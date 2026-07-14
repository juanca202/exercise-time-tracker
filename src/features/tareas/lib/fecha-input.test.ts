import { describe, expect, it } from "vitest";
import { fechaInputALocalIso } from "./fecha-input";

describe("fechaInputALocalIso", () => {
  it("conserva el día calendario local ingresado en el input de fecha", () => {
    // Arrange
    const valorInput = "2026-07-10";

    // Act
    const iso = fechaInputALocalIso(valorInput);
    const fecha = new Date(iso);

    // Assert: el día calendario local debe seguir siendo el 10, sin importar
    // el offset UTC del entorno de ejecución (evita el corrimiento de día
    // que produciría `new Date("2026-07-10")`, interpretado como UTC).
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(6);
    expect(fecha.getDate()).toBe(10);
  });

  it("produce fechas distintas para días consecutivos", () => {
    expect(fechaInputALocalIso("2026-07-10")).not.toBe(
      fechaInputALocalIso("2026-07-11"),
    );
  });
});
