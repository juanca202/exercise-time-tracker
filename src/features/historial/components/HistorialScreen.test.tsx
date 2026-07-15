import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { useAppStore } from "@/shared/store";
import { HistorialScreen } from "./HistorialScreen";

function reiniciarStore(datos?: {
  proyectos?: Proyecto[];
  tareas?: Tarea[];
  registrosDeTiempo?: RegistroDeTiempo[];
  haHidratado?: boolean;
}): void {
  useAppStore.setState({
    haHidratado: datos?.haHidratado ?? true,
    proyectos: datos?.proyectos ?? [],
    tareas: datos?.tareas ?? [],
    registrosDeTiempo: datos?.registrosDeTiempo ?? [],
    temporizadorActivo: null,
  });
}

describe("HistorialScreen", () => {
  beforeEach(() => {
    reiniciarStore();
  });

  it("TC-001: renderiza el historial completo con totales por Proyecto, Tarea y mes", () => {
    // Arrange
    const proyectoAlfa = crearProyectoDePrueba({ id: "P-1", nombre: "Alfa" });
    const tareaDiseno = crearTareaDePrueba({
      id: "T-1",
      nombre: "Diseño UI",
      proyectoId: "P-1",
    });
    reiniciarStore({
      proyectos: [proyectoAlfa],
      tareas: [tareaDiseno],
      registrosDeTiempo: [
        crearRegistroDeTiempoDePrueba({
          tareaId: "T-1",
          fecha: "2026-05-10",
          duracionMinutos: 90,
        }),
      ],
    });

    // Act
    render(<HistorialScreen />);

    // Assert
    expect(screen.getByRole("table")).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Diseño UI" })).toBeInTheDocument();
    expect(screen.getByRole("cell", { name: "Alfa" })).toBeInTheDocument();
    expect(screen.getByText("Total por Proyecto")).toBeInTheDocument();
    expect(screen.getByText("Total por Tarea")).toBeInTheDocument();
    expect(screen.getByText("Total por mes")).toBeInTheDocument();
    // Barra de resumen inferior (lenguaje visual del frame Figma).
    expect(screen.getByText("1 registro")).toBeInTheDocument();
    expect(screen.getByText("1 proyecto")).toBeInTheDocument();
  });

  it("TC-003: renderiza el estado vacío cuando no hay Registros de Tiempo", () => {
    // Act
    render(<HistorialScreen />);

    // Assert
    expect(
      screen.getByText("No hay registros de tiempo aún"),
    ).toBeInTheDocument();
    expect(screen.queryByRole("table")).not.toBeInTheDocument();
  });

  it("muestra el indicador de carga mientras el store raíz no ha hidratado", () => {
    // Arrange
    reiniciarStore({ haHidratado: false });

    // Act
    render(<HistorialScreen />);

    // Assert
    expect(screen.getByText("Cargando historial…")).toBeInTheDocument();
    expect(
      screen.queryByText("No hay registros de tiempo aún"),
    ).not.toBeInTheDocument();
  });
});
