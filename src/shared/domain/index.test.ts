import { describe, expect, it } from "vitest";
import type {
  Proyecto,
  RegistroDeTiempo,
  Tarea,
  TemporizadorActivo,
} from "./index";

/** Object Mother: construye instancias completas de cada entidad de dominio. */
const unProyecto = (overrides: Partial<Proyecto> = {}): Proyecto => ({
  id: "proyecto-1",
  nombre: "Proyecto de ejemplo",
  descripcion: "Descripción de ejemplo",
  creadoEn: "2026-07-13T10:00:00.000Z",
  actualizadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const unaTarea = (overrides: Partial<Tarea> = {}): Tarea => ({
  id: "tarea-1",
  proyectoId: "proyecto-1",
  titulo: "Tarea de ejemplo",
  descripcion: "",
  completada: false,
  creadoEn: "2026-07-13T10:00:00.000Z",
  actualizadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

const unRegistroDeTiempo = (
  overrides: Partial<RegistroDeTiempo> = {},
): RegistroDeTiempo => ({
  id: "registro-1",
  tareaId: "tarea-1",
  inicio: "2026-07-13T10:00:00.000Z",
  fin: "2026-07-13T10:30:00.000Z",
  duracionSegundos: 1800,
  creadoEn: "2026-07-13T10:30:00.000Z",
  ...overrides,
});

const unTemporizadorActivo = (
  overrides: Partial<TemporizadorActivo> = {},
): TemporizadorActivo => ({
  tareaId: "tarea-1",
  iniciadoEn: "2026-07-13T10:00:00.000Z",
  ...overrides,
});

describe("tipos de dominio compartidos", () => {
  it("Proyecto incluye id, nombre, descripcion y campos temporales completos", () => {
    const proyecto = unProyecto();

    expect(proyecto).toEqual({
      id: "proyecto-1",
      nombre: "Proyecto de ejemplo",
      descripcion: "Descripción de ejemplo",
      creadoEn: "2026-07-13T10:00:00.000Z",
      actualizadoEn: "2026-07-13T10:00:00.000Z",
    });
  });

  it("Tarea exige la relación obligatoria con Proyecto (proyectoId)", () => {
    const tarea = unaTarea({ proyectoId: "proyecto-42" });

    expect(tarea.proyectoId).toBe("proyecto-42");
  });

  it("RegistroDeTiempo exige la relación obligatoria con Tarea (tareaId)", () => {
    const registro = unRegistroDeTiempo({ tareaId: "tarea-99" });

    expect(registro.tareaId).toBe("tarea-99");
  });

  it("TemporizadorActivo referencia la Tarea sobre la que corre", () => {
    const temporizador = unTemporizadorActivo({ tareaId: "tarea-7" });

    expect(temporizador.tareaId).toBe("tarea-7");
  });
});
