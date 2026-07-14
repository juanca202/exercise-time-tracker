import { beforeEach, describe, expect, it, vi } from "vitest";
import type { AdaptadorPersistenciaLocal } from "../persistence";
import { estadoPersistidoVacio } from "../persistence";
import { crearStoreRaiz } from "./store-raiz";

/** Object Mother: adaptador de persistencia en memoria, aislado por prueba. */
const unAdaptadorEnMemoria = (): AdaptadorPersistenciaLocal => {
  let estadoGuardado: ReturnType<typeof estadoPersistidoVacio> | null = null;

  return {
    leer: vi.fn(() => estadoGuardado),
    escribir: vi.fn((estado) => {
      estadoGuardado = estado;
    }),
    suscribir: vi.fn(() => () => {}),
  };
};

describe("store raíz: hidratación", () => {
  it("haHidratado inicia en false y pasa a true tras hidratar()", () => {
    const store = crearStoreRaiz(unAdaptadorEnMemoria());

    expect(store.getState().haHidratado).toBe(false);

    store.getState().hidratar();

    expect(store.getState().haHidratado).toBe(true);
  });

  it("hidratar() carga proyectos previamente persistidos", () => {
    const adaptador = unAdaptadorEnMemoria();
    const primerStore = crearStoreRaiz(adaptador);
    primerStore.getState().hidratar();
    primerStore
      .getState()
      .crearProyecto({ nombre: "Proyecto A", descripcion: "" });

    const segundoStore = crearStoreRaiz(adaptador);
    segundoStore.getState().hidratar();

    expect(segundoStore.getState().proyectos).toHaveLength(1);
    expect(segundoStore.getState().proyectos[0]?.nombre).toBe("Proyecto A");
  });

  it("hidratar() es idempotente: llamarlo dos veces no duplica la suscripción ni el estado", () => {
    const adaptador = unAdaptadorEnMemoria();
    const store = crearStoreRaiz(adaptador);

    store.getState().hidratar();
    store.getState().hidratar();

    expect(adaptador.suscribir).toHaveBeenCalledTimes(1);
  });
});

describe("store raíz: CRUD crudo de Proyecto", () => {
  let store: ReturnType<typeof crearStoreRaiz>;

  beforeEach(() => {
    store = crearStoreRaiz(unAdaptadorEnMemoria());
    store.getState().hidratar();
  });

  it("crearProyecto agrega el proyecto sin aplicar validación de negocio", () => {
    const creado = store
      .getState()
      .crearProyecto({ nombre: "", descripcion: "" });

    expect(store.getState().listarProyectos()).toEqual([creado]);
    expect(creado.nombre).toBe("");
  });

  it("crearProyecto asigna id y timestamps", () => {
    const creado = store.getState().crearProyecto({
      nombre: "Proyecto A",
      descripcion: "Descripción A",
    });

    expect(creado.id).toBeTruthy();
    expect(creado.creadoEn).toBeTruthy();
    expect(creado.actualizadoEn).toBeTruthy();
  });

  it("actualizarProyecto reemplaza los campos provistos sin aplicar reglas de negocio", () => {
    const creado = store
      .getState()
      .crearProyecto({ nombre: "Original", descripcion: "Original" });

    store.getState().actualizarProyecto(creado.id, { nombre: "" });

    const actualizado = store
      .getState()
      .listarProyectos()
      .find((proyecto) => proyecto.id === creado.id);

    expect(actualizado?.nombre).toBe("");
    expect(actualizado?.descripcion).toBe("Original");
  });

  it("listarProyectos devuelve la colección completa tal como está persistida", () => {
    store.getState().crearProyecto({ nombre: "A", descripcion: "" });
    store.getState().crearProyecto({ nombre: "B", descripcion: "" });

    expect(store.getState().listarProyectos()).toHaveLength(2);
  });
});
