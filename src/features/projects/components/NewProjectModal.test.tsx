import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { useProjectsStore } from "../store/projectsStore";
import { NewProjectButton, NewProjectDialog } from "./NewProjectModal";

function renderModal() {
  return render(
    <>
      <NewProjectButton />
      <NewProjectDialog />
    </>,
  );
}

describe("NewProjectModal", () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: [] });
  });

  // El handle del diálogo es un singleton a nivel de módulo (necesario para los triggers
  // "desconectados" en producción); si un test lo deja abierto, contamina el siguiente render.
  afterEach(async () => {
    await userEvent.keyboard("{Escape}");
  });

  it('abre el modal con los campos y acciones esperadas al hacer clic en "Nuevo Proyecto" (TC-007)', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));

    expect(
      screen.getByRole("dialog", { name: "Nuevo Proyecto" }),
    ).toBeVisible();
    expect(screen.getByLabelText("Nombre del Proyecto")).toBeVisible();
    expect(screen.getByLabelText("Descripción")).toBeVisible();
    expect(screen.getByRole("button", { name: "Cancelar" })).toBeVisible();
    expect(
      screen.getByRole("button", { name: "Crear Proyecto" }),
    ).toBeVisible();
  });

  it("crea un Proyecto con Nombre y Descripción y cierra el modal (TC-001)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.type(
      screen.getByLabelText("Nombre del Proyecto"),
      "Rediseño Web",
    );
    await user.type(
      screen.getByLabelText("Descripción"),
      "Actualización del sitio corporativo",
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    expect(useProjectsStore.getState().projects).toMatchObject([
      {
        name: "Rediseño Web",
        description: "Actualización del sitio corporativo",
      },
    ]);
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("crea un Proyecto solo con Nombre, sin Descripción (TC-002)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.type(
      screen.getByLabelText("Nombre del Proyecto"),
      "Consultoría Interna",
    );
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    expect(useProjectsStore.getState().projects).toMatchObject([
      { name: "Consultoría Interna" },
    ]);
  });

  it("rechaza la creación sin Nombre, muestra el error y mantiene el modal abierto (TC-003)", async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.click(screen.getByRole("button", { name: "Crear Proyecto" }));

    expect(screen.getByText("El Nombre es obligatorio.")).toBeVisible();
    expect(screen.getByRole("dialog")).toBeVisible();
    expect(useProjectsStore.getState().projects).toHaveLength(0);
  });

  it('cierra el modal sin crear nada al hacer clic en "Cancelar" (TC-006)', async () => {
    const user = userEvent.setup();
    renderModal();

    await user.click(screen.getByRole("button", { name: "Nuevo Proyecto" }));
    await user.type(
      screen.getByLabelText("Nombre del Proyecto"),
      "Se descarta",
    );
    await user.click(screen.getByRole("button", { name: "Cancelar" }));

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
    expect(useProjectsStore.getState().projects).toHaveLength(0);
  });
});
