/**
 * Barrel del módulo de dominio compartido. Único punto de importación de los
 * tipos de dominio para Proyectos, Tareas e Historial de registros.
 */
export type {
  Proyecto,
  Tarea,
  RegistroDeTiempo,
  OrigenRegistroDeTiempo,
  TemporizadorActivo,
} from "./types";
