"use client";

import { formatDurationShort } from "../../lib/duration";
import { getProjectTotalSeconds } from "../../lib/selectors";
import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function ProjectList() {
  const projects = useTimeTrackerStore((state) => state.projects);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const timeEntries = useTimeTrackerStore((state) => state.timeEntries);

  return (
    <>
      {Object.values(projects).map((project) => (
        <article
          key={project.id}
          className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6"
        >
          <h3 className="text-body-lg font-semibold text-on-surface">
            {project.name}
          </h3>
          {project.description ? (
            <p className="mt-2 text-body-md text-on-surface-variant">
              {project.description}
            </p>
          ) : null}
          <p className="mt-4 text-label-mono uppercase text-on-surface-variant">
            Tiempo Registrado
          </p>
          <p className="font-mono text-headline-md text-on-surface">
            {formatDurationShort(
              getProjectTotalSeconds(timeEntries, tasks, project.id),
            )}
          </p>
        </article>
      ))}
    </>
  );
}
