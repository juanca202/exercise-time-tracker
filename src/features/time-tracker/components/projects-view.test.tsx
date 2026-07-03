import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import {
  initialTimeTrackerState,
  useTimeTrackerStore,
} from "../store/time-tracker-store";
import { ProjectsView } from "./projects-view";

beforeEach(() => {
  useTimeTrackerStore.setState(initialTimeTrackerState);
  localStorage.clear();
});

describe("ProjectsView", () => {
  it("renders the heading and both project-creation entry points", () => {
    render(<ProjectsView />);

    expect(
      screen.getByRole("heading", { name: "Proyectos" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Nuevo Proyecto" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Crear Nuevo Proyecto" }),
    ).toBeInTheDocument();
  });
});
