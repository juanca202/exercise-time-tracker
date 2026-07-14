import type { Page } from "@playwright/test";
import { TIME_TRACKER_STORAGE_KEY } from "@/shared/store/useTimeTrackerStore";
import type { Proyecto, RegistroDeTiempo, Tarea } from "@/shared/domain/types";

/**
 * Siembra el store raíz compartido (Zustand `persist`, RS-002) escribiendo
 * directamente el valor serializado que espera `persist` bajo
 * {@link TIME_TRACKER_STORAGE_KEY}, *antes* de que cualquier script de la
 * página se ejecute (`addInitScript`). Reutilizado por los E2E de
 * TC-001/TC-013/TC-014 para poblar `localStorage` con datos de prueba o
 * sintéticos sin pasar por la UI (fuera de alcance de esta feature de solo
 * lectura).
 */
export async function seedTimeTrackerStorage(
  page: Page,
  datos: {
    proyectos: Proyecto[];
    tareas: Tarea[];
    registrosDeTiempo: RegistroDeTiempo[];
  },
): Promise<void> {
  const valorPersistido = JSON.stringify({
    state: datos,
    version: 0,
  });

  await page.addInitScript(
    ({ key, valor }) => {
      window.localStorage.setItem(key, valor);
    },
    { key: TIME_TRACKER_STORAGE_KEY, valor: valorPersistido },
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
    { key: TIME_TRACKER_STORAGE_KEY, valor: valorCrudo },
  );
}
