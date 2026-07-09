import { useProjectsStore } from "@/features/projects";
import { fireEvent, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useTasksStore } from "../store/tasksStore";
import { ManualEntryForm } from "./ManualEntryForm";

describe("ManualEntryForm", () => {
  beforeEach(() => {
    useProjectsStore.setState({
      projects: [
        {
          id: "project-1",
          name: "Proyecto Alfa",
          createdAt: new Date(2026, 6, 1).toISOString(),
        },
      ],
    });
    useTasksStore.setState({
      tasks: [
        {
          id: "task-1",
          projectId: "project-1",
          name: "Diseñar wireframes",
          createdAt: new Date(2026, 6, 1).toISOString(),
        },
      ],
      timeEntries: [],
      activeTimer: null,
    });
  });

  async function selectTask(user: ReturnType<typeof userEvent.setup>) {
    await user.click(screen.getByLabelText("Proyecto / Tarea"));
    await user.click(
      await screen.findByRole("option", {
        name: "Proyecto Alfa — Diseñar wireframes",
      }),
    );
  }

  it("crea un Registro de Tiempo manual con Fecha, Tarea y Duración válidos (TC-015)", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-08" },
    });
    await selectTask(user);
    await user.type(screen.getByLabelText("Duración"), "02:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(useTasksStore.getState().timeEntries).toMatchObject([
      { taskId: "task-1", durationMs: 2 * 60 * 60_000 },
    ]);
  });

  it("rechaza guardar el Registro cuando falta la Fecha (TC-016)", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    fireEvent.change(screen.getByLabelText("Fecha"), { target: { value: "" } });
    await selectTask(user);
    await user.type(screen.getByLabelText("Duración"), "02:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(
      screen.getByText(
        "Completá Fecha, Proyecto/Tarea y una Duración válida (HH:MM).",
      ),
    ).toBeVisible();
    expect(useTasksStore.getState().timeEntries).toHaveLength(0);
  });

  it("rechaza una Duración negativa (TC-018, BR-03)", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-08" },
    });
    await selectTask(user);
    await user.type(screen.getByLabelText("Duración"), "-1:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(
      screen.getByText(
        "Completá Fecha, Proyecto/Tarea y una Duración válida (HH:MM).",
      ),
    ).toBeVisible();
    expect(useTasksStore.getState().timeEntries).toHaveLength(0);
  });

  it("rechaza una Duración igual a cero (TC-019, BR-03)", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-08" },
    });
    await selectTask(user);
    await user.type(screen.getByLabelText("Duración"), "00:00");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(
      screen.getByText(
        "Completá Fecha, Proyecto/Tarea y una Duración válida (HH:MM).",
      ),
    ).toBeVisible();
    expect(useTasksStore.getState().timeEntries).toHaveLength(0);
  });

  it("acepta la Duración mínima válida de 1 minuto (TC-020, límite)", async () => {
    const user = userEvent.setup();
    render(<ManualEntryForm />);

    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-08" },
    });
    await selectTask(user);
    await user.type(screen.getByLabelText("Duración"), "00:01");
    await user.click(screen.getByRole("button", { name: "Guardar Registro" }));

    expect(useTasksStore.getState().timeEntries).toMatchObject([
      { taskId: "task-1", durationMs: 60_000 },
    ]);
  });
});
