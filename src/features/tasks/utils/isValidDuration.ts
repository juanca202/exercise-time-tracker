/** Valida la regla BR-03: ninguna Duración de Registro de Tiempo puede ser menor o igual a cero. */
export function isValidDuration(durationMs: number): boolean {
  return durationMs > 0;
}
