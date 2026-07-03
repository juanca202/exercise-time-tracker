import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../store/time-tracker-store";
import { TasksView } from "./tasks-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("TasksView", () => {
  it("renders the heading, timer panel, manual entry form and recent entries", () => {
    render(<TasksView />);

    expect(screen.getByRole("heading", { name: "Tareas" })).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nueva Tarea" }),
    ).toBeInTheDocument();
    // A <section aria-label="..."> exposes an accessible "region" landmark with that name.
    expect(
      screen.getByRole("region", { name: "Temporizador" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Entrada Manual" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("region", { name: "Tareas Recientes" }),
    ).toBeInTheDocument();
  });
});
