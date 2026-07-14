import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { crearRegistroDeTiempoDePrueba } from "@/shared/domain/object-mother";
import { ResumenTareas } from "./ResumenTareas";

describe("ResumenTareas", () => {
  it("muestra el título 'Tareas' y no expone ningún control de edición de la Meta Semanal (AC-017)", () => {
    // Arrange & Act
    render(
      <ResumenTareas registros={[]} fecha={new Date(2026, 6, 13, 8, 0)} />,
    );

    // Assert
    expect(
      screen.getByRole("heading", { name: "Tareas", level: 1 }),
    ).toBeInTheDocument();
    expect(screen.queryByRole("spinbutton")).not.toBeInTheDocument();
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
  });

  it("muestra 0h 0m y 0% cuando no hay Registros", () => {
    // Arrange & Act
    render(
      <ResumenTareas registros={[]} fecha={new Date(2026, 6, 13, 8, 0)} />,
    );

    // Assert
    expect(screen.getByText(/0%/)).toBeInTheDocument();
    expect(screen.getAllByText("0h 0m")).toHaveLength(2); // Total Semanal + Total Mensual
  });

  it("calcula y muestra el Total Semanal y el porcentaje por debajo de la meta (TC-022)", () => {
    // Arrange: Lunes 2026-07-13, 20h acumuladas de 40h -> 50%
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 20 * 60,
      }),
    ];

    // Act
    render(
      <ResumenTareas
        registros={registros}
        fecha={new Date(2026, 6, 13, 8, 0)}
      />,
    );

    // Assert: el Registro cae dentro de la semana y del mes en curso, así
    // que ambas tarjetas de stat muestran el mismo total.
    expect(screen.getAllByText("20h 0m")).toHaveLength(2);
    expect(screen.getByText(/50%/)).toBeInTheDocument();
  });

  it("muestra el porcentaje por encima del 100% sin truncar (AC-019, TC-023)", () => {
    // Arrange: Lunes 2026-07-13, 44h acumuladas de 40h -> 110%
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 44 * 60,
      }),
    ];

    // Act
    render(
      <ResumenTareas
        registros={registros}
        fecha={new Date(2026, 6, 13, 8, 0)}
      />,
    );

    // Assert
    expect(screen.getByText(/110%/)).toBeInTheDocument();
  });

  it("calcula el Total Mensual de forma independiente del Total Semanal (TC-020)", () => {
    // Arrange: fecha actual 2026-07-13; un Registro fuera de la semana en
    // curso pero dentro del mismo mes calendario.
    const registros = [
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-01",
        duracionMinutos: 5 * 60,
      }),
      crearRegistroDeTiempoDePrueba({
        fecha: "2026-07-13",
        duracionMinutos: 2 * 60,
      }),
    ];

    // Act
    render(
      <ResumenTareas
        registros={registros}
        fecha={new Date(2026, 6, 13, 8, 0)}
      />,
    );

    // Assert: Total Semanal = 2h (solo el registro del 2026-07-13), Total Mensual = 7h (ambos)
    expect(screen.getByText("2h 0m")).toBeInTheDocument();
    expect(screen.getByText("7h 0m")).toBeInTheDocument();
  });
});
