import { useTaskStore } from "@/shared/store/use-task-store";
import { useProjectStore } from "@/shared/store/use-project-store";
import type { ProjectInput } from "@/shared/store/use-project-store";

export interface DeleteProjectResult {
  deleted: boolean;
  blockedByTaskCount?: number;
}

/**
 * Lógica de negocio de Proyectos: bloquea la eliminación de un Proyecto que
 * tenga Tareas asociadas (BR-01), leyendo el store raíz de Tarea.
 */
export function useProjectActions() {
  const projects = useProjectStore((state) => state.projects);
  const createProject = useProjectStore((state) => state.createProject);
  const updateProject = useProjectStore((state) => state.updateProject);
  const deleteProjectRaw = useProjectStore((state) => state.deleteProject);
  const tasks = useTaskStore((state) => state.tasks);

  function countTasksForProject(projectId: string): number {
    return tasks.filter((task) => task.projectId === projectId).length;
  }

  function deleteProject(id: string): DeleteProjectResult {
    const blockedByTaskCount = countTasksForProject(id);
    if (blockedByTaskCount > 0) {
      return { deleted: false, blockedByTaskCount };
    }
    deleteProjectRaw(id);
    return { deleted: true };
  }

  return {
    projects,
    createProject: (input: ProjectInput) => createProject(input),
    updateProject: (id: string, input: ProjectInput) =>
      updateProject(id, input),
    deleteProject,
    countTasksForProject,
  };
}
