import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { AppShell } from "./AppShell";

describe("AppShell", () => {
  it("muestra el nombre de la app, el subtítulo de la sección activa y el contenido", () => {
    render(
      <AppShell activeNav="projects">
        <p>Contenido de la sección</p>
      </AppShell>,
    );

    expect(screen.getByRole("heading", { name: "TimeTracker" })).toBeVisible();
    expect(screen.getByText("Proyectos", { selector: "p" })).toBeVisible();
    expect(screen.getByText("Contenido de la sección")).toBeVisible();
  });

  it("renderiza un link de navegación por cada sección y marca la activa", () => {
    render(
      <AppShell activeNav="tasks">
        <div />
      </AppShell>,
    );

    const tasksLink = screen.getByRole("link", { name: "Tareas" });
    const projectsLink = screen.getByRole("link", { name: "Proyectos" });
    const historyLink = screen.getByRole("link", {
      name: "Historial de registros",
    });

    expect(tasksLink).toHaveAttribute("href", "/tasks");
    expect(projectsLink).toHaveAttribute("href", "/projects");
    expect(historyLink).toHaveAttribute("href", "/history");

    expect(tasksLink.className).toContain("font-bold");
    expect(projectsLink.className).not.toContain("font-bold");
    expect(historyLink.className).not.toContain("font-bold");
  });

  it("muestra la acción principal del header cuando se provee", () => {
    render(
      <AppShell
        activeNav="history"
        headerAction={<button>Nuevo Proyecto</button>}
      >
        <div />
      </AppShell>,
    );

    expect(
      screen.getByRole("button", { name: "Nuevo Proyecto" }),
    ).toBeVisible();
  });
});
