/** Origen de un Registro de Tiempo: generado por el temporizador o ingresado manualmente. */
export type OrigenRegistroDeTiempo = "temporizador" | "manual";

/**
 * Entrada que documenta el tiempo dedicado a una Tarea, generada al detener el
 * temporizador (RF-009) o ingresada manualmente (RF-011). Pertenece
 * obligatoriamente a una única Tarea (SRS-001 §2.4, restricción "Relación
 * Registro-Tarea").
 */
export interface RegistroDeTiempo {
  /** Identificador único del registro de tiempo. */
  id: string;
  /** Identificador de la Tarea a la que pertenece este registro (relación obligatoria). */
  tareaId: string;
  /** Día calendario en que se registró el tiempo, en formato ISO 8601 (`YYYY-MM-DD`). */
  fecha: string;
  /**
   * Duración del registro, en minutos. La regla "mayor que cero" (RF-010, RF-013)
   * es responsabilidad de la historia funcional que crea el registro, no de este tipo.
   */
  duracionMinutos: number;
  /** Origen del registro: generado por el temporizador o ingresado manualmente. */
  origen: OrigenRegistroDeTiempo;
  /** Fecha y hora de creación del registro, en formato ISO 8601. */
  creadoEn: string;
}
