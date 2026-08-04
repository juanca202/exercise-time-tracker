import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { SidebarNav } from "./sidebar-nav";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("SidebarNav", () => {
  it("muestra un enlace por cada sección", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<SidebarNav />);

    expect(screen.getByRole("link", { name: "Tareas" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Proyectos" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "Historial de registros" }),
    ).toBeInTheDocument();
  });

  it("marca como activa la sección que coincide con la ruta actual", () => {
    vi.mocked(usePathname).mockReturnValue("/proyectos");

    render(<SidebarNav />);

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
    );
  });
});
