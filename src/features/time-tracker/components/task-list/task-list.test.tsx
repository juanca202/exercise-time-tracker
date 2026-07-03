import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { aProject, aTask } from "../../testing/object-mothers";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../../store/time-tracker-store";
import { TaskList } from "./task-list";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("TaskList", () => {
  it("shows the empty state when there are no tasks", () => {
    render(<TaskList />);
    expect(screen.getByText("Aún no hay tareas.")).toBeInTheDocument();
  });

  it("groups tasks by project and shows a start button for each", () => {
    const projectA = aProject({ id: "project-1", name: "Rediseño" });
    const projectB = aProject({ id: "project-2", name: "Nexus App" });
    const taskA1 = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    const taskA2 = aTask({
      id: "task-2",
      projectId: "project-1",
      name: "Revisión de Componentes",
    });
    const taskB1 = aTask({
      id: "task-3",
      projectId: "project-2",
      name: "Integración de API",
    });

    useTimeTrackerStore.setState({
      projects: { [projectA.id]: projectA, [projectB.id]: projectB },
      tasks: {
        [taskA1.id]: taskA1,
        [taskA2.id]: taskA2,
        [taskB1.id]: taskB1,
      },
    });

    render(<TaskList />);

    expect(screen.getByText("Rediseño")).toBeInTheDocument();
    expect(screen.getByText("Nexus App")).toBeInTheDocument();
    expect(screen.getByText("Wireframes")).toBeInTheDocument();
    expect(screen.getByText("Revisión de Componentes")).toBeInTheDocument();
    expect(screen.getByText("Integración de API")).toBeInTheDocument();
    expect(
      screen.getByRole("button", {
        name: "Iniciar temporizador para Wireframes",
      }),
    ).toBeInTheDocument();
  });

  it("starts a timer for the clicked task", () => {
    const project = aProject({ id: "project-1", name: "Rediseño" });
    const task = aTask({
      id: "task-1",
      projectId: "project-1",
      name: "Wireframes",
    });
    useTimeTrackerStore.setState({
      projects: { [project.id]: project },
      tasks: { [task.id]: task },
    });

    render(<TaskList />);
    screen
      .getByRole("button", { name: "Iniciar temporizador para Wireframes" })
      .click();

    expect(useTimeTrackerStore.getState().activeTimer?.taskId).toBe("task-1");
  });
});
