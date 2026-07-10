/**
 * Formatea un timestamp (ms) como hora corta de 12 horas con AM/PM (p. ej.
 * "09:15 AM"), tal como aparece en la tarjeta de actividad actual del
 * prototipo de Figma.
 */
export function formatTimeAmPm(timestampMs: number): string {
  const date = new Date(timestampMs);
  const hours24 = date.getHours();
  const period = hours24 >= 12 ? "PM" : "AM";
  const hours12 = hours24 % 12 === 0 ? 12 : hours24 % 12;
  const minutes = date.getMinutes().toString().padStart(2, "0");

  return `${hours12.toString().padStart(2, "0")}:${minutes} ${period}`;
}
