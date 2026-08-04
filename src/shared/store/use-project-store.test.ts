import { beforeEach, describe, expect, it } from "vitest";
import { localStorageAdapter } from "@/shared/persistence/local-storage-adapter";
import { useProjectStore } from "./use-project-store";

function resetStore() {
  useProjectStore.setState({ projects: [] });
}

describe("useProjectStore", () => {
  beforeEach(() => {
    resetStore();
  });

  it("crea un Proyecto y lo agrega al listado", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "Rediseño de Marca", description: "Q4" });

    expect(useProjectStore.getState().projects).toEqual([project]);
    expect(project.name).toBe("Rediseño de Marca");
    expect(project.description).toBe("Q4");
    expect(project.id).toBeTruthy();
  });

  it("edita el Nombre y la Descripción de un Proyecto existente", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "Original", description: "Original desc" });

    useProjectStore.getState().updateProject(project.id, {
      name: "Editado",
      description: "Nueva desc",
    });

    expect(useProjectStore.getState().projects).toEqual([
      { id: project.id, name: "Editado", description: "Nueva desc" },
    ]);
  });

  it("elimina un Proyecto por id", () => {
    const project = useProjectStore
      .getState()
      .createProject({ name: "A eliminar", description: "" });

    useProjectStore.getState().deleteProject(project.id);

    expect(useProjectStore.getState().projects).toEqual([]);
  });

  it("persiste los Proyectos en localStorage bajo la clave versionada", () => {
    useProjectStore
      .getState()
      .createProject({ name: "Rediseño de Marca", description: "Q4" });

    const raw = localStorageAdapter.getItem("proyectos");

    expect(raw).not.toBeNull();
    const persisted = JSON.parse(raw!);
    expect(persisted.state.projects).toHaveLength(1);
    expect(persisted.state.projects[0].name).toBe("Rediseño de Marca");
  });

  it("rehidrata los Proyectos persistidos en localStorage tras un reinicio simulado", async () => {
    // Simula lo que localStorage contiene al final de una sesión anterior
    // (creaciones, ediciones y eliminaciones ya aplicadas), sin pasar por el
    // store en memoria, para verificar que un reinicio real (que solo
    // rehidrata desde el storage) recupera ese estado correctamente.
    localStorageAdapter.setItem(
      "proyectos",
      JSON.stringify({
        state: {
          projects: [{ id: "p1", name: "A editado", description: "x" }],
        },
        version: 0,
      }),
    );

    await useProjectStore.persist.rehydrate();

    expect(useProjectStore.getState().projects).toEqual([
      { id: "p1", name: "A editado", description: "x" },
    ]);
  });
});
