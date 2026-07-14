/**
 * Valida que una Duración (en milisegundos) sea estrictamente mayor que cero (BR-04).
 *
 * Es la única función que decide si una Duración es válida, compartida entre
 * el flujo del temporizador y el de ingreso manual de tiempo.
 */
export function validarDuracion(duracionMs: number): boolean {
  return duracionMs > 0;
}
