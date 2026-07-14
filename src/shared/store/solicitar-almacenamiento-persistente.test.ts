import { afterEach, describe, expect, it, vi } from "vitest";
import { solicitarAlmacenamientoPersistente } from "./solicitar-almacenamiento-persistente";

const descriptorOriginalDeStorage = Object.getOwnPropertyDescriptor(
  navigator,
  "storage",
);

describe("solicitarAlmacenamientoPersistente", () => {
  afterEach(() => {
    if (descriptorOriginalDeStorage) {
      Object.defineProperty(navigator, "storage", descriptorOriginalDeStorage);
    }
  });

  it("invoca navigator.storage.persist() cuando la API existe", () => {
    // Arrange
    const persist = vi.fn().mockResolvedValue(true);
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: { persist },
    });

    // Act
    solicitarAlmacenamientoPersistente();

    // Assert
    expect(persist).toHaveBeenCalledTimes(1);
  });

  it("no falla ni bloquea cuando navigator.storage no existe en el entorno", () => {
    // Arrange
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: undefined,
    });

    // Act & Assert: no debe lanzar.
    expect(() => solicitarAlmacenamientoPersistente()).not.toThrow();
  });

  it("no falla cuando la promesa de persist() es rechazada (permiso denegado)", async () => {
    // Arrange
    const persist = vi.fn().mockRejectedValue(new Error("permiso denegado"));
    Object.defineProperty(navigator, "storage", {
      configurable: true,
      value: { persist },
    });

    // Act & Assert
    expect(() => solicitarAlmacenamientoPersistente()).not.toThrow();
    await vi.waitFor(() => expect(persist).toHaveBeenCalledTimes(1));
  });
});
