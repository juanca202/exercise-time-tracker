import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { Sidebar } from "./Sidebar";

describe("Sidebar", () => {
  it("renderiza los tres enlaces de navegación apuntando a sus rutas finales", () => {
    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByRole("link", { name: "Tareas" })).toHaveAttribute(
      "href",
      "/tareas",
    );
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "href",
      "/proyectos",
    );
    expect(
      screen.getByRole("link", { name: "Historial de registros" }),
    ).toHaveAttribute("href", "/historial");
  });

  it("muestra el nombre de la aplicación", () => {
    // Act
    render(<Sidebar />);

    // Assert
    expect(
      screen.getByRole("heading", { name: "TimeTracker" }),
    ).toBeInTheDocument();
  });
});
