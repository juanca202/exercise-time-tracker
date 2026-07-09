import { beforeEach, describe, expect, it, vi } from "vitest";
import { selectProjectTotalTime, useProjectsStore } from "./projectsStore";

function aProjectInput(
  overrides: Partial<{ name: string; description?: string }> = {},
) {
  return {
    name: "Rediseño Web",
    description: "Actualización del sitio corporativo",
    ...overrides,
  };
}

describe("projectsStore", () => {
  beforeEach(() => {
    useProjectsStore.setState({ projects: [] });
    localStorage.clear();
  });

  it("crea un Proyecto con Nombre y Descripción", () => {
    const input = aProjectInput();

    const project = useProjectsStore
      .getState()
      .addProject(input.name, input.description);

    expect(project).not.toBeNull();
    expect(useProjectsStore.getState().projects).toMatchObject([
      { name: input.name, description: input.description },
    ]);
  });

  it("crea un Proyecto solo con Nombre, sin Descripción", () => {
    const input = aProjectInput({ description: undefined });

    const project = useProjectsStore.getState().addProject(input.name);

    expect(project?.description).toBeUndefined();
    expect(useProjectsStore.getState().projects).toHaveLength(1);
  });

  it("rechaza la creación cuando el Nombre está vacío y no persiste el intento", () => {
    const project = useProjectsStore.getState().addProject("");

    expect(project).toBeNull();
    expect(useProjectsStore.getState().projects).toHaveLength(0);
  });

  it("rechaza la creación cuando el Nombre es solo espacios en blanco", () => {
    const project = useProjectsStore.getState().addProject("   ");

    expect(project).toBeNull();
    expect(useProjectsStore.getState().projects).toHaveLength(0);
  });

  it("retorna 0 como tiempo total de cualquier Proyecto (hasta que exista track-task-time)", () => {
    expect(selectProjectTotalTime("cualquier-id")).toBe(0);
  });
});

describe("projectsStore — persistencia en localStorage", () => {
  beforeEach(() => {
    localStorage.clear();
    vi.resetModules();
  });

  it("recupera Proyectos ya guardados en localStorage al rehidratar", async () => {
    const persisted = {
      state: {
        projects: [
          {
            id: "existing-id",
            name: "Auditoría Anual",
            description: "Revisión de procesos internos",
            createdAt: "2026-07-08T00:00:00.000Z",
          },
        ],
      },
      version: 0,
    };
    localStorage.setItem("time-tracker/projects", JSON.stringify(persisted));

    const { useProjectsStore: freshStore } = await import("./projectsStore");
    await freshStore.persist.rehydrate();

    expect(freshStore.getState().projects).toMatchObject([
      { name: "Auditoría Anual", description: "Revisión de procesos internos" },
    ]);
  });
});
