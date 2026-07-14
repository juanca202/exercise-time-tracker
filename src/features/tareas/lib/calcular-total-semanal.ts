import type { RegistroDeTiempo } from "@/shared/domain";
import { rangoSemanaLaboralActual } from "./rango-semana-laboral";
import { MS_POR_HORA } from "./constantes";

/**
 * Calcula el Total Semanal (en horas) sumando las Duraciones de los Registros
 * de Tiempo (por temporizador y manuales) cuya `fecha` cae dentro de la
 * semana laboral actual (Lunes a Viernes, hora local) que contiene `fecha`.
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

  const totalMs = registros.reduce((acumulado, registro) => {
    const fechaRegistroMs = new Date(registro.fecha).getTime();
    const estaDentroDelRango =
      fechaRegistroMs >= inicioMs && fechaRegistroMs <= finMs;
    return estaDentroDelRango ? acumulado + registro.duracionMs : acumulado;
  }, 0);

  return totalMs / MS_POR_HORA;
}
