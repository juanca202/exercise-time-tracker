/**
 * Calcula los segundos transcurridos entre `horaInicioIso` y `ahoraMs`
 * (típicamente el valor en vivo de `useAhoraEnVivo`), para los contadores
 * HH:MM:SS que avanzan en tiempo real (Sesión Activa y la fila de "Tareas
 * Recientes" de la Tarea en curso). Nunca devuelve un valor negativo: un
 * `ahoraMs` anterior a `horaInicioIso` (reloj del sistema inconsistente) se
 * normaliza a `0` en lugar de mostrar un contador retrocediendo.
 */
export function calcularSegundosTranscurridos(
  horaInicioIso: string,
  ahoraMs: number,
): number {
  return Math.max(
    0,
    Math.floor((ahoraMs - new Date(horaInicioIso).getTime()) / 1000),
  );
}
