/**
 * Formatea una duración en minutos como texto legible ("1h 30m" / "45 min").
 * No lanza excepción ante valores inválidos: los normaliza a "0 min".
 */
export function formatearDuracion(minutos: number): string {
  if (
    typeof minutos !== "number" ||
    !Number.isFinite(minutos) ||
    minutos <= 0
  ) {
    return "0 min";
  }

  const minutosEnteros = Math.round(minutos);
  const horas = Math.floor(minutosEnteros / 60);
  const minutosRestantes = minutosEnteros % 60;

  if (horas === 0) {
    return `${minutosRestantes} min`;
  }
  if (minutosRestantes === 0) {
    return `${horas}h`;
  }
  return `${horas}h ${minutosRestantes}m`;
}

/**
 * Formatea una fecha ISO 8601 como fecha corta legible (es-ES). Devuelve el
 * valor original sin formatear si no es parseable (defensivo, no lanza).
 *
 * `registro.fecha` es un día calendario puro (`YYYY-MM-DD`, sin componente
 * horario). `new Date("YYYY-MM-DD")` interpreta esa forma como medianoche
 * UTC (a diferencia de una cadena con componente horario, que ECMA-262
 * interpreta en hora local): formatear ese instante con la zona horaria
 * local del entorno puede mostrar el día calendario anterior en cualquier
 * zona horaria con offset negativo respecto a UTC. Para fechas puras
 * (sin componente horario) se fija `timeZone: "UTC"` en el formateador,
 * de modo que el día mostrado siempre coincide con el día persistido,
 * cualquiera sea la zona horaria del navegador/entorno de ejecución.
 */
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return fechaIso;
  }
  const esFechaPura = /^\d{4}-\d{2}-\d{2}$/.test(fechaIso);
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    timeZone: esFechaPura ? "UTC" : undefined,
  }).format(fecha);
}
