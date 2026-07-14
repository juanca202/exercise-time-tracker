import type { RegistroDeTiempo } from "@/shared/domain";

/**
 * Suma, en minutos, las Duraciones de todos los Registros de Tiempo (por
 * temporizador y manuales) asociados a `tareaId`, para la columna de
 * Duración acumulada de la fila de "Tareas Recientes" (frame Figma
 * "Tareas"). No incluye el tiempo de una sesión de temporizador en curso:
 * el llamador que sí necesite ese tiempo en vivo debe sumarlo aparte.
 */
export function calcularDuracionAcumuladaMinutos(
  registros: RegistroDeTiempo[],
  tareaId: string,
): number {
  return registros.reduce((acumulado, registro) => {
    return registro.tareaId === tareaId
      ? acumulado + registro.duracionMinutos
      : acumulado;
  }, 0);
}

/**
 * Devuelve el `creadoEn` (ISO 8601) más reciente entre los Registros de
 * Tiempo de `tareaId`, usado para el texto de recencia ("hace Xh"/"Ayer")
 * de "Tareas Recientes". Devuelve `undefined` si la Tarea no tiene ningún
 * Registro todavía.
 */
export function obtenerUltimaActividad(
  registros: RegistroDeTiempo[],
  tareaId: string,
): string | undefined {
  const registrosDeLaTarea = registros.filter(
    (registro) => registro.tareaId === tareaId,
  );
  if (registrosDeLaTarea.length === 0) {
    return undefined;
  }

  return registrosDeLaTarea.reduce(
    (masReciente, registro) =>
      registro.creadoEn > masReciente ? registro.creadoEn : masReciente,
    registrosDeLaTarea[0].creadoEn,
  );
}
