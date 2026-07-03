import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { RecentEntriesList } from "./recent-entries-list";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
  vi.useFakeTimers();
  vi.setSystemTime(new Date("2026-07-02T12:00:00.000Z"));
});

describe("RecentEntriesList", () => {
  it("shows the empty state when there are no entries", () => {
    render(<RecentEntriesList />);
    expect(
      screen.getByText("Aún no hay registros de tiempo."),
    ).toBeInTheDocument();
  });

  it("lists the most recent entries with task, project, duration and relative time", () => {
    const project = aProject({ id: "project-1", name: "Rediseño" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    const entry = aTimeEntry({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 3600,
      createdAt: "2026-07-02T10:00:00.000Z",
    });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<RecentEntriesList />);

    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("Rediseño")).toBeInTheDocument();
    expect(screen.getByText("01:00:00")).toBeInTheDocument();
    expect(screen.getByText("hace 2h")).toBeInTheDocument();
  });

  it("starts a timer for the entry's task when its play button is clicked", () => {
    const project = aProject({ id: "project-1" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    const entry = aTimeEntry({ id: "entry-1", taskId: "task-1" });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<RecentEntriesList />);
    screen
      .getByRole("button", { name: "Iniciar temporizador para Wireframes" })
      .click();

    expect(useTimeTrackerStore.getState().activeTimer?.taskId).toBe("task-1");
  });
});
