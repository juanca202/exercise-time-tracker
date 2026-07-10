/**
 * Formatea un timestamp (ms) como fecha local "AAAA-MM-DD", usando los
 * componentes de fecha locales (no UTC) para evitar corrimientos de día
 * cerca de la medianoche en husos horarios con offset negativo.
 */
export function formatDate(timestampMs: number): string {
  const date = new Date(timestampMs);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}
