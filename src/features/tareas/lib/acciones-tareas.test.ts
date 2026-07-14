import { beforeEach, describe, expect, it } from "vitest";
import { useRaizStore } from "@/shared/store";
import { crearTarea, editarTarea } from "./acciones-tareas";

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

describe("crearTarea", () => {
  beforeEach(resetearStore);

  it("crea la Tarea y la asocia al Proyecto cuando Proyecto y Nombre son válidos", () => {
    // Act
    const resultado = crearTarea({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    });

    // Assert
    expect(resultado.ok).toBe(true);
    expect(useRaizStore.getState().tareas).toHaveLength(1);
    expect(useRaizStore.getState().tareas[0]).toMatchObject({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    });
  });

  it("rechaza la creación cuando no se selecciona Proyecto", () => {
    // Act
    const resultado = crearTarea({
      proyectoId: "",
      nombre: "Diseñar wireframes",
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().tareas).toHaveLength(0);
  });

  it("rechaza la creación cuando el Nombre está vacío", () => {
    // Act
    const resultado = crearTarea({ proyectoId: "proyecto-1", nombre: "   " });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().tareas).toHaveLength(0);
  });

  it("rechaza la creación cuando el Proyecto seleccionado no existe en el store", () => {
    // Act
    const resultado = crearTarea({
      proyectoId: "proyecto-inexistente",
      nombre: "Diseñar wireframes",
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useRaizStore.getState().tareas).toHaveLength(0);
  });

  it("persiste la Tarea creada tras una recarga simulada de la aplicación", () => {
    // Arrange
    const resultado = crearTarea({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    });
    expect(resultado.ok).toBe(true);

    // Act: simula una recarga de la app — reinicia el estado en memoria a su
    // valor inicial (sin tocar `localStorage`, que ya conserva lo persistido
    // por `crearTarea`) y vuelve a hidratar desde el almacenamiento local.
    useRaizStore.setState({
      haHidratado: false,
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      temporizadorActivo: null,
    });
    useRaizStore.getState().hidratar();

    // Assert: la Tarea sigue presente tras la "recarga"
    expect(useRaizStore.getState().tareas).toHaveLength(1);
    expect(useRaizStore.getState().tareas[0]).toMatchObject({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    });
  });
});

describe("editarTarea", () => {
  beforeEach(resetearStore);

  it("actualiza el Nombre de una Tarea existente manteniendo su Proyecto", () => {
    // Arrange
    const { tarea } = crearTarea({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    }) as {
      ok: true;
      tarea: { id: string };
    };

    // Act
    const resultado = editarTarea(tarea.id, {
      nombre: "Diseñar wireframes de alta fidelidad",
    });

    // Assert
    expect(resultado.ok).toBe(true);
    const tareaActualizada = useRaizStore
      .getState()
      .tareas.find((t) => t.id === tarea.id);
    expect(tareaActualizada).toMatchObject({
      nombre: "Diseñar wireframes de alta fidelidad",
      proyectoId: "proyecto-1",
    });
  });

  it("rechaza la edición cuando el nuevo Nombre queda vacío", () => {
    // Arrange
    const { tarea } = crearTarea({
      proyectoId: "proyecto-1",
      nombre: "Diseñar wireframes",
    }) as {
      ok: true;
      tarea: { id: string };
    };

    // Act
    const resultado = editarTarea(tarea.id, { nombre: "" });

    // Assert
    expect(resultado.ok).toBe(false);
    const tareaSinCambios = useRaizStore
      .getState()
      .tareas.find((t) => t.id === tarea.id);
    expect(tareaSinCambios?.nombre).toBe("Diseñar wireframes");
  });
});
