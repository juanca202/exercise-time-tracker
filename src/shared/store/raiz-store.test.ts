import { beforeEach, describe, expect, it } from "vitest";
import { useRaizStore } from "./raiz-store";

function resetearStore(): void {
  useRaizStore.setState({
    haHidratado: false,
    proyectos: [],
    tareas: [],
    registrosDeTiempo: [],
    temporizadorActivo: null,
  });
  window.localStorage.clear();
}

describe("useRaizStore", () => {
  beforeEach(resetearStore);

  it("crea Proyecto, Tarea y Registro de Tiempo en crudo, sin validación de negocio", () => {
    // Act
    const proyecto = useRaizStore
      .getState()
      .crearProyecto({ nombre: "", descripcion: "" });
    const tarea = useRaizStore
      .getState()
      .crearTarea({ proyectoId: proyecto.id, nombre: "" });
    const registro = useRaizStore.getState().crearRegistroDeTiempo({
      tareaId: tarea.id,
      fecha: "2026-07-13T00:00:00.000Z",
      duracionMs: 0,
      origen: "manual",
    });

    // Assert: el store raíz no aplica ninguna regla de negocio (BR-01/BR-04 son responsabilidad de la feature)
    expect(useRaizStore.getState().proyectos).toContainEqual(proyecto);
    expect(useRaizStore.getState().tareas).toContainEqual(tarea);
    expect(useRaizStore.getState().registrosDeTiempo).toContainEqual(registro);
  });

  it("actualiza únicamente los campos provistos de una Tarea existente", () => {
    // Arrange
    const tarea = useRaizStore
      .getState()
      .crearTarea({ proyectoId: "proyecto-1", nombre: "Original" });

    // Act
    useRaizStore
      .getState()
      .actualizarTarea(tarea.id, { nombre: "Actualizado" });

    // Assert
    const tareaActualizada = useRaizStore
      .getState()
      .tareas.find((t) => t.id === tarea.id);
    expect(tareaActualizada).toMatchObject({
      proyectoId: "proyecto-1",
      nombre: "Actualizado",
    });
  });

  it("reemplaza en crudo el temporizador activo", () => {
    // Act
    useRaizStore.getState().setTemporizadorActivo({
      tareaId: "tarea-1",
      horaInicio: "2026-07-13T09:00:00.000Z",
    });

    // Assert
    expect(useRaizStore.getState().temporizadorActivo).toEqual({
      tareaId: "tarea-1",
      horaInicio: "2026-07-13T09:00:00.000Z",
    });

    // Act: limpiar
    useRaizStore.getState().setTemporizadorActivo(null);

    // Assert
    expect(useRaizStore.getState().temporizadorActivo).toBeNull();
  });

  it("persiste cada mutación en el almacenamiento local", () => {
    // Act
    useRaizStore
      .getState()
      .crearProyecto({ nombre: "Proyecto Alpha", descripcion: "" });

    // Assert
    const contenidoCrudo = window.localStorage.getItem("time-tracker:estado");
    expect(contenidoCrudo).not.toBeNull();
    expect(JSON.parse(contenidoCrudo as string).proyectos).toHaveLength(1);
  });

  it("transiciona haHidratado de false a true al hidratar, leyendo el estado persistido", () => {
    // Arrange: un estado previamente persistido "desde otra sesión"
    window.localStorage.setItem(
      "time-tracker:estado",
      JSON.stringify({
        version: 1,
        proyectos: [
          { id: "proyecto-1", nombre: "Proyecto Alpha", descripcion: "" },
        ],
        tareas: [],
        registrosDeTiempo: [],
        temporizadorActivo: null,
      }),
    );
    expect(useRaizStore.getState().haHidratado).toBe(false);

    // Act
    useRaizStore.getState().hidratar();

    // Assert
    expect(useRaizStore.getState().haHidratado).toBe(true);
    expect(useRaizStore.getState().proyectos).toHaveLength(1);
  });

  it("es idempotente al invocar hidratar más de una vez", () => {
    // Arrange
    useRaizStore.getState().hidratar();
    useRaizStore
      .getState()
      .crearProyecto({ nombre: "Proyecto Beta", descripcion: "" });

    // Act: una segunda llamada a hidratar no debe pisar los datos ya creados en memoria
    useRaizStore.getState().hidratar();

    // Assert
    expect(useRaizStore.getState().proyectos).toHaveLength(1);
  });
});
