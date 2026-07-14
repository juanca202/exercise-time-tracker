/**
 * Tipos de dominio compartidos de Time Tracker.
 *
 * Estos tipos son consumidos de forma idéntica por todas las historias
 * funcionales (Proyectos, Tareas, Historial de registros). Ninguna feature
 * debe redefinir ni extender estos contratos: solo debe importarlos desde
 * este módulo compartido, según ADR-005.
 */

/**
 * Proyecto bajo el cual se agrupan una o más Tareas.
 */
export interface Proyecto {
  /** Identificador único del Proyecto. */
  id: string;
  /** Nombre del Proyecto (obligatorio). */
  nombre: string;
  /** Descripción opcional del Proyecto. */
  descripcion: string;
}

/**
 * Tarea asociada obligatoriamente a un Proyecto existente.
 */
export interface Tarea {
  /** Identificador único de la Tarea. */
  id: string;
  /** Identificador del Proyecto al que pertenece la Tarea (relación obligatoria). */
  proyectoId: string;
  /** Nombre de la Tarea. */
  nombre: string;
}

/**
 * Origen de un Registro de Tiempo: generado por el temporizador o ingresado manualmente.
 */
export type OrigenRegistroDeTiempo = "temporizador" | "manual";

/**
 * Registro de Tiempo asociado obligatoriamente a una Tarea existente.
 */
export interface RegistroDeTiempo {
  /** Identificador único del Registro de Tiempo. */
  id: string;
  /** Identificador de la Tarea a la que pertenece el Registro (relación obligatoria). */
  tareaId: string;
  /** Fecha/hora de referencia del Registro, en formato ISO 8601. */
  fecha: string;
  /** Duración del Registro en milisegundos. Siempre estrictamente mayor que cero. */
  duracionMs: number;
  /** Origen del Registro: temporizador o ingreso manual. */
  origen: OrigenRegistroDeTiempo;
}

/**
 * Estado del único temporizador activo en toda la aplicación.
 * `null` cuando no hay ningún temporizador en ejecución.
 */
export interface TemporizadorActivo {
  /** Identificador de la Tarea sobre la que corre el temporizador. */
  tareaId: string;
  /** Hora de inicio del temporizador, en formato ISO 8601. */
  horaInicio: string;
}
