import { beforeEach, describe, expect, it } from "vitest";
import {
  crearEstadoPersistidoInicial,
  VERSION_ESQUEMA_ACTUAL,
} from "./estado-persistido";
import {
  escribirEstadoPersistido,
  leerEstadoPersistido,
  suscribirEstadoPersistido,
} from "./local-storage-adapter";

describe("adaptador de persistencia local", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("devuelve el estado inicial cuando no hay nada persistido", () => {
    // Act
    const estado = leerEstadoPersistido();

    // Assert
    expect(estado).toEqual(crearEstadoPersistidoInicial());
  });

  it("lee el mismo estado que fue escrito previamente", () => {
    // Arrange
    const estado = {
      ...crearEstadoPersistidoInicial(),
      proyectos: [
        { id: "proyecto-1", nombre: "Proyecto Alpha", descripcion: "" },
      ],
    };

    // Act
    escribirEstadoPersistido(estado);
    const estadoLeido = leerEstadoPersistido();

    // Assert
    expect(estadoLeido).toEqual(estado);
  });

  it("incluye el campo de versión de esquema al escribir", () => {
    // Act
    escribirEstadoPersistido(crearEstadoPersistidoInicial());
    const contenidoCrudo = window.localStorage.getItem("time-tracker:estado");

    // Assert
    expect(contenidoCrudo).not.toBeNull();
    expect(JSON.parse(contenidoCrudo as string).version).toBe(
      VERSION_ESQUEMA_ACTUAL,
    );
  });

  it("devuelve el estado inicial cuando el contenido almacenado está corrupto", () => {
    // Arrange
    window.localStorage.setItem(
      "time-tracker:estado",
      "{ esto no es JSON válido",
    );

    // Act
    const estado = leerEstadoPersistido();

    // Assert
    expect(estado).toEqual(crearEstadoPersistidoInicial());
  });

  it("notifica a los suscriptores cuando el estado cambia desde otra pestaña y permite desuscribirse", () => {
    // Arrange
    const estadosRecibidos: unknown[] = [];
    const desuscribir = suscribirEstadoPersistido((estado) =>
      estadosRecibidos.push(estado),
    );
    const nuevoEstado = crearEstadoPersistidoInicial();

    // Act
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: JSON.stringify(nuevoEstado),
      }),
    );
    desuscribir();
    window.dispatchEvent(
      new StorageEvent("storage", {
        key: "time-tracker:estado",
        newValue: JSON.stringify(nuevoEstado),
      }),
    );

    // Assert: solo se recibió la notificación previa a la desuscripción
    expect(estadosRecibidos).toEqual([nuevoEstado]);
  });
});
