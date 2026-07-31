import { beforeEach, describe, expect, it } from "vitest";
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
});
