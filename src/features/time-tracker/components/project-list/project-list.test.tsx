import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { ProjectList } from "./project-list";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("ProjectList", () => {
  it("renders each project with its name, description and total time", () => {
    const project = aProject({
      id: "project-1",
      name: "Identidad de Marca Global",
      description: "Rebranding",
    });
    const task = aTask({ id: "task-1", projectId: "project-1" });
    const entry = aTimeEntry({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 46800,
    });

    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
      timeEntries: { [entry.id]: entry },
    });

    render(<ProjectList />);

    expect(screen.getByText("Identidad de Marca Global")).toBeInTheDocument();
    expect(screen.getByText("Rebranding")).toBeInTheDocument();
    expect(screen.getByText("13h 00m")).toBeInTheDocument();
  });

  it("renders nothing when there are no projects", () => {
    render(<ProjectList />);
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });
});
