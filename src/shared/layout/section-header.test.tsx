import { render, screen } from "@testing-library/react";
import { usePathname } from "next/navigation";
import { describe, expect, it, vi } from "vitest";
import { SectionHeader } from "./section-header";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn(),
}));

describe("SectionHeader", () => {
  it("muestra el nombre del producto", () => {
    vi.mocked(usePathname).mockReturnValue("/");

    render(<SectionHeader />);

    expect(screen.getByText("TimeTracker")).toBeInTheDocument();
  });

  it.each([
    ["/", "Tareas"],
    ["/proyectos", "Proyectos"],
    ["/historial", "Historial de registros"],
  ])(
    'en la ruta "%s" muestra "%s" como título de sección',
    (pathname, title) => {
      vi.mocked(usePathname).mockReturnValue(pathname);

      render(<SectionHeader />);

      expect(screen.getByText(title)).toBeInTheDocument();
    },
  );
});
