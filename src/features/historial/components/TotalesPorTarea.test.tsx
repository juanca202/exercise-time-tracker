import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { crearTareaDePrueba } from "@/shared/domain/object-mother";
import { TotalesPorTarea } from "./TotalesPorTarea";

describe("TotalesPorTarea", () => {
  it("no renderiza nada cuando no hay Tareas", () => {
    // Act
    const { container } = render(
      <TotalesPorTarea tareas={[]} totalesPorTarea={new Map()} />,
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("alterna el fondo zebra-stripe entre filas pares e impares", () => {
    // Arrange
    const tareaUno = crearTareaDePrueba({ nombre: "Diseño UI" });
    const tareaDos = crearTareaDePrueba({ nombre: "Backend API" });

    // Act
    render(
      <TotalesPorTarea
        tareas={[tareaUno, tareaDos]}
        totalesPorTarea={new Map([[tareaUno.id, 90]])}
      />,
    );

    // Assert
    const filaUno = screen.getByText("Diseño UI").closest("li");
    const filaDos = screen.getByText("Backend API").closest("li");
    expect(filaUno?.className).not.toContain("bg-surface-container-low");
    expect(filaDos?.className).toContain("bg-surface-container-low");
    // Una Tarea sin Registros resuelve a "0 min" (AC-002).
    expect(screen.getByText("0 min")).toBeInTheDocument();
    expect(screen.getByText("1h 30m")).toBeInTheDocument();
  });
});
