import { describe, expect, it } from "vitest";
import { aggregateTimeHistory } from "./aggregate-time-history";

const websiteProject = { id: "project-website", name: "Website" };
const appMovilProject = { id: "project-app-movil", name: "App Móvil" };

const disenoTask = {
  id: "task-diseno",
  name: "Diseño",
  projectId: websiteProject.id,
};
const backendTask = {
  id: "task-backend",
  name: "Backend",
  projectId: websiteProject.id,
};
const investigacionTask = {
  id: "task-investigacion",
  name: "Investigación",
  projectId: websiteProject.id,
};
const qaTask = { id: "task-qa", name: "QA", projectId: appMovilProject.id };

function anEntry(
  overrides: Partial<{
    id: string;
    taskId: string;
    startedAt: number;
    durationSeconds: number;
  }> = {},
) {
  return {
    id: "entry-1",
    taskId: disenoTask.id,
    startedAt: new Date(2026, 6, 8).getTime(),
    endedAt: new Date(2026, 6, 8).getTime() + 60_000,
    durationSeconds: 60,
    source: "manual" as const,
    ...overrides,
  };
}

describe("aggregateTimeHistory", () => {
  it("suma las duraciones de una Tarea con 2 Registros: 1h 30m + 45m = 2h 15m (TC-003)", () => {
    // Arrange
    const entries = [
      anEntry({ id: "e1", taskId: disenoTask.id, durationSeconds: 90 * 60 }),
      anEntry({ id: "e2", taskId: disenoTask.id, durationSeconds: 45 * 60 }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask],
      projects: [websiteProject],
    });

    // Assert
    expect(result.totalsByTask).toEqual([
      {
        taskId: disenoTask.id,
        taskName: "Diseño",
        totalSeconds: (90 + 45) * 60,
      },
    ]);
  });

  it("muestra 0h para una Tarea sin Registros de Tiempo (TC-004)", () => {
    // Arrange
    const entries = [
      anEntry({ taskId: disenoTask.id, durationSeconds: 60 * 60 }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask, investigacionTask],
      projects: [websiteProject],
    });

    // Assert
    const investigacionTotal = result.totalsByTask.find(
      (total) => total.taskId === investigacionTask.id,
    );
    expect(investigacionTotal?.totalSeconds).toBe(0);
  });

  it("suma las Tareas de un Proyecto dentro del periodo: 1h 30m + 45m = 2h 15m (TC-005)", () => {
    // Arrange
    const entries = [
      anEntry({ id: "e1", taskId: disenoTask.id, durationSeconds: 90 * 60 }),
      anEntry({ id: "e2", taskId: backendTask.id, durationSeconds: 45 * 60 }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask, backendTask],
      projects: [websiteProject],
    });

    // Assert
    expect(result.totalsByProject).toEqual([
      {
        projectId: websiteProject.id,
        projectName: "Website",
        totalSeconds: (90 + 45) * 60,
      },
    ]);
  });

  it("muestra 0h para un Proyecto sin Registros en el periodo (TC-006)", () => {
    // Arrange
    const entries = [
      anEntry({ taskId: disenoTask.id, durationSeconds: 60 * 60 }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask],
      projects: [websiteProject, appMovilProject],
    });

    // Assert
    const appMovilTotal = result.totalsByProject.find(
      (total) => total.projectId === appMovilProject.id,
    );
    expect(appMovilTotal?.totalSeconds).toBe(0);
  });

  it("calcula el resumen del periodo: 3 registros, 2 proyectos, 4h 15m (TC-012)", () => {
    // Arrange
    const entries = [
      anEntry({ id: "e1", taskId: disenoTask.id, durationSeconds: 90 * 60 }),
      anEntry({ id: "e2", taskId: backendTask.id, durationSeconds: 45 * 60 }),
      anEntry({ id: "e3", taskId: qaTask.id, durationSeconds: 120 * 60 }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask, backendTask, qaTask],
      projects: [websiteProject, appMovilProject],
    });

    // Assert
    expect(result.summary).toEqual({
      recordCount: 3,
      projectCount: 2,
      totalSeconds: (90 + 45 + 120) * 60,
    });
  });

  it("muestra el resumen en cero cuando el periodo no tiene Registros (TC-013)", () => {
    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: [],
      tasks: [disenoTask],
      projects: [websiteProject],
    });

    // Assert
    expect(result.summary).toEqual({
      recordCount: 0,
      projectCount: 0,
      totalSeconds: 0,
    });
    expect(result.entries).toEqual([]);
  });

  it("incluye Fecha, Proyecto, Tarea y Duración en cada entrada del listado (TC-010)", () => {
    // Arrange
    const entries = [
      anEntry({
        id: "e1",
        taskId: disenoTask.id,
        startedAt: new Date(2026, 6, 8).getTime(),
        durationSeconds: 90 * 60,
      }),
    ];

    // Act
    const result = aggregateTimeHistory({
      entriesInPeriod: entries,
      tasks: [disenoTask],
      projects: [websiteProject],
    });

    // Assert
    expect(result.entries).toEqual([
      {
        id: "e1",
        date: "8 jul. 2026",
        projectName: "Website",
        taskName: "Diseño",
        durationSeconds: 90 * 60,
      },
    ]);
  });
});
