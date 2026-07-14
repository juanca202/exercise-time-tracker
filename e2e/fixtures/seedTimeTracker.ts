import type { Page } from "@playwright/test";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain";
import {
  CLAVE_ALMACENAMIENTO,
  VERSION_ESQUEMA_ESTADO_PERSISTIDO,
} from "@/shared/persistence";

/**
 * Siembra el store raíz compartido escribiendo directamente el
 * `EstadoPersistido` que espera el adaptador de persistencia local
 * (`@/shared/persistence/adaptador.ts`) bajo {@link CLAVE_ALMACENAMIENTO},
 * *antes* de que cualquier script de la página se ejecute
 * (`addInitScript`). Reutilizado por los E2E de TC-001/TC-013/TC-014 para
 * poblar `localStorage` con datos de prueba o sintéticos sin pasar por la
 * UI (fuera de alcance de esta feature de solo lectura).
 */
export async function seedTimeTrackerStorage(
  page: Page,
  datos: {
    proyectos: Proyecto[];
    tareas: Tarea[];
    registrosDeTiempo: RegistroDeTiempo[];
  },
): Promise<void> {
  const estadoPersistido = JSON.stringify({
    version: VERSION_ESQUEMA_ESTADO_PERSISTIDO,
    proyectos: datos.proyectos,
    tareas: datos.tareas,
    registrosDeTiempo: datos.registrosDeTiempo,
    temporizadorActivo: null,
  });

  await page.addInitScript(
    ({ key, valor }) => {
      window.localStorage.setItem(key, valor);
    },
    { key: CLAVE_ALMACENAMIENTO, valor: estadoPersistido },
  );
}

/** Escribe un valor crudo (potencialmente inválido) bajo la misma clave, para TC-002. */
export async function seedRawLocalStorage(
  page: Page,
  valorCrudo: string,
): Promise<void> {
  await page.addInitScript(
    ({ key, valor }) => {
      window.localStorage.setItem(key, valor);
    },
    { key: CLAVE_ALMACENAMIENTO, valor: valorCrudo },
  );
}

/**
 * Genera un conjunto de datos sintéticos (Proyectos, Tareas y Registros de
 * Tiempo) para las pruebas de volumen de rendimiento (TC-013/TC-014,
 * AC-005): distribuye los Registros entre varios Proyectos, Tareas y meses
 * distintos, con la forma completa del dominio compartido
 * (`@/shared/domain`).
 */
export function generarDatosSinteticos(cantidadDeRegistros: number): {
  proyectos: Proyecto[];
  tareas: Tarea[];
  registrosDeTiempo: RegistroDeTiempo[];
} {
  const CANTIDAD_PROYECTOS = 5;
  const TAREAS_POR_PROYECTO = 3;
  const CANTIDAD_MESES = 6;
  const CREADO_EN = "2026-01-01T00:00:00.000Z";

  const proyectos: Proyecto[] = Array.from(
    { length: CANTIDAD_PROYECTOS },
    (_, indice) => ({
      id: `P-${indice + 1}`,
      nombre: `Proyecto Sintético ${indice + 1}`,
      creadoEn: CREADO_EN,
    }),
  );

  const tareas: Tarea[] = proyectos.flatMap((proyecto, indiceProyecto) =>
    Array.from({ length: TAREAS_POR_PROYECTO }, (_, indiceTarea) => ({
      id: `T-${indiceProyecto * TAREAS_POR_PROYECTO + indiceTarea + 1}`,
      nombre: `Tarea Sintética ${indiceProyecto * TAREAS_POR_PROYECTO + indiceTarea + 1}`,
      proyectoId: proyecto.id,
      creadoEn: CREADO_EN,
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
        fecha: `2026-${mesFormateado}-${diaFormateado}`,
        duracionMinutos: 15 + (indice % 8) * 15,
        creadoEn: CREADO_EN,
      };
    },
  );

  return { proyectos, tareas, registrosDeTiempo };
}
