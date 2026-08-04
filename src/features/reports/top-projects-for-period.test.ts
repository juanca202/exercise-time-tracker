import { describe, expect, it } from "vitest";
import { topProjectsForPeriod } from "./top-projects-for-period";

const projects = [
  { id: "p1", name: "Quantum Redesign", description: "" },
  { id: "p2", name: "Nexus App", description: "" },
  { id: "p3", name: "Stellar Landing", description: "" },
  { id: "p4", name: "Internal Admin", description: "" },
];

const tasks = [
  { id: "t1", projectId: "p1", name: "Wireframing" },
  { id: "t2", projectId: "p2", name: "Auth" },
  { id: "t3", projectId: "p3", name: "Hero" },
  { id: "t4", projectId: "p4", name: "CRUD" },
];

describe("topProjectsForPeriod", () => {
  it("devuelve los proyectos con más tiempo, ordenados de mayor a menor", () => {
    const entries = [
      {
        id: "e1",
        taskId: "t1",
        source: "manual" as const,
        date: "2026-07-10",
        durationSeconds: 3600 * 13,
      },
      {
        id: "e2",
        taskId: "t2",
        source: "manual" as const,
        date: "2026-07-11",
        durationSeconds: 3600 * 9 + 60 * 30,
      },
      {
        id: "e3",
        taskId: "t3",
        source: "manual" as const,
        date: "2026-07-12",
        durationSeconds: 3600 * 5,
      },
      {
        id: "e4",
        taskId: "t4",
        source: "manual" as const,
        date: "2026-07-13",
        durationSeconds: 3600,
      },
    ];

    const result = topProjectsForPeriod(entries, tasks, projects, 3);

    expect(result.map((item) => item.project.id)).toEqual(["p1", "p2", "p3"]);
    expect(result[0]?.totalSeconds).toBe(3600 * 13);
  });

  it("omite proyectos sin Registros de Tiempo y respeta el límite", () => {
    const entries = [
      {
        id: "e1",
        taskId: "t2",
        source: "timer" as const,
        date: "2026-07-10",
        durationSeconds: 1800,
      },
    ];

    const result = topProjectsForPeriod(entries, tasks, projects, 3);

    expect(result).toHaveLength(1);
    expect(result[0]?.project.id).toBe("p2");
  });

  it("devuelve lista vacía cuando no hay Registros de Tiempo", () => {
    expect(topProjectsForPeriod([], tasks, projects)).toEqual([]);
  });
});
