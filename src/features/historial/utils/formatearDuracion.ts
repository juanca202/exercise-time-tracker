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
 */
export function formatearFecha(fechaIso: string): string {
  const fecha = new Date(fechaIso);
  if (Number.isNaN(fecha.getTime())) {
    return fechaIso;
  }
  return new Intl.DateTimeFormat("es-ES", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(fecha);
}
