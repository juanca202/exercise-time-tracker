import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { HistoryView } from "./history-view";
import { formatMonthLabel, addMonths } from "../lib/period";
import { useTimeTrackingStore } from "../store/time-tracking-store";

function resetStore() {
  localStorage.clear();
  useTimeTrackingStore.setState({
    projects: [],
    tasks: [],
    timeEntries: [],
    activeTimer: null,
  });
}

function currentPeriod() {
  const now = new Date();
  return { year: now.getFullYear(), month: now.getMonth() + 1 };
}

describe("HistoryView", () => {
  beforeEach(() => {
    resetStore();
  });

  it("should_show_an_empty_state_message_when_the_period_has_no_entries", () => {
    // Arrange & Act
    render(<HistoryView />);

    // Assert
    expect(
      screen.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeInTheDocument();
  });

  it("should_list_entries_project_totals_and_task_totals_for_the_current_month", () => {
    // Arrange
    const { year, month } = currentPeriod();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Quantum Redesign" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Wireframing de Componentes",
    });
    useTimeTrackingStore.getState().createManualTimeEntry({
      taskId: task.id,
      date: `${year}-${String(month).padStart(2, "0")}-05`,
      durationSeconds: 3600 * 6 + 30 * 60,
    });

    // Act
    render(<HistoryView />);

    // Assert
    expect(screen.getByText(formatMonthLabel(year, month))).toBeInTheDocument();
    expect(screen.getAllByText("Quantum Redesign")).toHaveLength(2); // tarjeta de proyecto + fila de tabla
    expect(screen.getAllByText("Wireframing de Componentes")).toHaveLength(2); // fila de tabla + total por tarea
    expect(screen.getAllByText("6h 30m")).toHaveLength(2); // tarjeta de proyecto + total por tarea
    expect(screen.getByText("1 registros")).toBeInTheDocument();
    expect(screen.getByText("1 proyectos")).toBeInTheDocument();
    expect(screen.getAllByText("06:30:00")).toHaveLength(2); // fila de tabla + total de horas
  });

  it("should_navigate_to_the_previous_month_and_hide_entries_outside_it", async () => {
    // Arrange
    const user = userEvent.setup();
    const { year, month } = currentPeriod();
    const project = useTimeTrackingStore
      .getState()
      .createProject({ name: "Proyecto" });
    const task = useTimeTrackingStore.getState().createTask({
      projectId: project.id,
      name: "Tarea del mes actual",
    });
    useTimeTrackingStore.getState().createManualTimeEntry({
      taskId: task.id,
      date: `${year}-${String(month).padStart(2, "0")}-10`,
      durationSeconds: 3600,
    });
    render(<HistoryView />);
    const previous = addMonths(year, month, -1);

    // Act
    await user.click(screen.getByRole("button", { name: "Mes anterior" }));

    // Assert
    expect(
      screen.getByText(formatMonthLabel(previous.year, previous.month)),
    ).toBeInTheDocument();
    expect(
      screen.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeInTheDocument();
  });
});
