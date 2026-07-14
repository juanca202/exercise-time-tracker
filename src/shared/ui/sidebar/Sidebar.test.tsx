import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./Sidebar";

const { usePathnameMock } = vi.hoisted(() => ({
  usePathnameMock: vi.fn(() => "/tareas"),
}));

vi.mock("next/navigation", () => ({
  usePathname: usePathnameMock,
}));

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

  // TC-014 (US-001, AC-008): marca como activo el ítem de la sección actual.
  it("marca como activo el ítem correspondiente a la ruta actual", () => {
    // Arrange
    usePathnameMock.mockReturnValue("/proyectos");

    // Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
      "page",
    );
  });
});
