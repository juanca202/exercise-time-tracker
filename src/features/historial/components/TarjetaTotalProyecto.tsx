import { formatearDuracion } from "../utils/formatearDuracion";

/**
 * Stat card de un Proyecto con su total de tiempo acumulado (AC-003, 4.5).
 * Tokens de `DESIGN.md` (tema Precision Focus): superficie elevada Nivel 1,
 * radio de contenedor `lg`, tipografía `display-count`/`label-meta`.
 */
export function TarjetaTotalProyecto({
  nombre,
  totalMinutos,
}: {
  nombre: string;
  totalMinutos: number;
}) {
  return (
    <div className="flex min-w-0 flex-col gap-1 rounded-precision-lg border border-outline-variant bg-surface-container-lowest px-5 py-4 shadow-sm">
      <span className="truncate font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
        {nombre}
      </span>
      <span className="text-2xl font-bold text-on-surface">
        {formatearDuracion(totalMinutos)}
      </span>
    </div>
  );
}
