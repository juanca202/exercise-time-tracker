/**
 * Entidad Temporizador Activo: representa, cuando existe, el temporizador en
 * curso para una Tarea (US-002). Solo puede existir un Temporizador Activo a
 * la vez en toda la aplicación.
 */
export interface TemporizadorActivo {
  /** Identificador de la Tarea sobre la que corre este temporizador. */
  tareaId: string;
  /** Fecha y hora (ISO 8601) en que se inició el temporizador. */
  iniciadoEn: string;
}
