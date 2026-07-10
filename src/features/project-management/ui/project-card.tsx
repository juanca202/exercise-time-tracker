import { formatDuration } from "@/shared/lib/format-duration";
import type { Project } from "../model/project";
import { useProjectTotalTimeSeconds } from "../model/use-project-total-time";

/** Alterna el acento de color de la tarjeta, fiel al patrón del prototipo de Figma. */
const ACCENT_COLORS = ["#006c4b", "rgba(24,36,66,0.2)"];

export function ProjectCard({
  project,
  index,
}: {
  project: Project;
  index: number;
}) {
  const totalTimeSeconds = useProjectTotalTimeSeconds(project.id);

  return (
    <article className="relative flex w-full flex-col gap-4 overflow-hidden border border-border bg-surface px-6 py-6 sm:w-[280px]">
      <span
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: ACCENT_COLORS[index % ACCENT_COLORS.length] }}
        aria-hidden="true"
      />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-ink">{project.name}</h3>
        {project.description ? (
          <p className="text-sm text-ink-muted">{project.description}</p>
        ) : null}
      </div>
      <div className="flex flex-col pt-2">
        <span className="text-xs font-medium tracking-[0.12em] text-ink/50 uppercase">
          Tiempo Registrado
        </span>
        <span className="font-mono text-xl font-medium text-ink">
          {formatDuration(totalTimeSeconds)}
        </span>
      </div>
    </article>
  );
}
