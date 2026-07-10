import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";
import { useProjectStore } from "../model/project-store";
import { ProjectsPage } from "./projects-page";

describe("ProjectsPage", () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectStore.setState({ projects: [] });
    useTaskTimeTrackingStore.setState({
      tasks: [],
      timeEntries: [],
      activeTimer: null,
    });
  });

  it("muestra el estado vacío cuando no existe ningún Proyecto (TC-006)", () => {
    // Act
    render(<ProjectsPage />);

    // Assert
    expect(
      screen.getByText(/todavía no hay proyectos creados/i),
    ).toBeInTheDocument();
    expect(screen.queryByRole("article")).not.toBeInTheDocument();
  });

  it("lista las tarjetas con Nombre, Descripción y Tiempo Registrado (TC-005)", () => {
    // Arrange
    useProjectStore.getState().createProject({
      name: "Rediseño Web",
      description: "Actualización del sitio corporativo",
    });

    // Act
    render(<ProjectsPage />);

    // Assert
    expect(screen.getByText("Rediseño Web")).toBeInTheDocument();
    expect(
      screen.getByText("Actualización del sitio corporativo"),
    ).toBeInTheDocument();
    expect(screen.getByText(/tiempo registrado/i)).toBeInTheDocument();
    expect(screen.getByText("0h 00m")).toBeInTheDocument();
  });

  it("abre el modal de creación al seleccionar la acción 'Nuevo Proyecto' (TC-007)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectsPage />);

    // Act
    await user.click(screen.getByRole("button", { name: /^nuevo proyecto$/i }));

    // Assert
    expect(
      screen.getByRole("dialog", { name: /^nuevo proyecto$/i }),
    ).toBeInTheDocument();
  });

  it('abre el mismo modal desde la tarjeta fantasma "Crear Nuevo Proyecto"', async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectsPage />);

    // Act
    await user.click(
      screen.getByRole("button", { name: /crear nuevo proyecto/i }),
    );

    // Assert
    expect(
      screen.getByRole("dialog", { name: /^nuevo proyecto$/i }),
    ).toBeInTheDocument();
  });

  it("crea el Proyecto con Nombre y Descripción y lo agrega al listado (TC-001)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectsPage />);
    await user.click(screen.getByRole("button", { name: /^nuevo proyecto$/i }));

    // Act
    await user.type(
      screen.getByLabelText(/nombre del proyecto/i),
      "Rediseño Web",
    );
    await user.type(
      screen.getByLabelText(/descripción/i),
      "Actualización del sitio corporativo",
    );
    await user.click(screen.getByRole("button", { name: /crear proyecto/i }));

    // Assert
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(screen.getByText("Rediseño Web")).toBeInTheDocument();
    expect(
      screen.getByText("Actualización del sitio corporativo"),
    ).toBeInTheDocument();
  });

  it("crea el Proyecto solo con Nombre, sin Descripción (TC-002)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectsPage />);
    await user.click(screen.getByRole("button", { name: /^nuevo proyecto$/i }));

    // Act
    await user.type(
      screen.getByLabelText(/nombre del proyecto/i),
      "Consultoría Interna",
    );
    await user.click(screen.getByRole("button", { name: /crear proyecto/i }));

    // Assert
    expect(screen.getByText("Consultoría Interna")).toBeInTheDocument();
    expect(useProjectStore.getState().projects[0]?.description).toBeUndefined();
  });

  it("rechaza la creación sin Nombre y mantiene el modal abierto (TC-003)", async () => {
    // Arrange
    const user = userEvent.setup();
    render(<ProjectsPage />);
    await user.click(screen.getByRole("button", { name: /^nuevo proyecto$/i }));

    // Act
    await user.type(
      screen.getByLabelText(/descripción/i),
      "Proyecto de prueba",
    );
    await user.click(screen.getByRole("button", { name: /crear proyecto/i }));

    // Assert
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(/el nombre es obligatorio/i)).toBeInTheDocument();
    expect(useProjectStore.getState().projects).toEqual([]);
  });
});
