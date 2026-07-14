import { META_SEMANAL_HORAS } from "./constantes";

/**
 * Calcula el porcentaje alcanzado de la Meta Semanal como
 * (Total Semanal ÷ Meta Semanal) × 100. No aplica ningún techo visual en
 * 100%: un Total Semanal superior a la Meta Semanal produce un porcentaje
 * mayor a 100 sin truncarse (AC-019).
 */
export function calcularPorcentajeMeta(totalSemanalHoras: number): number {
  const porcentaje = (totalSemanalHoras / META_SEMANAL_HORAS) * 100;
  // Redondea a 2 decimales únicamente para evitar ruido de punto flotante
  // (p. ej. 110.00000000000001); no aplica ningún techo en 100% (AC-019).
  return Math.round(porcentaje * 100) / 100;
}
