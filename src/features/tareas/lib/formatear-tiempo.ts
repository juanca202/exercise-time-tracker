/** Cantidad de minutos en una hora. */
const MINUTOS_POR_HORA = 60;
/** Cantidad de segundos en una hora. */
const SEGUNDOS_POR_HORA = 3600;
/** Cantidad de segundos en un minuto. */
const SEGUNDOS_POR_MINUTO = 60;

/**
 * Formatea una duración en minutos como texto "Xh Ym" (p. ej. "32h 45m"),
 * el formato usado por las tarjetas de stat (Total Semanal/Total Mensual) y
 * el sistema de diseño "Precision Focus" para duraciones largas. No lanza
 * excepción ante valores inválidos o negativos: los normaliza a "0h 0m".
 */
export function formatearHorasYMinutos(minutos: number): string {
  if (typeof minutos !== "number" || !Number.isFinite(minutos) || minutos < 0) {
    return "0h 0m";
  }

  const minutosEnteros = Math.round(minutos);
  const horas = Math.floor(minutosEnteros / MINUTOS_POR_HORA);
  const minutosRestantes = minutosEnteros % MINUTOS_POR_HORA;

  return `${horas}h ${minutosRestantes}m`;
}

/**
 * Formatea una duración en segundos como reloj "HH:MM:SS" (p. ej.
 * "01:02:10"), el formato del contador en vivo de la Sesión Activa y de la
 * Duración acumulada por Tarea en "Tareas Recientes". No lanza excepción
 * ante valores inválidos o negativos: los normaliza a "00:00:00".
 */
export function formatearHMS(segundos: number): string {
  if (
    typeof segundos !== "number" ||
    !Number.isFinite(segundos) ||
    segundos < 0
  ) {
    return "00:00:00";
  }

  const segundosEnteros = Math.floor(segundos);
  const horas = Math.floor(segundosEnteros / SEGUNDOS_POR_HORA);
  const minutos = Math.floor(
    (segundosEnteros % SEGUNDOS_POR_HORA) / SEGUNDOS_POR_MINUTO,
  );
  const segundosRestantes = segundosEnteros % SEGUNDOS_POR_MINUTO;

  return [horas, minutos, segundosRestantes]
    .map((valor) => String(valor).padStart(2, "0"))
    .join(":");
}

/**
 * Formatea un instante ISO 8601 como hora local corta de 12 horas con
 * sufijo AM/PM (p. ej. "09:15 AM"), usado por el rótulo "Iniciado a las…"
 * de la tarjeta de Sesión Activa. Devuelve `undefined` si `fechaIso` no es
 * parseable (defensivo, no lanza).
 */
export function formatearHoraAmPm(fechaIso: string): string | undefined {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return undefined;
  }

  const horas24 = fecha.getHours();
  const minutos = fecha.getMinutes();
  const periodo = horas24 >= 12 ? "PM" : "AM";
  const horas12 = horas24 % 12 === 0 ? 12 : horas24 % 12;

  return `${String(horas12).padStart(2, "0")}:${String(minutos).padStart(2, "0")} ${periodo}`;
}
