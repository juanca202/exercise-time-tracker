import { describe, expect, it } from "vitest";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { calcularTotalPorMes } from "./calcularTotalPorMes";
import { obtenerTotal } from "./calcularTotalPorTarea";

describe("calcularTotalPorMes", () => {
  it("TC-010: suma exacta de duraciones por mes en meses distintos", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-05-10",
        duracionMinutos: 90,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-05-12",
        duracionMinutos: 45,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-06-01",
        duracionMinutos: 120,
      }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-05")).toBe(135);
    expect(obtenerTotal(totales, "2026-06")).toBe(120);
  });

  it("TC-011: un Registro con fecha inválida no corrompe los totales de meses válidos", () => {
    // Arrange
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-06-01",
        duracionMinutos: 120,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-13-45",
        duracionMinutos: 30,
      }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-06")).toBe(120);
    expect(totales.size).toBe(1);
  });

  it("TC-012: un Registro de temporizador se atribuye íntegro al mes de su Fecha (Hora de Inicio)", () => {
    // Arrange: el dominio compartido ya resuelve un Registro de Tiempo a un
    // único día calendario (`fecha`, la Hora de Inicio real cuando el origen
    // es "temporizador"), por lo que un Registro que cruzó la medianoche de
    // fin de mes al detener el temporizador ya llega aquí atribuido al mes
    // de inicio (2026-07): esta prueba confirma que `calcularTotalPorMes` no
    // introduce ningún prorrateo ni recalcula un segundo mes a partir de la
    // duración.
    const registros = [
      crearRegistroDeTiempoDePrueba({
        origen: "temporizador",
        fecha: "2026-07-31",
        duracionMinutos: 120,
      }),
    ];

    // Act
    const totales = calcularTotalPorMes(registros);

    // Assert
    expect(obtenerTotal(totales, "2026-07")).toBe(120);
    expect(obtenerTotal(totales, "2026-08")).toBe(0);
  });
});
