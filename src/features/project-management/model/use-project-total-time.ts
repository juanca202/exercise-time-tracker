import { useTaskTimeTrackingStore } from "@/features/task-time-tracking";

/**
 * Calcula el Tiempo Registrado de un Proyecto (en segundos) como la suma de
 * las duraciones de los Registros de Tiempo de sus Tareas. Es un valor
 * derivado en tiempo de lectura (ver design de `project-management`): no se
 * almacena en el store de Proyectos, que permanece independiente del store
 * de Tareas/Registros de Tiempo.
 */
export function useProjectTotalTimeSeconds(projectId: string): number {
  return useTaskTimeTrackingStore((state) => {
    const taskIds = new Set(
      state.tasks
        .filter((task) => task.projectId === projectId)
        .map((task) => task.id),
    );

    return state.timeEntries
      .filter((entry) => taskIds.has(entry.taskId))
      .reduce((total, entry) => total + entry.durationSeconds, 0);
  });
}
