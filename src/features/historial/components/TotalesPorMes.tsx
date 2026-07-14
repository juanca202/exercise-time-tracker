import { formatearDuracion } from "../utils/formatearDuracion";
import { formatearMes } from "../utils/formatearMes";

/**
 * Total de tiempo acumulado por mes (AC-004, 5.4), en orden cronológico
 * ascendente por clave `"YYYY-MM"`.
 */
export function TotalesPorMes({
  totalesPorMes,
}: {
  totalesPorMes: Map<string, number>;
}) {
  const mesesOrdenados = [...totalesPorMes.entries()].sort(([mesA], [mesB]) =>
    mesA.localeCompare(mesB),
  );

  if (mesesOrdenados.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="totales-por-mes-titulo"
      className="flex flex-col gap-3"
    >
      <h2
        id="totales-por-mes-titulo"
        className="text-sm font-semibold tracking-wide text-on-surface-variant uppercase"
      >
        Total por mes
      </h2>
      <ul className="flex flex-col divide-y divide-outline-variant rounded-precision-lg border border-outline-variant bg-surface-container-lowest">
        {mesesOrdenados.map(([claveMes, totalMinutos]) => (
          <li
            key={claveMes}
            className="flex items-center justify-between gap-4 px-4 py-2.5 text-sm"
          >
            <span className="text-on-surface">{formatearMes(claveMes)}</span>
            <span className="shrink-0 font-mono text-xs font-medium text-on-surface-variant">
              {formatearDuracion(totalMinutos)}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
