import { beforeEach, describe, expect, it } from "vitest";
import {
  crearProyectoDePrueba,
  crearRegistroDeTiempoDePrueba,
  crearTareaDePrueba,
} from "@/shared/domain/object-mother";
import { leer } from "@/shared/persistence";
import { useAppStore } from "./app-store";

function reiniciarStoreParaPruebas(): void {
  window.localStorage.clear();
  useAppStore.setState(
    {
      proyectos: [],
      tareas: [],
      registrosDeTiempo: [],
      temporizadorActivo: null,
      haHidratado: false,
    },
    false,
  );
}

describe("store raíz (CRUD crudo por entidad)", () => {
  beforeEach(() => {
    reiniciarStoreParaPruebas();
  });

  it("haHidratado inicia en false", () => {
    // Assert
    expect(useAppStore.getState().haHidratado).toBe(false);
  });

  it("hidratar() pasa haHidratado de false a true", () => {
    // Act
    useAppStore.getState().hidratar();

    // Assert
    expect(useAppStore.getState().haHidratado).toBe(true);
  });

  it("hidratar() carga las entidades previamente persistidas", () => {
    // Arrange: persiste datos "de una sesión anterior" antes de hidratar,
    // sin borrar lo ya escrito en localStorage (a diferencia de reiniciarStoreParaPruebas).
    const proyecto = crearProyectoDePrueba();
    useAppStore.getState().crearProyecto(proyecto);
    useAppStore.setState({ proyectos: [], haHidratado: false }, false);

    // Act
    useAppStore.getState().hidratar();

    // Assert
    expect(useAppStore.getState().proyectos).toEqual([proyecto]);
    expect(useAppStore.getState().haHidratado).toBe(true);
  });

  it("crearProyecto agrega el proyecto y lo persiste, sin validación adicional", () => {
    // Arrange: un nombre vacío no es válido para la historia funcional de Proyectos,
    // pero el store raíz no aplica esa regla de negocio (BR-01).
    const proyectoSinNombre = crearProyectoDePrueba({ nombre: "" });

    // Act
    useAppStore.getState().crearProyecto(proyectoSinNombre);

    // Assert: se acepta y se persiste tal cual, sin lanzar ni filtrar.
    expect(useAppStore.getState().proyectos).toEqual([proyectoSinNombre]);
    expect(leer()?.proyectos).toEqual([proyectoSinNombre]);
  });

  it("actualizarProyecto reemplaza los campos provistos y persiste el cambio", () => {
    // Arrange
    const proyecto = crearProyectoDePrueba({ nombre: "Original" });
    useAppStore.getState().crearProyecto(proyecto);

    // Act
    useAppStore
      .getState()
      .actualizarProyecto(proyecto.id, { nombre: "Actualizado" });

    // Assert
    expect(useAppStore.getState().proyectos).toEqual([
      { ...proyecto, nombre: "Actualizado" },
    ]);
    expect(leer()?.proyectos).toEqual([{ ...proyecto, nombre: "Actualizado" }]);
  });

  it("listar proyectos devuelve la colección completa, sin filtrar", () => {
    // Arrange
    const proyectoUno = crearProyectoDePrueba();
    const proyectoDos = crearProyectoDePrueba();

    // Act
    useAppStore.getState().crearProyecto(proyectoUno);
    useAppStore.getState().crearProyecto(proyectoDos);

    // Assert
    expect(useAppStore.getState().proyectos).toEqual([
      proyectoUno,
      proyectoDos,
    ]);
  });

  it("crearTarea y actualizarTarea operan de forma cruda, sin validar la relación con Proyecto", () => {
    // Arrange
    const tarea = crearTareaDePrueba({ proyectoId: "proyecto-inexistente" });

    // Act
    useAppStore.getState().crearTarea(tarea);
    useAppStore
      .getState()
      .actualizarTarea(tarea.id, { nombre: "Tarea renombrada" });

    // Assert: el store no valida que "proyecto-inexistente" exista; esa regla es de la feature.
    expect(useAppStore.getState().tareas).toEqual([
      { ...tarea, nombre: "Tarea renombrada" },
    ]);
  });

  it("crearRegistroDeTiempo y actualizarRegistroDeTiempo operan de forma cruda", () => {
    // Arrange: una duración de 0 no es válida para la historia funcional (RF-010, RF-013),
    // pero el store raíz no aplica esa validación (BR-01).
    const registro = crearRegistroDeTiempoDePrueba({ duracionMinutos: 0 });

    // Act
    useAppStore.getState().crearRegistroDeTiempo(registro);
    useAppStore
      .getState()
      .actualizarRegistroDeTiempo(registro.id, { duracionMinutos: 15 });

    // Assert
    expect(useAppStore.getState().registrosDeTiempo).toEqual([
      { ...registro, duracionMinutos: 15 },
    ]);
  });

  it("establecerTemporizadorActivo reemplaza el temporizador único de la aplicación", () => {
    // Arrange
    const tarea = crearTareaDePrueba();

    // Act
    useAppStore.getState().establecerTemporizadorActivo({
      tareaId: tarea.id,
      horaInicio: "2026-01-15T09:00:00.000Z",
    });

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toEqual({
      tareaId: tarea.id,
      horaInicio: "2026-01-15T09:00:00.000Z",
    });

    // Act: también permite limpiarlo.
    useAppStore.getState().establecerTemporizadorActivo(null);

    // Assert
    expect(useAppStore.getState().temporizadorActivo).toBeNull();
  });
});
