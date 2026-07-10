import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useProjectStore } from "@/features/project-management";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import { HistoryPage } from "./history-page";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskTimeTrackingStore.setState({
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  });
}

describe("HistoryPage", () => {
  beforeEach(() => {
    localStorage.clear();
    resetStores();
    vi.useFakeTimers({ toFake: ["Date"] });
    vi.setSystemTime(new Date(2026, 6, 15));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("muestra el estado vacío cuando no existe ningún Registro de Tiempo (TC-002)", () => {
    // Act
    render(<HistoryPage />);

    // Assert
    expect(
      screen.getByText(/no hay registros de tiempo en este periodo/i),
    ).toBeInTheDocument();
  });

  it("lista todos los Registros de Tiempo existentes sin omisiones ni duplicados (TC-001)", () => {
    // Arrange
    const website = useProjectStore
      .getState()
      .createProject({ name: "Website" });
    const appMovil = useProjectStore
      .getState()
      .createProject({ name: "App Móvil" });
    useTaskTimeTrackingStore.setState({
      tasks: [
        { id: "task-diseno", name: "Diseño", projectId: website.id },
        { id: "task-backend", name: "Backend", projectId: website.id },
        { id: "task-qa", name: "QA", projectId: appMovil.id },
      ],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-diseno",
          startedAt: new Date(2026, 6, 8).getTime(),
          endedAt: new Date(2026, 6, 8).getTime() + 90 * 60_000,
          durationSeconds: 90 * 60,
          source: "manual",
        },
        {
          id: "e2",
          taskId: "task-backend",
          startedAt: new Date(2026, 6, 9).getTime(),
          endedAt: new Date(2026, 6, 9).getTime() + 45 * 60_000,
          durationSeconds: 45 * 60,
          source: "manual",
        },
        {
          id: "e3",
          taskId: "task-qa",
          startedAt: new Date(2026, 6, 10).getTime(),
          endedAt: new Date(2026, 6, 10).getTime() + 120 * 60_000,
          durationSeconds: 120 * 60,
          source: "manual",
        },
      ],
    });

    // Act
    render(<HistoryPage />);

    // Assert
    expect(screen.getAllByText("8 jul. 2026")).toHaveLength(1);
    expect(screen.getAllByText("9 jul. 2026")).toHaveLength(1);
    expect(screen.getAllByText("10 jul. 2026")).toHaveLength(1);
  });

  it("presenta Fecha, Proyecto, Tarea y Duración de cada Registro (TC-010, TC-011)", () => {
    // Arrange
    const website = useProjectStore
      .getState()
      .createProject({ name: "Website" });
    useTaskTimeTrackingStore.setState({
      tasks: [{ id: "task-diseno", name: "Diseño", projectId: website.id }],
      timeEntries: [
        {
          id: "e1",
          taskId: "task-diseno",
          startedAt: new Date(2026, 6, 8).getTime(),
          endedAt: new Date(2026, 6, 8).getTime() + 60_000,
          durationSeconds: 60,
          source: "manual",
        },
      ],
    });

    // Act
    render(<HistoryPage />);

    // Assert
    const row = screen.getByRole("row", { name: /diseño/i });
    expect(within(row).getByText("8 jul. 2026")).toBeInTheDocument();
    expect(within(row).getByText("Website")).toBeInTheDocument();
    expect(within(row).getByText("Diseño")).toBeInTheDocument();
    expect(within(row).getByText("0:01:00")).toBeInTheDocument();
  });

  it("navega al mes anterior y regresa al mes actual recalculando el total (TC-008)", async () => {
    // Arrange
    const website = useProjectStore
      .getState()
      .createProject({ name: "Website" });
    useTaskTimeTrackingStore.setState({
      tasks: [{ id: "task-diseno", name: "Diseño", projectId: website.id }],
      timeEntries: [
        {
          id: "current",
          taskId: "task-diseno",
          startedAt: new Date(2026, 6, 15).getTime(),
          endedAt: new Date(2026, 6, 15).getTime() + 60 * 60_000,
          durationSeconds: 60 * 60,
          source: "manual",
        },
        {
          id: "previous",
          taskId: "task-diseno",
          startedAt: new Date(2026, 5, 15).getTime(),
          endedAt: new Date(2026, 5, 15).getTime() + 3 * 60 * 60_000,
          durationSeconds: 3 * 60 * 60,
          source: "manual",
        },
      ],
    });
    const user = userEvent.setup();
    render(<HistoryPage />);
    expect(screen.getByTestId("summary-total-hours")).toHaveTextContent(
      "1:00:00",
    );

    // Act
    await user.click(screen.getByRole("button", { name: /mes anterior/i }));

    // Assert
    expect(screen.getByTestId("summary-total-hours")).toHaveTextContent(
      "3:00:00",
    );

    // Act
    await user.click(screen.getByRole("button", { name: /mes siguiente/i }));

    // Assert
    expect(screen.getByTestId("summary-total-hours")).toHaveTextContent(
      "1:00:00",
    );
  });

  it("muestra la lista vacía y el total en 0h al navegar a un mes sin Registros (TC-009)", async () => {
    // Arrange
    const website = useProjectStore
      .getState()
      .createProject({ name: "Website" });
    useTaskTimeTrackingStore.setState({
      tasks: [{ id: "task-diseno", name: "Diseño", projectId: website.id }],
      timeEntries: [
        {
          id: "current",
          taskId: "task-diseno",
          startedAt: new Date(2026, 6, 15).getTime(),
          endedAt: new Date(2026, 6, 15).getTime() + 60 * 60_000,
          durationSeconds: 60 * 60,
          source: "manual",
        },
      ],
    });
    const user = userEvent.setup();
    render(<HistoryPage />);

    // Act
    await user.click(screen.getByRole("button", { name: /mes anterior/i }));

    // Assert
    expect(
      screen.getByText(/no hay registros de tiempo en este periodo/i),
    ).toBeInTheDocument();
    expect(screen.getByTestId("summary-record-count")).toHaveTextContent(
      "0 registros",
    );
    expect(screen.getByTestId("summary-total-hours")).toHaveTextContent(
      "0:00:00",
    );
  });

  it("carga y muestra el historial con 1000 Registros de Tiempo en menos de 2 segundos (TC-015)", () => {
    // Arrange
    const projects = Array.from({ length: 5 }, (_, index) =>
      useProjectStore.getState().createProject({ name: `Proyecto ${index}` }),
    );
    const tasks = Array.from({ length: 20 }, (_, index) => ({
      id: `task-${index}`,
      name: `Tarea ${index}`,
      projectId: projects[index % projects.length].id,
    }));
    const timeEntries = Array.from({ length: 1000 }, (_, index) => {
      const monthOffset = index % 6;
      const startedAt = new Date(
        2026,
        6 - monthOffset,
        (index % 27) + 1,
      ).getTime();

      return {
        id: `entry-${index}`,
        taskId: tasks[index % tasks.length].id,
        startedAt,
        endedAt: startedAt + 60 * 60_000,
        durationSeconds: 60 * 60,
        source: "manual" as const,
      };
    });
    useTaskTimeTrackingStore.setState({
      tasks,
      timeEntries,
      activeTimer: null,
    });

    // Act
    const start = performance.now();
    render(<HistoryPage />);
    const elapsedMs = performance.now() - start;

    // Assert
    expect(elapsedMs).toBeLessThan(2000);
    expect(screen.getByTestId("summary-record-count")).toBeInTheDocument();
  });
});
