import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import { AppShell } from "./app-shell";

describe("AppShell", () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectStore.setState({ projects: [] });
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  it('muestra la pestaña "Proyectos" activa por defecto', () => {
    // Act
    render(<AppShell />);

    // Assert
    expect(screen.getByRole("button", { name: "Proyectos" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByText(/todavía no hay proyectos creados/i),
    ).toBeInTheDocument();
  });

  it('cambia a la pantalla "Tareas" al seleccionar su pestaña', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<AppShell />);

    // Act
    await user.click(screen.getByRole("button", { name: "Tareas" }));

    // Assert
    expect(screen.getByRole("button", { name: "Tareas" })).toHaveAttribute(
      "aria-current",
      "page",
    );
    expect(
      screen.getByText(/todavía no hay tareas creadas/i),
    ).toBeInTheDocument();
  });
});
