import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { MetaSemanalWidget } from "./MetaSemanalWidget";
import { fechaLocalIso, unRegistroDeTiempo } from "../testing/object-mother";

describe("MetaSemanalWidget", () => {
  it("muestra la Meta Semanal fija de 40h sin ningún control de edición (AC-017)", () => {
    // Arrange & Act
    render(
      <MetaSemanalWidget registros={[]} fecha={new Date(2026, 6, 13, 8, 0)} />,
    );

    // Assert
    expect(screen.getByText(/40\.0h/)).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("calcula y muestra el Total Semanal y el porcentaje por debajo de la meta (TC-023)", () => {
    // Arrange: Lunes 2026-07-13, 20h acumuladas de 40h -> 50%
    const registros = [
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 13, 9),
        duracionMs: 20 * 60 * 60 * 1000,
      }),
    ];

    // Act
    render(
      <MetaSemanalWidget
        registros={registros}
        fecha={new Date(2026, 6, 13, 8, 0)}
      />,
    );

    // Assert
    expect(screen.getByText(/20\.0h/)).toBeInTheDocument();
    expect(screen.getByText(/50%/)).toBeInTheDocument();
    expect(screen.getByRole("progressbar")).toHaveAttribute(
      "aria-valuenow",
      "50",
    );
  });

  it("muestra el porcentaje por encima del 100% sin truncar (AC-019, TC-023)", () => {
    // Arrange: Lunes 2026-07-13, 44h acumuladas de 40h -> 110%
    const registros = [
      unRegistroDeTiempo({
        fecha: fechaLocalIso(2026, 6, 13, 9),
        duracionMs: 44 * 60 * 60 * 1000,
      }),
    ];

    // Act
    render(
      <MetaSemanalWidget
        registros={registros}
        fecha={new Date(2026, 6, 13, 8, 0)}
      />,
    );

    // Assert
    expect(screen.getByText(/110%/)).toBeInTheDocument();
  });
});
