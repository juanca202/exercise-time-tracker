import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import { TotalesPorProyecto } from "./TotalesPorProyecto";

describe("TotalesPorProyecto", () => {
  it("destaca la tarjeta del Proyecto con más tiempo acumulado (borde izquierdo secondary)", () => {
    // Arrange
    const proyectoAlfa = crearProyectoDePrueba({ nombre: "Alfa" });
    const proyectoBeta = crearProyectoDePrueba({ nombre: "Beta" });
    const totalesPorProyecto = new Map([
      [proyectoAlfa.id, 60],
      [proyectoBeta.id, 780],
    ]);

    // Act
    render(
      <TotalesPorProyecto
        proyectos={[proyectoAlfa, proyectoBeta]}
        totalesPorProyecto={totalesPorProyecto}
      />,
    );

    // Assert: la tarjeta de Beta (más tiempo) lleva el acento "destacado".
    const tarjetaBeta = screen
      .getByText("Beta")
      .closest("div.rounded-precision-lg");
    const tarjetaAlfa = screen
      .getByText("Alfa")
      .closest("div.rounded-precision-lg");
    expect(tarjetaBeta?.className).toContain("border-l-secondary");
    expect(tarjetaAlfa?.className).not.toContain("border-l-secondary");
  });

  it("no destaca ninguna tarjeta cuando todos los totales son 0", () => {
    // Arrange
    const proyectoAlfa = crearProyectoDePrueba({ nombre: "Alfa" });
    const proyectoBeta = crearProyectoDePrueba({ nombre: "Beta" });

    // Act
    render(
      <TotalesPorProyecto
        proyectos={[proyectoAlfa, proyectoBeta]}
        totalesPorProyecto={new Map()}
      />,
    );

    // Assert
    const tarjetaBeta = screen
      .getByText("Beta")
      .closest("div.rounded-precision-lg");
    const tarjetaAlfa = screen
      .getByText("Alfa")
      .closest("div.rounded-precision-lg");
    expect(tarjetaBeta?.className).not.toContain("border-l-secondary");
    expect(tarjetaAlfa?.className).not.toContain("border-l-secondary");
  });

  it("no renderiza nada cuando no hay Proyectos", () => {
    // Act
    const { container } = render(
      <TotalesPorProyecto proyectos={[]} totalesPorProyecto={new Map()} />,
    );

    // Assert
    expect(container).toBeEmptyDOMElement();
  });
});
