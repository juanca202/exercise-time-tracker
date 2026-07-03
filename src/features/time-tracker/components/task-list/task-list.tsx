"use client";

import { useTimeTrackerStore } from "../../store/time-tracker-store";

export function TaskList() {
  const projects = useTimeTrackerStore((state) => state.projects);
  const tasks = useTimeTrackerStore((state) => state.tasks);
  const startTimer = useTimeTrackerStore((state) => state.startTimer);

  const taskList = Object.values(tasks);

  if (taskList.length === 0) {
    return (
      <section
        aria-label="Todas las Tareas"
        className="rounded-lg border border-outline-variant p-6"
      >
        <h2 className="text-headline-md font-semibold text-on-surface">
          Todas las Tareas
        </h2>
        <p className="mt-4 text-body-lg text-on-surface-variant">
          Aún no hay tareas.
        </p>
      </section>
    );
  }

  const tasksByProject = new Map<string, typeof taskList>();
  for (const task of taskList) {
    const existing = tasksByProject.get(task.projectId) ?? [];
    existing.push(task);
    tasksByProject.set(task.projectId, existing);
  }

  return (
    <section
      aria-label="Todas las Tareas"
      className="rounded-lg border border-outline-variant p-6"
    >
      <h2 className="text-headline-md font-semibold text-on-surface">
        Todas las Tareas
      </h2>
      <div className="mt-4 flex flex-col gap-6">
        {Array.from(tasksByProject.entries()).map(
          ([projectId, projectTasks]) => {
            const project = projects[projectId];
            return (
              <div key={projectId}>
                <p className="text-label-mono uppercase text-on-surface-variant">
                  {project?.name ?? "Proyecto"}
                </p>
                <ul className="mt-2 flex flex-col divide-y divide-outline-variant">
                  {projectTasks.map((task) => (
                    <li
                      key={task.id}
                      className="flex items-center justify-between py-3"
                    >
                      <span className="text-body-lg text-on-surface">
                        {task.name}
                      </span>
                      <button
                        type="button"
                        aria-label={`Iniciar temporizador para ${task.name}`}
                        onClick={() => startTimer(task.id)}
                        className="rounded-full border border-outline p-2"
                      >
                        ▷
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            );
          },
        )}
      </div>
    </section>
  );
}
