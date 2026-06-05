"use client";

import { formatDurationHms } from "../lib/duration";
import { getProjectColorFromName } from "../lib/task-color";
import type { Project } from "../lib/types";
import { FolderIcon, iconClassName } from "./icons";

interface ProjectCardProps {
  project: Project;
  totalMs?: number;
  progressPercent?: number;
}

export function ProjectCard({
  project,
  totalMs = 0,
  progressPercent = 0,
}: ProjectCardProps) {
  const { accent } = getProjectColorFromName(project.name);

  return (
    <article
      className="flex flex-col rounded-lg border border-card-border border-l-4 bg-surface-container-lowest p-5 shadow-elevation-1"
      style={{ borderLeftColor: accent }}
    >
      <FolderIcon
        className={iconClassName("lg", "mb-3 text-on-surface-variant")}
        aria-hidden="true"
      />
      <h3 className="text-body-lg font-semibold text-on-surface">
        {project.name}
      </h3>
      {project.description ? (
        <p className="mt-2 line-clamp-3 text-body-md text-on-surface-variant">
          {project.description}
        </p>
      ) : null}
      <div className="mt-6">
        <p className="text-label-mono uppercase text-on-surface-variant">
          Tiempo registrado
        </p>
        <p className="mt-1 font-mono text-2xl font-semibold text-on-surface">
          {formatDurationHms(totalMs)}
        </p>
      </div>
      <div
        className="mt-4 h-1 overflow-hidden rounded-full bg-surface-container"
        role="progressbar"
        aria-valuenow={Math.round(progressPercent)}
        aria-valuemin={0}
        aria-valuemax={100}
        aria-label={`Progreso de ${project.name}`}
      >
        <div
          className="h-full rounded-full bg-accent transition-all"
          style={{ width: `${Math.min(100, progressPercent)}%` }}
        />
      </div>
    </article>
  );
}
