import { useTasksStore } from "@/features/tasks";
import { colorFromString } from "@/lib/colorFromString";
import { formatDuration } from "@/lib/formatDuration";
import type { Project } from "../types";
import { selectProjectTotalTime } from "../store/projectsStore";

/** Tarjeta de Proyecto: Nombre, Descripción y Tiempo Registrado (AC-003 de US-30273). */
export function ProjectCard({ project }: { project: Project }) {
  // Se suscribe a tasksStore únicamente para re-renderizar cuando cambian sus Registros de
  // Tiempo; el cálculo en sí lo hace selectProjectTotalTime leyendo el store directamente.
  useTasksStore((state) => state.timeEntries);
  const totalMs = selectProjectTotalTime(project.id);

  return (
    <li className="relative overflow-hidden border border-outline-variant bg-surface-container-lowest px-6 py-6">
      <span
        className="absolute top-0 bottom-0 left-0 w-1.5"
        style={{ backgroundColor: colorFromString(project.name) }}
        aria-hidden="true"
      />
      <h3 className="font-bold text-primary">{project.name}</h3>
      {project.description && (
        <p className="mt-1 text-sm text-on-surface-variant">
          {project.description}
        </p>
      )}
      <div className="mt-4">
        <p className="font-mono text-xs tracking-wider text-on-surface/50 uppercase">
          Tiempo Registrado
        </p>
        <p className="font-mono text-xl text-primary">
          {formatDuration(totalMs)}
        </p>
      </div>
    </li>
  );
}
