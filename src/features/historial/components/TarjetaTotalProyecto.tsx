import { formatearDuracion } from "../utils/formatearDuracion";

/**
 * Glifo decorativo genérico de "insight" (barras ascendentes) para el badge
 * de las tarjetas de total por Proyecto: no representa ningún dato del
 * dominio (a diferencia del acento por color de las tarjetas de Proyecto,
 * ver `obtenerColorAcentoProyecto`), es puramente el patrón visual
 * ícono+label+valor del frame Figma "Historial de registros". Se define
 * local a este componente (sin extraerlo a `shared/ui`) porque ningún otro
 * lugar de la app lo necesita todavía (ADR-005).
 */
function IconoInsight() {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className="size-4"
    >
      <path
        d="M2 14V9M8 14V2M14 14V6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

/**
 * Stat card de un Proyecto con su total de tiempo acumulado (AC-003, 4.5),
 * en el lenguaje visual "ícono + label + valor" del frame Figma "Historial
 * de registros": badge decorativo, nombre del Proyecto en mayúsculas
 * monoespaciadas y el total en tipografía grande. Tokens de `DESIGN.md`
 * (tema Precision Focus): superficie elevada Nivel 1, radio de contenedor
 * `lg`.
 *
 * `destacado` resalta con un borde izquierdo grueso en `secondary` (mismo
 * patrón que la tarjeta acentuada del mock de Figma), reservado por
 * `TotalesPorProyecto` para el Proyecto con más tiempo acumulado.
 */
export function TarjetaTotalProyecto({
  nombre,
  totalMinutos,
  destacado = false,
}: {
  nombre: string;
  totalMinutos: number;
  destacado?: boolean;
}) {
  return (
    <div
      className={`flex min-w-0 flex-col gap-4 rounded-precision-lg border bg-surface-container-lowest px-5 py-4 shadow-sm ${
        destacado
          ? "border-outline-variant border-l-4 border-l-secondary"
          : "border-outline-variant"
      }`}
    >
      <div className="flex items-center gap-3">
        <span
          aria-hidden="true"
          className="flex size-8 shrink-0 items-center justify-center rounded-precision-sm bg-secondary/10 text-secondary"
        >
          <IconoInsight />
        </span>
        <span className="truncate font-mono text-xs font-medium tracking-wide text-on-surface-variant uppercase">
          {nombre}
        </span>
      </div>
      <span className="text-2xl font-bold text-primary">
        {formatearDuracion(totalMinutos)}
      </span>
    </div>
  );
}
