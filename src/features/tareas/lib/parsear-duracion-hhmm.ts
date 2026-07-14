/** Cantidad de minutos en una hora, usada para convertir horas+minutos a minutos totales. */
const MINUTOS_POR_HORA = 60;

/**
 * Parsea una Duración ingresada en formato `HH:MM` (p. ej. "02:30"), el
 * formato del campo "Duración" de Entrada Manual en el frame Figma
 * "Tareas", a minutos totales.
 *
 * Devuelve `null` si `valor` no matchea el formato esperado (HH de 1 a 3
 * dígitos, MM de 00 a 59), en lugar de lanzar: el llamador decide cómo
 * comunicar el error de formato en la UI. No valida que el resultado sea
 * mayor que cero: esa regla de negocio (BR-04) sigue viviendo
 * exclusivamente en `validar-duracion.ts`.
 */
export function parsearDuracionHHMM(valor: string): number | null {
  const coincidencia = /^(\d{1,3}):([0-5]\d)$/.exec(valor.trim());
  if (!coincidencia) {
    return null;
  }

  const horas = Number(coincidencia[1]);
  const minutos = Number(coincidencia[2]);
  return horas * MINUTOS_POR_HORA + minutos;
}
