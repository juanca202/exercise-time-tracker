import { describe, expect, it } from "vitest";
import {
  fechaCalendarioALocal,
  fechaLocalACalendario,
} from "./fecha-calendario";

describe("fechaCalendarioALocal", () => {
  it("conserva el día calendario local ingresado", () => {
    // Arrange
    const fechaCalendario = "2026-07-10";

    // Act
    const fecha = fechaCalendarioALocal(fechaCalendario);

    // Assert: el día calendario local debe seguir siendo el 10, sin importar
    // el offset UTC del entorno de ejecución (evita el corrimiento de día
    // que produciría `new Date("2026-07-10")`, interpretado como UTC).
    expect(fecha.getFullYear()).toBe(2026);
    expect(fecha.getMonth()).toBe(6);
    expect(fecha.getDate()).toBe(10);
  });

  it("produce fechas distintas para días consecutivos", () => {
    expect(fechaCalendarioALocal("2026-07-10").getTime()).not.toBe(
      fechaCalendarioALocal("2026-07-11").getTime(),
    );
  });
});

describe("fechaLocalACalendario", () => {
  it("formatea un Date a su día calendario local YYYY-MM-DD", () => {
    // Arrange
    const fecha = new Date(2026, 0, 5, 23, 45);

    // Act & Assert
    expect(fechaLocalACalendario(fecha)).toBe("2026-01-05");
  });

  it("es la inversa de fechaCalendarioALocal para el día calendario", () => {
    // Arrange
    const fechaCalendario = "2026-12-31";

    // Act
    const ida = fechaCalendarioALocal(fechaCalendario);
    const vuelta = fechaLocalACalendario(ida);

    // Assert
    expect(vuelta).toBe(fechaCalendario);
  });
});
