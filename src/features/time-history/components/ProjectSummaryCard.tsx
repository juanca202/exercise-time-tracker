import { colorFromString } from "@/lib/colorFromString";
import { formatDuration } from "@/lib/formatDuration";

interface ProjectSummaryCardProps {
  projectName: string;
  totalMs: number;
}

/** Tarjeta de resumen por Proyecto dentro del periodo seleccionado (AC-003). */
export function ProjectSummaryCard({
  projectName,
  totalMs,
}: ProjectSummaryCardProps) {
  return (
    <div
      className="flex-1 rounded-card border border-outline-variant border-l-4 bg-surface-container-lowest p-6 shadow-sm"
      style={{ borderLeftColor: colorFromString(projectName) }}
    >
      <p className="font-mono text-xs tracking-wider text-on-surface-variant uppercase">
        {projectName}
      </p>
      <p className="mt-2 text-2xl font-semibold text-primary">
        {formatDuration(totalMs)}
      </p>
    </div>
  );
}
