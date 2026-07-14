import type { RegistroDeTiempo } from "@/shared/domain";
import { obtenerMesCalendario } from "@/shared/date";
import { fechaLocalACalendario } from "./fecha-calendario";

/** Cantidad de minutos en una hora, usada para convertir el Total Mensual. */
const MINUTOS_POR_HORA = 60;

/**
 * Calcula el Total Mensual (en horas) sumando las Duraciones de los
 * Registros de Tiempo (por temporizador y manuales) cuyo mes calendario
 * coincide con el de `fecha`, para la tarjeta de stat "Total Mensual" del
 * frame Figma "Tareas".
 *
 * Reutiliza `obtenerMesCalendario` (`@/shared/date`), el mismo cálculo de
 * mes calendario que ya usa Historial de registros, para que ambas features
 * obtengan siempre el mismo resultado sobre el mismo Registro (mismo
 * contrato que `calcular-total-semanal.ts` respecto a la semana laboral).
 */
export function calcularTotalMensual(
  registros: RegistroDeTiempo[],
  fecha: Date,
): number {
  const mesActual = fechaLocalACalendario(fecha).slice(0, 7);

  const totalMinutos = registros.reduce((acumulado, registro) => {
    const esDelMesActual = obtenerMesCalendario(registro) === mesActual;
    return esDelMesActual ? acumulado + registro.duracionMinutos : acumulado;
  }, 0);

  return totalMinutos / MINUTOS_POR_HORA;
}
