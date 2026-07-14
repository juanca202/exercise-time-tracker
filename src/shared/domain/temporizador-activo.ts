/**
 * Estado del único temporizador en ejecución en toda la aplicación (SRS-001
 * §2.4, restricción "Concurrencia del Temporizador": un (1) temporizador activo
 * como máximo a la vez).
 */
export interface TemporizadorActivo {
  /** Identificador de la Tarea sobre la que corre el temporizador (relación obligatoria). */
  tareaId: string;
  /** Instante en que se inició el temporizador, en formato ISO 8601. */
  horaInicio: string;
}
