import { beforeEach, describe, expect, it } from "vitest";
import { useProjectStore } from "./project-store";

function aProjectInput(
  overrides: Partial<{ name: string; description?: string }> = {},
) {
  return {
    name: "Rediseño Web",
    description: "Actualización del sitio corporativo",
    ...overrides,
  };
}

describe("useProjectStore", () => {
  beforeEach(() => {
    localStorage.clear();
    useProjectStore.setState({ projects: [] });
  });

  it("crea un Proyecto con Nombre y Descripción", () => {
    // Arrange
    const input = aProjectInput();

    // Act
    const project = useProjectStore.getState().createProject(input);

    // Assert
    expect(project.name).toBe("Rediseño Web");
    expect(project.description).toBe("Actualización del sitio corporativo");
    expect(project.id).toBeTruthy();
    expect(useProjectStore.getState().projects).toEqual([project]);
  });

  it("crea un Proyecto solo con Nombre, sin Descripción", () => {
    // Arrange
    const input = aProjectInput({ description: undefined });

    // Act
    const project = useProjectStore.getState().createProject(input);

    // Assert
    expect(project.description).toBeUndefined();
  });

  it("rechaza la creación cuando el Nombre está vacío", () => {
    // Arrange
    const input = aProjectInput({ name: "   " });

    // Act & Assert
    expect(() => useProjectStore.getState().createProject(input)).toThrow(
      "El nombre del proyecto es obligatorio",
    );
    expect(useProjectStore.getState().projects).toEqual([]);
  });

  it("persiste el Proyecto creado en localStorage (ADR-011)", async () => {
    // Arrange
    const input = aProjectInput();

    // Act
    const project = useProjectStore.getState().createProject(input);
    await new Promise((resolve) => setTimeout(resolve, 0));

    // Assert
    const stored = JSON.parse(
      localStorage.getItem("time-tracker:projects") ?? "{}",
    );
    expect(stored.state.projects).toEqual([project]);
  });
});
