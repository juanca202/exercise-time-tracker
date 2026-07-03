import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { HistoryView } from "./history-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();

  const project = aProject({ id: "project-1", name: "Rediseño" });
  const task = aTask({
    id: "task-1",
    projectId: "project-1",
    name: "Wireframes",
  });
  const octoberEntry = aTimeEntry({
    id: "entry-1",
    taskId: "task-1",
    date: "2026-10-15",
    durationSeconds: 3600,
    createdAt: "2026-10-15T10:00:00.000Z",
  });
  const novemberEntry = aTimeEntry({
    id: "entry-2",
    taskId: "task-1",
    date: "2026-11-02",
    durationSeconds: 1800,
    createdAt: "2026-11-02T10:00:00.000Z",
  });

  useTimeTrackerStore.setState({
    projects: { [project.id]: project },
    tasks: { [task.id]: task },
    timeEntries: {
      [octoberEntry.id]: octoberEntry,
      [novemberEntry.id]: novemberEntry,
    },
  });
});

describe("HistoryView", () => {
  it("shows entries and totals for the initial period", () => {
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    expect(screen.getByText("Octubre 2026")).toBeInTheDocument();
    expect(screen.getByText("2026-10-15")).toBeInTheDocument();
    expect(screen.queryByText("2026-11-02")).not.toBeInTheDocument();
    expect(screen.getByText("1h 00m")).toBeInTheDocument();
  });

  it("navigates to the next period and shows its entries", async () => {
    const user = userEvent.setup();
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));

    expect(screen.getByText("Noviembre 2026")).toBeInTheDocument();
    expect(screen.getByText("2026-11-02")).toBeInTheDocument();
  });

  it("shows an empty state when the period has no entries", async () => {
    const user = userEvent.setup();
    render(<HistoryView initialPeriod={{ year: 2026, month: 10 }} />);

    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));
    await user.click(screen.getByRole("button", { name: "Periodo siguiente" }));

    expect(
      screen.getByText("No hay registros para este periodo."),
    ).toBeInTheDocument();
  });
});
