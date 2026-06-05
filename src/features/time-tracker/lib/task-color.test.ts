import { describe, expect, it } from "vitest";
import {
  getColorFromName,
  getProjectColorFromName,
  getTaskColorFromName,
} from "./task-color";

describe("getColorFromName", () => {
  it("devuelve el mismo color para el mismo nombre", () => {
    const first = getColorFromName("Desarrollo UI");
    const second = getColorFromName("Desarrollo UI");
    expect(first).toEqual(second);
  });

  it("normaliza mayúsculas y espacios", () => {
    expect(getColorFromName("  Tarea Demo  ")).toEqual(
      getColorFromName("tarea demo"),
    );
  });

  it("genera background, foreground y accent en formato hsl", () => {
    const colors = getColorFromName("Refinando Logotipos");
    expect(colors.background).toMatch(/^hsl\(/);
    expect(colors.foreground).toMatch(/^hsl\(/);
    expect(colors.accent).toMatch(/^hsl\(/);
  });
});

describe("getProjectColorFromName", () => {
  it("usa el nombre del proyecto para el accent del borde", () => {
    const colors = getProjectColorFromName("Quantum Redesign");
    expect(colors.accent).toMatch(/^hsl\(/);
  });
});

describe("getTaskColorFromName", () => {
  it("delega en getColorFromName", () => {
    expect(getTaskColorFromName("Demo")).toEqual(
      getColorFromName("Demo", "tarea"),
    );
  });
});
