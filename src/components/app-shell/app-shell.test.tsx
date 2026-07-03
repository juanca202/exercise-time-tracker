import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/projects",
}));

describe("AppShell", () => {
  it("marks the link matching the current path as active", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(screen.getByRole("link", { name: "Tareas" })).not.toHaveAttribute(
      "aria-current",
    );
  });

  it("renders the children inside the main content area", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByText("contenido")).toBeInTheDocument();
  });

  it("renders the three navigation links", () => {
    render(
      <AppShell>
        <p>contenido</p>
      </AppShell>,
    );

    expect(screen.getByRole("link", { name: "Tareas" })).toHaveAttribute(
      "href",
      "/",
    );
    expect(screen.getByRole("link", { name: "Proyectos" })).toHaveAttribute(
      "href",
      "/projects",
    );
    expect(
      screen.getByRole("link", { name: "Historial de Registros" }),
    ).toHaveAttribute("href", "/history");
  });
});
