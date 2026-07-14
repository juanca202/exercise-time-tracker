/**
 * Entidad Registro de Tiempo: intervalo de tiempo dedicado a una Tarea
 * (US-002/US-003). Todo Registro de Tiempo pertenece obligatoriamente a una
 * Tarea existente.
 */
export interface RegistroDeTiempo {
  /** Identificador único y estable del Registro de Tiempo. */
  id: string;
  /** Identificador de la Tarea a la que pertenece este Registro (relación obligatoria RegistroDeTiempo→Tarea). */
  tareaId: string;
  /** Fecha y hora (ISO 8601) de inicio del intervalo registrado. */
  inicio: string;
  /** Fecha y hora (ISO 8601) de fin del intervalo registrado. */
  fin: string;
  /** Duración del intervalo en segundos, ya calculada a partir de `inicio`/`fin`. */
  duracionSegundos: number;
  /** Fecha y hora (ISO 8601) de creación del Registro de Tiempo. */
  creadoEn: string;
}
