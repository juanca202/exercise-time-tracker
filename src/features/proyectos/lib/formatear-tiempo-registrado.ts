/**
 * Formatea una duración en minutos como reloj "HH:MM" (p. ej. "42:15",
 * "08:05"), el formato del valor "Tiempo Registrado" de la tarjeta de
 * Proyecto (frame Figma "Proyectos"). A diferencia de `formatearHMS`
 * (`gestion-tareas-temporizador`), omite los segundos: el total por
 * Proyecto proviene de `calcularTotalPorProyecto` (Historial de registros)
 * ya agregado en minutos, no de un cronómetro en vivo. No lanza excepción
 * ante valores inválidos o negativos: los normaliza a "00:00".
 */
export function formatearTiempoRegistrado(minutos: number): string {
  if (typeof minutos !== "number" || !Number.isFinite(minutos) || minutos < 0) {
    return "00:00";
  }

  const minutosEnteros = Math.round(minutos);
  const horas = Math.floor(minutosEnteros / 60);
  const minutosRestantes = minutosEnteros % 60;

  return `${String(horas).padStart(2, "0")}:${String(minutosRestantes).padStart(2, "0")}`;
}
