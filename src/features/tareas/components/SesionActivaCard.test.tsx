import { describe, expect, it, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { SesionActivaCard } from "./SesionActivaCard";

describe("SesionActivaCard", () => {
  it("muestra un estado vacío cuando no hay ninguna sesión en curso", () => {
    // Arrange & Act
    render(<SesionActivaCard onDetener={vi.fn()} />);

    // Assert
    expect(
      screen.getByText("No tienes ninguna sesión en curso."),
    ).toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: "Detener Sesión" }),
    ).not.toBeInTheDocument();
  });

  it("muestra la Tarea, el Proyecto, la hora de inicio y el botón de detener cuando hay una sesión activa", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const onDetener = vi.fn();
    render(
      <SesionActivaCard
        nombreTarea="Refinar logotipos"
        nombreProyecto="Brand Redesign"
        horaInicio={new Date(2026, 6, 13, 9, 15).toISOString()}
        onDetener={onDetener}
      />,
    );

    // Assert
    expect(screen.getByText("Refinar logotipos")).toBeInTheDocument();
    expect(screen.getByText("Brand Redesign")).toBeInTheDocument();
    expect(screen.getByText(/Iniciado a las 09:15 AM/)).toBeInTheDocument();

    // Act
    await usuario.click(screen.getByRole("button", { name: "Detener Sesión" }));

    // Assert
    expect(onDetener).toHaveBeenCalled();
  });
});
