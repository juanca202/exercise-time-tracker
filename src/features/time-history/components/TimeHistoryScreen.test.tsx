import { useProjectsStore } from "@/features/projects";
import { useTasksStore } from "@/features/tasks";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { TimeHistoryScreen } from "./TimeHistoryScreen";

describe("TimeHistoryScreen", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 15, 12, 0, 0)); // 15 de julio de 2026

    useProjectsStore.setState({
      projects: [
        {
          id: "project-website",
          name: "Website",
          createdAt: new Date(2026, 5, 1).toISOString(),
        },
        {
          id: "project-app",
          name: "App Móvil",
          createdAt: new Date(2026, 5, 1).toISOString(),
        },
      ],
    });
    useTasksStore.setState({
      tasks: [
        {
          id: "task-diseno",
          projectId: "project-website",
          name: "Diseño",
          createdAt: new Date(2026, 5, 1).toISOString(),
        },
        {
          id: "task-qa",
          projectId: "project-app",
          name: "QA",
          createdAt: new Date(2026, 5, 1).toISOString(),
        },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-diseno",
          startedAt: new Date(2026, 6, 8).toISOString(),
          endedAt: new Date(2026, 6, 8).toISOString(),
          durationMs: (1 * 60 + 30) * 60_000,
          source: "manual",
        },
        {
          id: "e2",
          taskId: "task-qa",
          startedAt: new Date(2026, 6, 10).toISOString(),
          endedAt: new Date(2026, 6, 10).toISOString(),
          durationMs: 45 * 60_000,
          source: "manual",
        },
        {
          id: "e3",
          taskId: "task-qa",
          startedAt: new Date(2026, 5, 20).toISOString(),
          endedAt: new Date(2026, 5, 20).toISOString(),
          durationMs: 2 * 60 * 60_000,
          source: "manual",
        },
      ],
      activeTimer: null,
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el mes actual con las Tareas, totales por Proyecto y el resumen del periodo (TC-001/005/012)", () => {
    render(<TimeHistoryScreen />);

    expect(screen.getByText("Julio 2026")).toBeVisible();
    expect(screen.getByRole("cell", { name: "Diseño" })).toBeVisible();
    expect(screen.getByRole("cell", { name: "QA" })).toBeVisible();

    // Total del Proyecto "Website" en julio: 1h 30m (solo la entrada e1); "App Móvil": 45m (e2).
    expect(screen.getByText("1h 30m")).toBeVisible();
    expect(screen.getByText("0h 45m")).toBeVisible();

    // Resumen: 2 registros (e1, e2 — e3 es de junio), 2 Proyectos, 2h 15m totales.
    expect(screen.getByText("2 registros")).toBeVisible();
    expect(screen.getByText("2 proyectos")).toBeVisible();
    expect(screen.getByText("02:15:00")).toBeVisible();
  });

  it("navega al mes anterior y recalcula el total, mostrando el Registro de junio (TC-006/008)", async () => {
    render(<TimeHistoryScreen />);
    // La navegación es solo estado local (no depende del reloj); se libera para que userEvent no se cuelgue.
    vi.useRealTimers();
    const user = userEvent.setup();

    await user.click(screen.getByRole("button", { name: "Mes anterior" }));

    expect(screen.getByText("Junio 2026")).toBeVisible();
    expect(screen.getByRole("cell", { name: "QA" })).toBeVisible();
    expect(
      screen.queryByRole("cell", { name: "Diseño" }),
    ).not.toBeInTheDocument();

    // Total del Proyecto "Website" en junio: 0 (sin Registros en ese mes).
    expect(screen.getAllByText("0h 00m")).toHaveLength(1);
  });

  it("muestra el estado vacío y el resumen en cero al navegar a un mes sin Registros (TC-002/009/013)", async () => {
    render(<TimeHistoryScreen />);
    vi.useRealTimers();
    const user = userEvent.setup();

    // Mayo 2026: no tiene Registros de Tiempo.
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));

    expect(screen.getByText("Mayo 2026")).toBeVisible();
    expect(
      screen.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeVisible();
    expect(screen.getByText("0 registros")).toBeVisible();
    expect(screen.getByText("0 proyectos")).toBeVisible();
    expect(screen.getByText("00:00:00")).toBeVisible();
  });
});
