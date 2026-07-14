import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { crearProyectoDePrueba } from "@/shared/domain/object-mother";
import { escribir, leer, suscribir } from "./adaptador";
import {
  crearEstadoPersistidoInicial,
  VERSION_ESQUEMA_ESTADO_PERSISTIDO,
} from "./estado-persistido";

describe("adaptador de persistencia local", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("leer() devuelve null cuando todavía no hay nada persistido", () => {
    // Act & Assert
    expect(leer()).toBeNull();
  });

  it("escribir() persiste el estado completo y leer() lo recupera igual", () => {
    // Arrange
    const estado = {
      ...crearEstadoPersistidoInicial(),
      proyectos: [crearProyectoDePrueba({ nombre: "Proyecto persistido" })],
    };

    // Act
    escribir(estado);
    const estadoLeido = leer();

    // Assert
    expect(estadoLeido).toEqual(estado);
  });

  it("el estado escrito incluye el campo version del esquema", () => {
    // Arrange
    const estado = crearEstadoPersistidoInicial();

    // Act
    escribir(estado);
    const estadoLeido = leer();

    // Assert
    expect(estadoLeido?.version).toBe(VERSION_ESQUEMA_ESTADO_PERSISTIDO);
  });

  it("los datos sobreviven a una nueva lectura simulando un reinicio de la aplicación", () => {
    // Arrange: escribir simula la sesión previa a un cierre inesperado.
    const estado = {
      ...crearEstadoPersistidoInicial(),
      proyectos: [crearProyectoDePrueba()],
    };
    escribir(estado);

    // Act: una nueva llamada a leer() simula reabrir la aplicación.
    const estadoTrasReinicio = leer();

    // Assert
    expect(estadoTrasReinicio).toEqual(estado);
  });

  describe("suscribir()", () => {
    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("notifica al listener con el estado actualizado cuando otra pestaña escribe", () => {
      // Arrange
      const estadoActualizado = {
        ...crearEstadoPersistidoInicial(),
        proyectos: [
          crearProyectoDePrueba({ nombre: "Escrito desde otra pestaña" }),
        ],
      };
      window.localStorage.setItem(
        "time-tracker:estado",
        JSON.stringify(estadoActualizado),
      );
      const listener = vi.fn();

      // Act
      suscribir(listener);
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "time-tracker:estado",
          newValue: "irrelevante",
        }),
      );

      // Assert
      expect(listener).toHaveBeenCalledWith(estadoActualizado);
    });

    it("ignora eventos storage de otras claves", () => {
      // Arrange
      const listener = vi.fn();
      suscribir(listener);

      // Act
      window.dispatchEvent(
        new StorageEvent("storage", { key: "otra-clave", newValue: "x" }),
      );

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });

    it("deja de notificar tras desuscribirse", () => {
      // Arrange
      const listener = vi.fn();
      const desuscribir = suscribir(listener);
      desuscribir();

      // Act
      window.localStorage.setItem(
        "time-tracker:estado",
        JSON.stringify(crearEstadoPersistidoInicial()),
      );
      window.dispatchEvent(
        new StorageEvent("storage", {
          key: "time-tracker:estado",
          newValue: "irrelevante",
        }),
      );

      // Assert
      expect(listener).not.toHaveBeenCalled();
    });
  });
});
