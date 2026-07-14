import type { RegistroDeTiempo } from "@/shared/domain/types";
import { obtenerClaveMes } from "@/shared/date/obtenerClaveMes";

/**
 * Calcula el total de tiempo acumulado por mes (AC-004), agrupando por el
 * año-mes de la **Hora de Inicio** (`horaInicio`) de cada Registro de
 * Tiempo -- Fecha única en el caso manual, Hora de Inicio real en el caso
 * del temporizador -- y sumando sus duraciones.
 *
 * La clave de agrupación se obtiene invocando el helper compartido
 * {@link obtenerClaveMes} de `fundamentos-infraestructura-compartida`; esta
 * feature no reimplementa la lógica de atribución de mes.
 *
 * Por construcción, al agrupar siempre por `horaInicio` (nunca por
 * `horaFin` ni por un cálculo prorrateado), un Registro que cruza la
 * medianoche de fin de mes queda íntegramente contabilizado en el mes de
 * inicio sin ningún branch especial (RS-001, AC-004, TC-012): la regla se
 * cumple como consecuencia directa de "agrupar por fecha de inicio".
 *
 * Registros con `horaInicio` no parseable se excluyen del cálculo sin
 * generar un mes espurio ni lanzar una excepción (TC-011).
 */
export function calcularTotalPorMes(
  registros: RegistroDeTiempo[],
): Map<string, number> {
  const totales = new Map<string, number>();

  for (const registro of registros) {
    if (!registro) {
      continue;
    }
    const { duracion, horaInicio } = registro;
    if (
      typeof duracion !== "number" ||
      !Number.isFinite(duracion) ||
      duracion <= 0
    ) {
      continue;
    }
    if (typeof horaInicio !== "string") {
      continue;
    }

    const fechaInicio = new Date(horaInicio);
    if (Number.isNaN(fechaInicio.getTime())) {
      continue;
    }

    const claveMes = obtenerClaveMes(fechaInicio);
    totales.set(claveMes, (totales.get(claveMes) ?? 0) + duracion);
  }

  return totales;
}
