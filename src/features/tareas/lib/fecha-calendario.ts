/**
 * Convierte un día calendario puro (`YYYY-MM-DD`, tal como lo persiste
 * `RegistroDeTiempo.fecha` según `@/shared/domain`) a un `Date` anclado al
 * mediodía en hora local.
 *
 * No se usa `new Date("YYYY-MM-DD")` directamente porque ese formato se
 * interpreta como medianoche UTC: en zonas horarias con offset negativo
 * (p. ej. América), el día calendario local resultante retrocedería un día,
 * lo que rompería el cálculo del rango Lunes-Viernes (BR-05).
 */
export function fechaCalendarioALocal(fechaCalendario: string): Date {
  const [anio, mes, dia] = fechaCalendario.split("-").map(Number);
  return new Date(anio, mes - 1, dia, 12, 0, 0, 0);
}

/**
 * Convierte un `Date` a su día calendario local en formato `YYYY-MM-DD`, la
 * misma forma que exige `RegistroDeTiempo.fecha` (`@/shared/domain`).
 *
 * Usa los componentes de fecha locales (`getFullYear`/`getMonth`/`getDate`)
 * en lugar de `toISOString().slice(0, 10)`, que opera en UTC y puede
 * desplazar el día calendario en zonas horarias con offset negativo respecto
 * a UTC.
 */
export function fechaLocalACalendario(fecha: Date): string {
  const anio = fecha.getFullYear();
  const mes = String(fecha.getMonth() + 1).padStart(2, "0");
  const dia = String(fecha.getDate()).padStart(2, "0");
  return `${anio}-${mes}-${dia}`;
}
