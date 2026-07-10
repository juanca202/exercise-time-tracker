import { formatDateShortEs } from "./format-date-short-es";

const MINUTE_MS = 60_000;
const HOUR_MS = 60 * MINUTE_MS;
const DAY_MS = 24 * HOUR_MS;

/**
 * Formatea un timestamp (ms) como texto relativo corto ("hace 2h", "Ayer"),
 * como en la sección "Tareas Recientes" del prototipo de Figma. Más allá de
 * ayer, cae de vuelta a la fecha corta en español.
 */
export function formatRelativeTime(
  timestampMs: number,
  nowMs: number = Date.now(),
): string {
  const elapsedMs = nowMs - timestampMs;

  if (elapsedMs < HOUR_MS) {
    const minutes = Math.max(1, Math.floor(elapsedMs / MINUTE_MS));
    return `hace ${minutes}m`;
  }

  if (elapsedMs < DAY_MS) {
    const hours = Math.floor(elapsedMs / HOUR_MS);
    return `hace ${hours}h`;
  }

  if (elapsedMs < 2 * DAY_MS) {
    return "Ayer";
  }

  return formatDateShortEs(timestampMs);
}
