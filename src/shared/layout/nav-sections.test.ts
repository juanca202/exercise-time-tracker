import { describe, expect, it } from "vitest";
import { NAV_SECTIONS, resolveActiveSection } from "./nav-sections";

describe("resolveActiveSection", () => {
  it("resuelve la sección de Tareas para la ruta raíz", () => {
    const section = resolveActiveSection("/");

    expect(section).toBe(NAV_SECTIONS[0]);
  });

  it("no resuelve Tareas para una ruta distinta a la raíz", () => {
    const section = resolveActiveSection("/proyectos");

    expect(section?.id).not.toBe("tasks");
  });

  it("resuelve la sección de Proyectos para su ruta", () => {
    const section = resolveActiveSection("/proyectos");

    expect(section?.id).toBe("projects");
  });

  it("resuelve la sección de Historial para su ruta", () => {
    const section = resolveActiveSection("/historial");

    expect(section?.id).toBe("history");
  });

  it("devuelve undefined para una ruta que no coincide con ninguna sección", () => {
    const section = resolveActiveSection("/no-existe");

    expect(section).toBeUndefined();
  });
});
