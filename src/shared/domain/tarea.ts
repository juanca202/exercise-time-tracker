/**
 * Entidad Tarea: unidad de trabajo organizada dentro de un Proyecto (US-002).
 * Toda Tarea pertenece obligatoriamente a un Proyecto existente.
 */
export interface Tarea {
  /** Identificador único y estable de la Tarea. */
  id: string;
  /** Identificador del Proyecto al que pertenece esta Tarea (relación obligatoria Tarea→Proyecto). */
  proyectoId: string;
  /** Título de la Tarea. */
  titulo: string;
  /** Descripción opcional de la Tarea. Cadena vacía cuando no se provee. */
  descripcion: string;
  /** Indica si la Tarea fue marcada como completada. */
  completada: boolean;
  /** Fecha y hora (ISO 8601) de creación de la Tarea. */
  creadoEn: string;
  /** Fecha y hora (ISO 8601) de la última actualización de la Tarea. */
  actualizadoEn: string;
}
