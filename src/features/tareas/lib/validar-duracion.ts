/**
 * Valida que una Duración sea estrictamente mayor que cero (BR-04),
 * independientemente de la unidad en la que se exprese.
 *
 * Es la única función que decide si una Duración es válida, compartida entre
 * el flujo del temporizador (minutos calculados a partir de la Hora Inicio y
 * la Hora Fin) y el de ingreso manual de tiempo (minutos ingresados por el
 * usuario).
 */
export function validarDuracion(duracion: number): boolean {
  return duracion > 0;
}
