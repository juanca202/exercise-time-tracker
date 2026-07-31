import { beforeEach, describe, expect, it, vi } from "vitest";
import { localStorageAdapter, onStorageChange } from "./local-storage-adapter";

describe("localStorageAdapter", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("almacena y recupera un valor bajo una clave versionada", () => {
    localStorageAdapter.setItem("proyectos", '[{"id":"1"}]');

    const value = localStorageAdapter.getItem("proyectos");

    expect(value).toBe('[{"id":"1"}]');
    expect(localStorage.getItem("timetracker:v1:proyectos")).toBe(
      '[{"id":"1"}]',
    );
  });

  it("devuelve null para una clave que no existe", () => {
    const value = localStorageAdapter.getItem("inexistente");

    expect(value).toBeNull();
  });

  it("elimina un valor almacenado", () => {
    localStorageAdapter.setItem("proyectos", "[]");

    localStorageAdapter.removeItem("proyectos");

    expect(localStorageAdapter.getItem("proyectos")).toBeNull();
  });
});

describe("onStorageChange", () => {
  it("invoca el callback cuando el evento storage coincide con la clave versionada", () => {
    const callback = vi.fn();
    const unsubscribe = onStorageChange("proyectos", callback);

    window.dispatchEvent(
      new StorageEvent("storage", { key: "timetracker:v1:proyectos" }),
    );

    expect(callback).toHaveBeenCalledOnce();
    unsubscribe();
  });

  it("no invoca el callback para un evento storage de otra clave", () => {
    const callback = vi.fn();
    const unsubscribe = onStorageChange("proyectos", callback);

    window.dispatchEvent(
      new StorageEvent("storage", { key: "timetracker:v1:tareas" }),
    );

    expect(callback).not.toHaveBeenCalled();
    unsubscribe();
  });

  it("deja de invocar el callback tras desuscribirse", () => {
    const callback = vi.fn();
    const unsubscribe = onStorageChange("proyectos", callback);
    unsubscribe();

    window.dispatchEvent(
      new StorageEvent("storage", { key: "timetracker:v1:proyectos" }),
    );

    expect(callback).not.toHaveBeenCalled();
  });
});
