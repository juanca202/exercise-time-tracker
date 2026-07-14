/**
 * Punto único de importación de los tipos de dominio compartidos.
 * Proyectos, Tareas e Historial de registros consumen estos tipos desde aquí
 * sin redefinirlos ni extenderlos (ver ADR-005 y el change
 * `fundamentos-infraestructura-compartida`).
 */
export type { Proyecto } from "./proyecto";
export type { Tarea } from "./tarea";
export type { RegistroDeTiempo } from "./registro-de-tiempo";
export type { TemporizadorActivo } from "./temporizador-activo";
