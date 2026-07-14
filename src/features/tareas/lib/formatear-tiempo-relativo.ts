/** Cantidad de milisegundos en un minuto. */
const MS_POR_MINUTO = 60_000;
/** Cantidad de minutos en una hora. */
const MINUTOS_POR_HORA = 60;
/** Cantidad de horas en un día. */
const HORAS_POR_DIA = 24;

/**
 * Formatea el tiempo transcurrido desde `fechaIso` hasta `ahora` como texto
 * relativo aproximado ("hace 5m", "hace 2h", "Ayer", "hace 3d"), usado por
 * la columna de última actividad de "Tareas Recientes".
 *
 * No es un cálculo de negocio probado por ningún AC de US-002 (Figma no
 * especifica la granularidad exacta): es una aproximación de UX razonable,
 * suficiente para transmitir recencia sin pretender exactitud al segundo.
 * Devuelve `undefined` si `fechaIso` no es parseable (defensivo, no lanza).
 */
export function formatearTiempoRelativo(
  fechaIso: string,
  ahora: Date = new Date(),
): string | undefined {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return undefined;
  }

  const diferenciaMs = Math.max(0, ahora.getTime() - fecha.getTime());
  const diferenciaMinutos = Math.floor(diferenciaMs / MS_POR_MINUTO);

  if (diferenciaMinutos < 1) {
    return "Ahora mismo";
  }
  if (diferenciaMinutos < MINUTOS_POR_HORA) {
    return `hace ${diferenciaMinutos}m`;
  }

  const diferenciaHoras = Math.floor(diferenciaMinutos / MINUTOS_POR_HORA);
  if (diferenciaHoras < HORAS_POR_DIA) {
    return `hace ${diferenciaHoras}h`;
  }

  const diferenciaDias = Math.floor(diferenciaHoras / HORAS_POR_DIA);
  if (diferenciaDias === 1) {
    return "Ayer";
  }
  return `hace ${diferenciaDias}d`;
}
