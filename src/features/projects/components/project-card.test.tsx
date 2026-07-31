import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { colorFromString } from "@/shared/color-from-string";
import { ProjectCard } from "./project-card";

const project = { id: "1", name: "Rediseño de Marca", description: "Q4" };

describe("ProjectCard", () => {
  it("muestra el Nombre y la Descripción del Proyecto", () => {
    render(
      <ProjectCard
        project={project}
        totalSeconds={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("Rediseño de Marca")).toBeInTheDocument();
    expect(screen.getByText("Q4")).toBeInTheDocument();
  });

  it("pinta la barra lateral con el color derivado del nombre del Proyecto", () => {
    render(
      <ProjectCard
        project={project}
        totalSeconds={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByTestId("project-accent-bar")).toHaveStyle({
      backgroundColor: colorFromString("Rediseño de Marca"),
    });
  });

  it("no muestra el párrafo de Descripción cuando está vacía", () => {
    render(
      <ProjectCard
        project={{ ...project, description: "" }}
        totalSeconds={0}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.queryByText("Q4")).not.toBeInTheDocument();
  });

  it("muestra el tiempo total registrado en formato HH:MM", () => {
    render(
      <ProjectCard
        project={project}
        totalSeconds={3600 * 42 + 60 * 15}
        onEdit={vi.fn()}
        onDelete={vi.fn()}
      />,
    );

    expect(screen.getByText("42:15")).toBeInTheDocument();
  });

  it('invoca onEdit al hacer clic en "Editar"', async () => {
    const onEdit = vi.fn();
    render(
      <ProjectCard
        project={project}
        totalSeconds={0}
        onEdit={onEdit}
        onDelete={vi.fn()}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Editar" }));

    expect(onEdit).toHaveBeenCalledOnce();
  });

  it('invoca onDelete al hacer clic en "Eliminar"', async () => {
    const onDelete = vi.fn();
    render(
      <ProjectCard
        project={project}
        totalSeconds={0}
        onEdit={vi.fn()}
        onDelete={onDelete}
      />,
    );

    await userEvent.click(screen.getByRole("button", { name: "Eliminar" }));

    expect(onDelete).toHaveBeenCalledOnce();
  });
});
