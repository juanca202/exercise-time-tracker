import { beforeEach, describe, expect, it } from "vitest";
import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore, generarId } from "@/shared/store";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import type { Tarea } from "@/shared/domain";
import { PanelTareas } from "./PanelTareas";

const proyecto = crearProyectoDePrueba({
  id: "proyecto-1",
  nombre: "Proyecto Alpha",
});

function resetearStore(): void {
  window.localStorage.clear();
  useAppStore.setState({
    haHidratado: true,
    proyectos: [proyecto],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

function crearTareaEnStore(nombre: string): Tarea {
  const tarea: Tarea = {
    id: generarId(),
    proyectoId: proyecto.id,
    nombre,
    creadoEn: new Date().toISOString(),
  };
  useAppStore.getState().crearTarea(tarea);
  return tarea;
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
    crearTareaEnStore("Diseñar wireframes");
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
    expect(useAppStore.getState().temporizadorActivo?.tareaId).toBeDefined();

    // Act: detener
    await usuario.click(
      screen.getByRole("button", {
        name: "Detener temporizador de Diseñar wireframes",
      }),
    );

    // Assert
    expect(screen.queryByText("En Ejecución")).not.toBeInTheDocument();
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
  });

  it("recalcula el Total Semanal en tiempo real tras registrar tiempo manual (5.5)", async () => {
    // Arrange: fecha "actual" inyectada, fija en Lunes 2026-07-13 (semana laboral en curso)
    const fechaActual = new Date(2026, 6, 13, 8, 0);
    const tarea = crearTareaEnStore("Diseñar wireframes");
    const usuario = userEvent.setup();
    render(<PanelTareas fecha={fechaActual} />);

    // Assert: parte de 0h 0m (Total Semanal y Total Mensual)
    expect(screen.getAllByText("0h 0m")).toHaveLength(2);

    // Act: registrar 1h30 manualmente para hoy, vía el selector combinado "Proyecto / Tarea"
    await usuario.selectOptions(
      screen.getByLabelText("Proyecto / Tarea"),
      tarea.id,
    );
    fireEvent.change(screen.getByLabelText("Fecha"), {
      target: { value: "2026-07-13" },
    });
    await usuario.type(screen.getByLabelText("Duración"), "01:30");
    await usuario.click(
      screen.getByRole("button", { name: "Guardar Registro" }),
    );

    // Assert: el Total Semanal (y el Total Mensual, mismo mes) se actualizan sin recargar
    expect(screen.getAllByText("1h 30m")).toHaveLength(2);
  });

  it("abre el modal en modo 'editar' precargado con la Tarea al hacer clic en 'Editar'", async () => {
    // Arrange
    const tarea = crearTareaEnStore("Diseñar wireframes");
    const usuario = userEvent.setup();
    render(<PanelTareas />);

    // Act
    await usuario.click(
      screen.getByRole("button", { name: `Editar ${tarea.nombre}` }),
    );

    // Assert
    const dialogo = screen.getByRole("dialog");
    expect(
      within(dialogo).getByRole("heading", { name: "Editar Tarea" }),
    ).toBeInTheDocument();
    expect(within(dialogo).getByLabelText("Nombre")).toHaveValue(tarea.nombre);
  });

  it("detiene el temporizador desde el botón 'Detener Sesión' de la tarjeta Sesión Activa", async () => {
    // Arrange
    crearTareaEnStore("Diseñar wireframes");
    const usuario = userEvent.setup();
    render(<PanelTareas />);
    await usuario.click(
      screen.getByRole("button", {
        name: "Iniciar temporizador de Diseñar wireframes",
      }),
    );
    expect(useAppStore.getState().temporizadorActivo).not.toBeNull();

    // Act
    await usuario.click(screen.getByRole("button", { name: "Detener Sesión" }));

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
  });
});
