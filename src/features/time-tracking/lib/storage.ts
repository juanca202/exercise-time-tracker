import type { TimeTrackingState } from "../types/domain";

/** Clave de almacenamiento local versionada del dominio de Time Tracking. */
export const STORAGE_KEY = "time-tracker:v1";

/**
 * Lee el estado persistido del dominio desde `localStorage`.
 *
 * @returns El estado persistido, o `null` si no hay nada guardado, si el
 * entorno no tiene `window` (renderizado en servidor) o si el contenido
 * almacenado no es JSON válido.
 */
export function loadState(): TimeTrackingState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.localStorage.getItem(STORAGE_KEY);
  if (raw === null) {
    return null;
  }

  try {
    return JSON.parse(raw) as TimeTrackingState;
  } catch {
    return null;
  }
}

/**
 * Persiste el estado del dominio en `localStorage`. No hace nada si el
 * entorno no tiene `window` (renderizado en servidor).
 */
export function saveState(state: TimeTrackingState): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}
