import type { RegistroDeTiempo } from "@/shared/domain";
import { fechaCalendarioALocal } from "./fecha-calendario";
import { rangoSemanaLaboralActual } from "./rango-semana-laboral";

/** Cantidad de minutos en una hora, usada para convertir el Total Semanal. */
const MINUTOS_POR_HORA = 60;

/**
 * Calcula el Total Semanal (en horas) sumando las Duraciones de los Registros
 * de Tiempo (por temporizador y manuales) cuyo día calendario (`fecha`,
 * `YYYY-MM-DD`) cae dentro de la semana laboral actual (Lunes a Viernes, hora
 * local) que contiene `fecha`.
 *
 * Excluye explícitamente los Registros de Sábado/Domingo y los de semanas
 * calendario anteriores, aunque estén dentro del mismo mes.
 */
export function calcularTotalSemanal(
  registros: RegistroDeTiempo[],
  fecha: Date,
): number {
  const { inicio, fin } = rangoSemanaLaboralActual(fecha);
  const inicioMs = inicio.getTime();
  const finMs = fin.getTime();

  const totalMinutos = registros.reduce((acumulado, registro) => {
    const fechaRegistroMs = fechaCalendarioALocal(registro.fecha).getTime();
    const estaDentroDelRango =
      fechaRegistroMs >= inicioMs && fechaRegistroMs <= finMs;
    return estaDentroDelRango
      ? acumulado + registro.duracionMinutos
      : acumulado;
  }, 0);

  return totalMinutos / MINUTOS_POR_HORA;
}
