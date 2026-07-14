/**
 * Unidad de trabajo específica que pertenece obligatoriamente a un único
 * Proyecto (SRS-001 §2.4, restricción "Relación Tarea-Proyecto").
 */
export interface Tarea {
  /** Identificador único de la tarea. */
  id: string;
  /** Identificador del Proyecto al que pertenece esta Tarea (relación obligatoria). */
  proyectoId: string;
  /** Nombre de la tarea (obligatorio, RF-003). */
  nombre: string;
  /** Fecha y hora de creación de la tarea, en formato ISO 8601. */
  creadoEn: string;
}
