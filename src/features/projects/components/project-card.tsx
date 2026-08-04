import { colorFromString } from "@/shared/color-from-string";
import { formatHoursMinutesColon } from "@/shared/format-duration";
import type { Project } from "@/shared/store/entities";

interface ProjectCardProps {
  project: Project;
  totalSeconds: number;
  onEdit: () => void;
  onDelete: () => void;
}

/** Tarjeta de Proyecto (fiel al diseño de Figma, nodo 1:1581). */
export function ProjectCard({
  project,
  totalSeconds,
  onEdit,
  onDelete,
}: ProjectCardProps) {
  return (
    <div className="relative w-[290px] border border-outline-variant bg-white px-6 py-6 pb-[61px]">
      <div
        className="absolute inset-y-0 left-0 w-1.5"
        style={{ backgroundColor: colorFromString(project.name) }}
        data-testid="project-accent-bar"
      />
      <div className="flex flex-col gap-1">
        <h3 className="text-base font-bold text-primary">{project.name}</h3>
        {project.description && (
          <p className="line-clamp-3 text-sm text-on-surface-variant">
            {project.description}
          </p>
        )}
      </div>
      <div className="mt-4">
        <p className="text-xs tracking-wider text-on-surface/50 uppercase">
          Tiempo registrado
        </p>
        <p className="font-mono text-xl text-primary">
          {formatHoursMinutesColon(totalSeconds)}
        </p>
      </div>
      <div className="mt-4 flex gap-4">
        <button
          type="button"
          onClick={onEdit}
          className="text-sm font-medium text-on-surface-variant underline"
        >
          Editar
        </button>
        <button
          type="button"
          onClick={onDelete}
          className="text-sm font-medium text-error underline"
        >
          Eliminar
        </button>
      </div>
    </div>
  );
}
