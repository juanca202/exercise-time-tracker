/**
 * Punto único de importación de los tipos de dominio compartidos. Proyectos,
 * Tareas e Historial de registros DEBEN importar estos tipos desde aquí en
 * lugar de redefinirlos o extenderlos (AC-001).
 */
export type { Proyecto } from "./proyecto";
export type { Tarea } from "./tarea";
export type {
  OrigenRegistroDeTiempo,
  RegistroDeTiempo,
} from "./registro-de-tiempo";
export type { TemporizadorActivo } from "./temporizador-activo";
