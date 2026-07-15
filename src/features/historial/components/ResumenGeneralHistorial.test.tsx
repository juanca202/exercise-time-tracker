import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import type { FilaHistorial } from "../hooks/useHistorialRegistros";
import { ResumenGeneralHistorial } from "./ResumenGeneralHistorial";

describe("ResumenGeneralHistorial", () => {
  it("suma la duración de todas las filas y muestra el conteo de registros y Proyectos", () => {
    // Arrange
    const proyecto = crearProyectoDePrueba();
    const tarea = crearTareaDePrueba({ proyectoId: proyecto.id });
    const filas: FilaHistorial[] = [
      {
        registro: crearRegistroDeTiempoDePrueba({
          tareaId: tarea.id,
          duracionMinutos: 90,
        }),
        tarea,
        proyecto,
      },
      {
        registro: crearRegistroDeTiempoDePrueba({
          tareaId: tarea.id,
          duracionMinutos: 45,
        }),
        tarea,
        proyecto,
      },
    ];

    // Act
    render(<ResumenGeneralHistorial filas={filas} cantidadProyectos={1} />);

    // Assert
    expect(screen.getByText("2 registros")).toBeInTheDocument();
    expect(screen.getByText("1 proyecto")).toBeInTheDocument();
    // 90 + 45 = 135 minutos = "2h 15m" (formatearDuracion).
    expect(screen.getByText("2h 15m")).toBeInTheDocument();
  });

  it("usa singular cuando hay exactamente 1 registro y 1 proyecto, y '0 min' sin filas", () => {
    // Act
    render(<ResumenGeneralHistorial filas={[]} cantidadProyectos={0} />);

    // Assert
    expect(screen.getByText("0 registros")).toBeInTheDocument();
    expect(screen.getByText("0 proyectos")).toBeInTheDocument();
    expect(screen.getByText("0 min")).toBeInTheDocument();
  });
});
