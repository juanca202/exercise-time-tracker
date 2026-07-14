import { describe, expect, it, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { useAppStore, generarId } from "@/shared/store";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import type { Tarea } from "@/shared/domain";
import { TareaFormModal } from "./TareaFormModal";

const proyectoAlpha = crearProyectoDePrueba({
  id: "proyecto-1",
  nombre: "Proyecto Alpha",
});
const proyectos = [{ id: proyectoAlpha.id, nombre: proyectoAlpha.nombre }];

function resetearStore(): void {
  window.localStorage.clear();
  useAppStore.setState({
    haHidratado: true,
    proyectos: [proyectoAlpha],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
}

function crearTareaEnStore(nombre: string): Tarea {
  const tarea: Tarea = {
    id: generarId(),
    proyectoId: proyectoAlpha.id,
    nombre,
    creadoEn: new Date().toISOString(),
  };
  useAppStore.getState().crearTarea(tarea);
  return tarea;
}

describe("TareaFormModal", () => {
  beforeEach(resetearStore);

  it("crea la Tarea, la asocia al Proyecto seleccionado y cierra el modal (AC-001, AC-003)", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={onOpenChange}
      />,
    );

    // Act
    await usuario.selectOptions(
      screen.getByLabelText("Proyecto"),
      "proyecto-1",
    );
    await usuario.type(screen.getByLabelText("Nombre"), "Diseñar wireframes");
    await usuario.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    // Assert
    expect(useAppStore.getState().tareas).toHaveLength(1);
    expect(useAppStore.getState().tareas[0]).toMatchObject({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    });
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });

  it("rechaza la creación sin Proyecto seleccionado y mantiene el modal abierto (AC-002)", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={onOpenChange}
      />,
    );

    // Act
    await usuario.type(screen.getByLabelText("Nombre"), "Diseñar wireframes");
    await usuario.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    // Assert
    expect(useAppStore.getState().tareas).toHaveLength(0);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("El Proyecto es obligatorio.")).toBeInTheDocument();
  });

  it("rechaza la creación sin Nombre y mantiene el modal abierto", async () => {
    // Arrange
    const usuario = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TareaFormModal
        open
        modo="crear"
        proyectos={proyectos}
        onOpenChange={onOpenChange}
      />,
    );

    // Act
    await usuario.selectOptions(
      screen.getByLabelText("Proyecto"),
      "proyecto-1",
    );
    await usuario.click(screen.getByRole("button", { name: "Nueva Tarea" }));

    // Assert
    expect(useAppStore.getState().tareas).toHaveLength(0);
    expect(onOpenChange).not.toHaveBeenCalled();
    expect(screen.getByText("El Nombre es obligatorio.")).toBeInTheDocument();
  });

  it("precarga Proyecto y Nombre en modo editar y muestra el título/botón 'Editar Tarea' (AC-004)", async () => {
    // Arrange
    const tarea = crearTareaEnStore("Diseñar wireframes");
    const usuario = userEvent.setup();
    const onOpenChange = vi.fn();
    render(
      <TareaFormModal
        open
        modo="editar"
        proyectos={proyectos}
        tarea={tarea}
        onOpenChange={onOpenChange}
      />,
    );

    // Assert: precarga
    expect(screen.getAllByText("Editar Tarea").length).toBeGreaterThan(0);
    expect(screen.getByLabelText("Nombre")).toHaveValue("Diseñar wireframes");
    expect(screen.getByLabelText("Proyecto")).toHaveValue("proyecto-1");

    // Act: editar el Nombre
    await usuario.clear(screen.getByLabelText("Nombre"));
    await usuario.type(
      screen.getByLabelText("Nombre"),
      "Diseñar wireframes de alta fidelidad",
    );
    await usuario.click(screen.getByRole("button", { name: "Editar Tarea" }));

    // Assert
    const tareaActualizada = useAppStore
      .getState()
      .tareas.find((t) => t.id === tarea.id);
    expect(tareaActualizada?.nombre).toBe(
      "Diseñar wireframes de alta fidelidad",
    );
    expect(tareaActualizada?.proyectoId).toBe("proyecto-1");
    expect(onOpenChange).toHaveBeenCalledWith(false);
  });
});
