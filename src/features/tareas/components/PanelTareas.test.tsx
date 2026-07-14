import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useRaizStore } from "@/shared/store";
import { PanelTareas } from "./PanelTareas";

function resetearStore(): void {
  useRaizStore.setState({
    haHidratado: true,
    proyectos: [
      { id: "proyecto-1", nombre: "Proyecto Alpha", descripcion: "" },
    ],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

describe("PanelTareas", () => {
  beforeEach(resetearStore);

  it("crea una Tarea desde el botón 'Nueva Tarea' y la muestra en Tareas Recientes", async () => {
    // Arrange
    const usuario = userEvent.setup();
    render(<PanelTareas />);

    // Act
    await usuario.click(screen.getByRole("button", { name: "Nueva Tarea" }));
    const dialogo = screen.getByRole("dialog");
    await usuario.selectOptions(
      within(dialogo).getByLabelText("Proyecto"),
      "proyecto-1",
    );
    await usuario.type(
      within(dialogo).getByLabelText("Nombre"),
      "Diseñar wireframes",
    );
    await usuario.click(
      within(dialogo).getByRole("button", { name: "Nueva Tarea" }),
    );

    // Assert
    const listado = screen.getByRole("list");
    expect(within(listado).getByText("Diseñar wireframes")).toBeInTheDocument();
    expect(within(listado).getByText("Proyecto Alpha")).toBeInTheDocument();
  });

  it("inicia y detiene el temporizador de una Tarea desde el listado (AC-011)", async () => {
    // Arrange
    useRaizStore
      .getState()
      .crearTarea({ proyectoId: "proyecto-1", nombre: "Diseñar wireframes" });
    const usuario = userEvent.setup();
    render(<PanelTareas />);

    // Act: iniciar
    await usuario.click(
      screen.getByRole("button", {
        name: "Iniciar temporizador de Diseñar wireframes",
      }),
    );

    // Assert
    expect(screen.getByText("En Ejecución")).toBeInTheDocument();
    expect(useRaizStore.getState().temporizadorActivo?.tareaId).toBeDefined();

    // Act: detener
    await usuario.click(
      screen.getByRole("button", {
        name: "Detener temporizador de Diseñar wireframes",
      }),
    );

    // Assert
    expect(screen.queryByText("En Ejecución")).not.toBeInTheDocument();
    expect(useRaizStore.getState().temporizadorActivo).toBeNull();
  });

  it("recalcula el Total Semanal en tiempo real tras registrar tiempo manual (5.5)", async () => {
    // Arrange: fecha "actual" inyectada, fija en Lunes 2026-07-13 (semana laboral en curso)
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    useRaizStore
      .getState()
      .crearTarea({ proyectoId: "proyecto-1", nombre: "Diseñar wireframes" });
    const usuario = userEvent.setup();
    render(<PanelTareas fecha={fechaActual} />);

    // Assert: parte de 0h
    expect(screen.getByText("0.0h")).toBeInTheDocument();

    // Act: registrar 1h30 manualmente para hoy
    await usuario.selectOptions(
      screen.getByLabelText("Tarea"),
      "Diseñar wireframes",
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración (minutos)"), "90");
    await usuario.click(
      screen.getByRole("button", { name: "Registrar tiempo" }),
    );

    // Assert: el Total Semanal se actualiza sin recargar
    expect(screen.getByText("1.5h")).toBeInTheDocument();
  });
});
