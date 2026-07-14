import { beforeEach, describe, expect, it } from "vitest";
import { useAppStore } from "@/shared/store";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import { crearTarea, editarTarea } from "./acciones-tareas";

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
    expect(useAppStore.getState().tareas).toHaveLength(1);
    expect(useAppStore.getState().tareas[0]).toMatchObject({
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
    expect(useAppStore.getState().tareas).toHaveLength(0);
  });

  it("rechaza la creación cuando el Nombre está vacío", () => {
    // Act
    const resultado = crearTarea({ proyectoId: "proyecto-1", nombre: "   " });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useAppStore.getState().tareas).toHaveLength(0);
  });

  it("rechaza la creación cuando el Proyecto seleccionado no existe en el store", () => {
    // Act
    const resultado = crearTarea({
      proyectoId: "proyecto-inexistente",
      nombre: "Diseñar wireframes",
    });

    // Assert
    expect(resultado.ok).toBe(false);
    expect(useAppStore.getState().tareas).toHaveLength(0);
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
    useAppStore.setState({
      haHidratado: false,
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      temporizadorActivo: null,
    });
    useAppStore.getState().hidratar();

    // Assert: la Tarea sigue presente tras la "recarga"
    expect(useAppStore.getState().tareas).toHaveLength(1);
    expect(useAppStore.getState().tareas[0]).toMatchObject({
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
    const tareaActualizada = useAppStore
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
    const tareaSinCambios = useAppStore
      .getState()
      .tareas.find((t) => t.id === tarea.id);
    expect(tareaSinCambios?.nombre).toBe("Diseñar wireframes");
  });
});
