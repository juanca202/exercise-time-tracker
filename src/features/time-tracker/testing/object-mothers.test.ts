import { describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "./object-mothers";

describe("aProject", () => {
  it("returns a valid project with defaults", () => {
    expect(aProject()).toMatchObject({
      id: "project-1",
      name: "Proyecto de Prueba",
    });
  });

  it("applies overrides", () => {
    expect(aProject({ id: "project-2", name: "Otro" })).toMatchObject({
      id: "project-2",
      name: "Otro",
    });
  });
});

describe("aTask", () => {
  it("returns a valid task with defaults", () => {
    expect(aTask()).toMatchObject({
      id: "task-1",
      projectId: "project-1",
      name: "Tarea de Prueba",
    });
  });

  it("applies overrides", () => {
    expect(aTask({ projectId: "project-2" })).toMatchObject({
      projectId: "project-2",
    });
  });
});

describe("aTimeEntry", () => {
  it("returns a valid time entry with defaults", () => {
    expect(aTimeEntry()).toMatchObject({
      id: "entry-1",
      taskId: "task-1",
      durationSeconds: 3600,
      source: "manual",
    });
  });

  it("applies overrides", () => {
    expect(aTimeEntry({ source: "timer", durationSeconds: 60 })).toMatchObject({
      source: "timer",
      durationSeconds: 60,
    });
  });
});
