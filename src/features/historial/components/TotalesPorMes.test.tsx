import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TotalesPorMes } from "./TotalesPorMes";

describe("TotalesPorMes", () => {
  it("no renderiza nada cuando no hay meses con totales", () => {
    // Act
    const { container } = render(<TotalesPorMes totalesPorMes={new Map()} />);

    // Assert
    expect(container).toBeEmptyDOMElement();
  });

  it("ordena los meses cronológicamente y alterna el fondo zebra-stripe", () => {
    // Arrange
    const totalesPorMes = new Map([
      ["2026-06", 120],
      ["2026-01", 60],
    ]);

    // Act
    render(<TotalesPorMes totalesPorMes={totalesPorMes} />);

    // Assert: orden cronológico ascendente (enero antes que junio).
    const filas = screen.getAllByRole("listitem");
    expect(filas.map((fila) => fila.textContent)).toEqual([
      "Enero 20261h",
      "Junio 20262h",
    ]);
    expect(filas[0].className).not.toContain("bg-surface-container-low");
    expect(filas[1].className).toContain("bg-surface-container-low");
  });
});
