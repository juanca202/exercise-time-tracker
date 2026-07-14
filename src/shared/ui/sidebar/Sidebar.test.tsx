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
    render(<Sidebar />);

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

  it("marca como activo el ítem correspondiente a la ruta actual", () => {
    usePathnameMock.mockReturnValue("/proyectos");
    render(<Sidebar />);

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
