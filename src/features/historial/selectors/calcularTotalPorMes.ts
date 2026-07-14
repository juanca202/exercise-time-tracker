import type { RegistroDeTiempo } from "@/shared/domain";
import { obtenerMesCalendario } from "@/shared/date";

/**
 * Calcula el total de tiempo acumulado por mes (AC-004), agrupando por el
 * año-mes de la **Fecha** (`fecha`) de cada Registro de Tiempo -- Día único
 * en el caso manual, día calendario de la Hora de Inicio real en el caso
 * del temporizador (ver `src/shared/domain/registro-de-tiempo.ts`) -- y
 * sumando sus duraciones.
 *
 * La clave de agrupación se obtiene invocando el helper compartido
 * {@link obtenerMesCalendario} de `fundamentos-infraestructura-compartida`;
 * esta feature no reimplementa la lógica de atribución de mes.
 *
 * Por construcción, el dominio compartido ya resuelve un Registro de Tiempo
 * a un único día calendario (`fecha`, la Hora de Inicio en el caso del
 * temporizador): un Registro que cruza la medianoche de fin de mes queda
 * íntegramente contabilizado en el mes de inicio sin ningún branch especial
 * (RS-001, AC-004, TC-012).
 *
 * Registros con `fecha` no parseable se excluyen del cálculo sin generar un
 * mes espurio ni lanzar una excepción (TC-011).
 */
export function calcularTotalPorMes(
  registros: RegistroDeTiempo[],
): Map<string, number> {
  const totales = new Map<string, number>();

  for (const registro of registros) {
    if (!registro) {
      continue;
    }
    const { duracionMinutos, fecha } = registro;
    if (
      typeof duracionMinutos !== "number" ||
      !Number.isFinite(duracionMinutos) ||
      duracionMinutos <= 0
    ) {
      continue;
    }
    if (typeof fecha !== "string" || Number.isNaN(new Date(fecha).getTime())) {
      continue;
    }

    const claveMes = obtenerMesCalendario(registro);
    totales.set(claveMes, (totales.get(claveMes) ?? 0) + duracionMinutos);
  }

  return totales;
}
