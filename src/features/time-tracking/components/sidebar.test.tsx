import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { Sidebar } from "./sidebar";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("Sidebar", () => {
  it("should_mark_the_link_matching_the_current_route_as_active", () => {
    // Arrange & Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
  });

  it("should_not_mark_other_links_as_active", () => {
    // Arrange & Act
    render(<Sidebar />);

    // Assert
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
    );
    expect(
      screen.getByRole("link", { name: "Historial de Registros" }),
    ).not.toHaveAttribute("aria-current");
  });
});
