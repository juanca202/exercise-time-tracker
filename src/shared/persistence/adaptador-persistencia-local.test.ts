import { beforeEach, describe, expect, it, vi } from "vitest";
import type { Proyecto } from "../domain";
import { crearAdaptadorPersistenciaLocal } from "./adaptador-persistencia-local";
import {
  estadoPersistidoVacio,
  VERSION_ESQUEMA_ACTUAL,
  type EstadoPersistido,
} from "./estado-persistido";

/** Object Mother: construye un estado persistido con un Proyecto de ejemplo. */
const unProyecto = (overrides: Partial<Proyecto> = {}): Proyecto => ({
  id: "proyecto-1",
  nombre: "Proyecto de ejemplo",
  descripcion: "",
  creadoEn: "2026-07-13T10:00:00.000Z",
  actualizadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const unEstadoPersistido = (
  overrides: Partial<EstadoPersistido> = {},
): EstadoPersistido => ({
  ...estadoPersistidoVacio(),
  ...overrides,
});

describe("adaptadorPersistenciaLocal", () => {
  beforeEach(() => {
    globalThis.localStorage.clear();
  });

  it("leer() devuelve null cuando no hay nada persistido aún", () => {
    const adaptador = crearAdaptadorPersistenciaLocal();

    expect(adaptador.leer()).toBeNull();
  });

  it("escribir() y luego leer() devuelve el mismo estado, incluyendo la versión de esquema", () => {
    const adaptador = crearAdaptadorPersistenciaLocal();
    const estado = unEstadoPersistido({ proyectos: [unProyecto()] });

    adaptador.escribir(estado);
    const leido = adaptador.leer();

    expect(leido).toEqual(estado);
    expect(leido?.version).toBe(VERSION_ESQUEMA_ACTUAL);
  });

  it("leer() devuelve null si el contenido persistido está corrupto", () => {
    const adaptador = crearAdaptadorPersistenciaLocal();
    globalThis.localStorage.setItem("time-tracker:estado", "{no-es-json");

    expect(adaptador.leer()).toBeNull();
  });

  it("suscribir() notifica al listener ante un evento de storage externo y permite desuscribirse", () => {
    const adaptador = crearAdaptadorPersistenciaLocal();
    const listener = vi.fn();
    const desuscribir = adaptador.suscribir(listener);
    const estadoExterno = unEstadoPersistido({ proyectos: [unProyecto()] });

    globalThis.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: JSON.stringify(estadoExterno),
      }),
    );

    expect(listener).toHaveBeenCalledWith(estadoExterno);

    desuscribir();
    listener.mockClear();

    globalThis.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: JSON.stringify(estadoExterno),
      }),
    );

    expect(listener).not.toHaveBeenCalled();
  });

  it("suscribir() ignora eventos de storage de otras claves", () => {
    const adaptador = crearAdaptadorPersistenciaLocal();
    const listener = vi.fn();
    adaptador.suscribir(listener);

    globalThis.dispatchEvent(
      new StorageEvent("storage", {
        key: "otra-clave",
        newValue: "irrelevante",
      }),
    );

    expect(listener).not.toHaveBeenCalled();
  });
});
