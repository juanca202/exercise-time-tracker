import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "@/shared/store/use-project-store";
import { useTaskStore } from "@/shared/store/use-task-store";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { formatMonthLabel } from "@/features/reports/format-date";
import HistoryPage from "./page";

function resetStores() {
  useProjectStore.setState({ projects: [] });
  useTaskStore.setState({ tasks: [] });
  useTimeEntryStore.setState({ timeEntries: [] });
}

function isoDateFor(year: number, month: number, day: number): string {
  return `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`;
}

describe("HistoryPage", () => {
  beforeEach(() => {
    resetStores();
  });

  it("navega entre periodos mensuales y filtra el Historial por el mes seleccionado (AC-005)", async () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth() + 1;
    const previousMonthDate = new Date(
      now.getFullYear(),
      now.getMonth() - 1,
      1,
    );
    const previousYear = previousMonthDate.getFullYear();
    const previousMonth = previousMonthDate.getMonth() + 1;

    const project = useProjectStore
      .getState()
      .createProject({ name: "Proyecto", description: "" });
    const currentTask = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "Tarea del Mes Actual" });
    const previousTask = useTaskStore
      .getState()
      .createTask({ projectId: project.id, name: "Tarea del Mes Anterior" });
    useTimeEntryStore.getState().createTimeEntry({
      taskId: currentTask.id,
      source: "manual",
      date: isoDateFor(currentYear, currentMonth, 10),
      durationSeconds: 3600,
    });
    useTimeEntryStore.getState().createTimeEntry({
      taskId: previousTask.id,
      source: "manual",
      date: isoDateFor(previousYear, previousMonth, 15),
      durationSeconds: 1800,
    });

    render(<HistoryPage />);

    expect(
      screen.getByText(formatMonthLabel(currentYear, currentMonth)),
    ).toBeInTheDocument();
    expect(screen.getByText("Tarea del Mes Actual")).toBeInTheDocument();
    expect(
      screen.queryByText("Tarea del Mes Anterior"),
    ).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Periodo anterior" }),
    );

    expect(
      screen.getByText(formatMonthLabel(previousYear, previousMonth)),
    ).toBeInTheDocument();
    expect(screen.getByText("Tarea del Mes Anterior")).toBeInTheDocument();
    expect(screen.queryByText("Tarea del Mes Actual")).not.toBeInTheDocument();

    await userEvent.click(
      screen.getByRole("button", { name: "Periodo siguiente" }),
    );

    expect(
      screen.getByText(formatMonthLabel(currentYear, currentMonth)),
    ).toBeInTheDocument();
    expect(screen.getByText("Tarea del Mes Actual")).toBeInTheDocument();
  });
});
