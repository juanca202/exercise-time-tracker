import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import type { FilaHistorial } from "../hooks/useHistorialRegistros";
import { formatearFecha } from "../utils/formatearDuracion";
import { TablaHistorial } from "./TablaHistorial";

describe("TablaHistorial", () => {
  it("renderiza las columnas en el orden Fecha, Proyecto, Tarea, Duración (frame Figma)", () => {
    // Arrange
    const proyecto = crearProyectoDePrueba({ nombre: "Alfa" });
    const tarea = crearTareaDePrueba({
      nombre: "Diseño UI",
      proyectoId: proyecto.id,
    });
    const registro = crearRegistroDeTiempoDePrueba({
      tareaId: tarea.id,
      fecha: "2026-05-10",
      duracionMinutos: 90,
    });
    const filas: FilaHistorial[] = [{ registro, tarea, proyecto }];

    // Act
    render(<TablaHistorial filas={filas} />);

    // Assert: orden de cabeceras
    const cabeceras = screen.getAllByRole("columnheader");
    expect(cabeceras.map((th) => th.textContent)).toEqual([
      "Fecha",
      "Proyecto",
      "Tarea",
      "Duración",
    ]);

    // Assert: la fila de datos respeta ese mismo orden
    const filasDeCuerpo = screen.getAllByRole("row").slice(1);
    expect(filasDeCuerpo).toHaveLength(1);
    const celdas = within(filasDeCuerpo[0]).getAllByRole("cell");
    expect(celdas.map((td) => td.textContent)).toEqual([
      formatearFecha("2026-05-10"),
      "Alfa",
      "Diseño UI",
      "1h 30m",
    ]);
  });

  it("un Registro sin Proyecto resuelto muestra un guion en la columna Proyecto", () => {
    // Arrange
    const tarea = crearTareaDePrueba({ nombre: "Backend API" });
    const registro = crearRegistroDeTiempoDePrueba({ tareaId: tarea.id });
    const filas: FilaHistorial[] = [{ registro, tarea, proyecto: undefined }];

    // Act
    render(<TablaHistorial filas={filas} />);

    // Assert
    const filaDeCuerpo = screen.getAllByRole("row")[1];
    expect(within(filaDeCuerpo).getByText("—")).toBeInTheDocument();
  });
});
