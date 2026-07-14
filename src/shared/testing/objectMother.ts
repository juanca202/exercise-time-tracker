import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain/types";

/**
 * Object Mother (ADR-007) para construir fixtures de dominio legibles y
 * reutilizables en pruebas, con valores por defecto sensatos que cada
 * prueba puede sobrescribir vía `overrides`.
 */

let contadorProyecto = 0;
let contadorTarea = 0;
let contadorRegistro = 0;

export function reiniciarContadoresDeFixtures(): void {
  contadorProyecto = 0;
  contadorTarea = 0;
  contadorRegistro = 0;
}

export function crearProyecto(overrides: Partial<Proyecto> = {}): Proyecto {
  contadorProyecto += 1;
  return {
    id: `P-${contadorProyecto}`,
    nombre: `Proyecto ${contadorProyecto}`,
    ...overrides,
  };
}

export function crearTarea(overrides: Partial<Tarea> = {}): Tarea {
  contadorTarea += 1;
  return {
    id: `T-${contadorTarea}`,
    nombre: `Tarea ${contadorTarea}`,
    proyectoId: "P-1",
    ...overrides,
  };
}

export function crearRegistroDeTiempo(
  overrides: Partial<RegistroDeTiempo> = {},
): RegistroDeTiempo {
  contadorRegistro += 1;
  return {
    id: `RT-${contadorRegistro}`,
    tareaId: "T-1",
    origen: "manual",
    horaInicio: "2026-06-01T09:00:00",
    duracion: 60,
    ...overrides,
  };
}

/**
 * Genera un conjunto de datos sintéticos (Proyectos, Tareas y Registros de
 * Tiempo) para pruebas de volumen (TC-013/TC-014): distribuye los Registros
 * entre varios Proyectos, Tareas y meses distintos.
 */
export function generarDatosSinteticos(cantidadDeRegistros: number): {
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
} {
  const CANTIDAD_PROYECTOS = 5;
  const TAREAS_POR_PROYECTO = 3;
  const CANTIDAD_MESES = 6;

  const proyectos: Proyecto[] = Array.from(
    { length: CANTIDAD_PROYECTOS },
    (_, indice) => ({
      id: `P-${indice + 1}`,
      nombre: `Proyecto Sintético ${indice + 1}`,
    }),
  );

  const tareas: Tarea[] = proyectos.flatMap((proyecto, indiceProyecto) =>
    Array.from({ length: TAREAS_POR_PROYECTO }, (_, indiceTarea) => ({
      id: `T-${indiceProyecto * TAREAS_POR_PROYECTO + indiceTarea + 1}`,
      nombre: `Tarea Sintética ${indiceProyecto * TAREAS_POR_PROYECTO + indiceTarea + 1}`,
      proyectoId: proyecto.id,
    })),
  );

  const registrosDeTiempo: RegistroDeTiempo[] = Array.from(
    { length: cantidadDeRegistros },
    (_, indice) => {
      const tarea = tareas[indice % tareas.length];
      const mes = (indice % CANTIDAD_MESES) + 1;
      const dia = (indice % 27) + 1;
      const mesFormateado = String(mes).padStart(2, "0");
      const diaFormateado = String(dia).padStart(2, "0");

      return {
        id: `RT-${indice + 1}`,
        tareaId: tarea.id,
        origen: "manual",
        horaInicio: `2026-${mesFormateado}-${diaFormateado}T09:00:00`,
        duracion: 15 + (indice % 8) * 15,
      };
    },
  );

  return { proyectos, tareas, registrosDeTiempo };
}
