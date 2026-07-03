import { describe, expect, it } from "vitest";
import { aProject, aTask, aTimeEntry } from "../testing/object-mothers";
import {
  getEntriesForPeriod,
  getProjectTotalSeconds,
  getProjectTotalsForPeriod,
  getRecentEntries,
  getTaskTotalSeconds,
} from "./selectors";

const project1 = aProject({ id: "project-1", name: "Rediseño" });
const project2 = aProject({ id: "project-2", name: "Nexus App" });
const task1 = aTask({ id: "task-1", projectId: "project-1" });
const task2 = aTask({ id: "task-2", projectId: "project-1" });
const task3 = aTask({ id: "task-3", projectId: "project-2" });

const projects = { [project1.id]: project1, [project2.id]: project2 };
const tasks = { [task1.id]: task1, [task2.id]: task2, [task3.id]: task3 };

describe("getTaskTotalSeconds", () => {
  it("sums the durations of entries for a task", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-1",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-2",
        durationSeconds: 999,
      }),
    };

    expect(getTaskTotalSeconds(entries, "task-1")).toBe(300);
  });

  it("returns 0 for a task with no entries", () => {
    expect(getTaskTotalSeconds({}, "task-1")).toBe(0);
  });
});

describe("getProjectTotalSeconds", () => {
  it("sums the durations across all tasks of a project", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-2",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-3",
        durationSeconds: 999,
      }),
    };

    expect(getProjectTotalSeconds(entries, tasks, "project-1")).toBe(300);
    expect(getProjectTotalSeconds(entries, tasks, "project-2")).toBe(999);
  });
});

describe("getEntriesForPeriod", () => {
  it("returns only entries within the period, newest date first", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        date: "2026-10-05",
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-1",
        date: "2026-10-20",
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-1",
        date: "2026-11-01",
      }),
    };

    const result = getEntriesForPeriod(entries, { year: 2026, month: 10 });

    expect(result.map((entry) => entry.id)).toEqual(["entry-2", "entry-1"]);
  });
});

describe("getProjectTotalsForPeriod", () => {
  it("groups entry totals by project for the given period", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        taskId: "task-1",
        date: "2026-10-05",
        durationSeconds: 100,
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        taskId: "task-3",
        date: "2026-10-06",
        durationSeconds: 200,
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        taskId: "task-1",
        date: "2026-09-01",
        durationSeconds: 999,
      }),
    };

    const result = getProjectTotalsForPeriod(entries, tasks, projects, {
      year: 2026,
      month: 10,
    });

    expect(result).toEqual(
      expect.arrayContaining([
        { project: project1, totalSeconds: 100 },
        { project: project2, totalSeconds: 200 },
      ]),
    );
    expect(result).toHaveLength(2);
  });
});

describe("getRecentEntries", () => {
  it("returns the N most recently created entries, newest first", () => {
    const entries = {
      "entry-1": aTimeEntry({
        id: "entry-1",
        createdAt: "2026-07-01T10:00:00.000Z",
      }),
      "entry-2": aTimeEntry({
        id: "entry-2",
        createdAt: "2026-07-02T10:00:00.000Z",
      }),
      "entry-3": aTimeEntry({
        id: "entry-3",
        createdAt: "2026-07-03T10:00:00.000Z",
      }),
    };

    expect(getRecentEntries(entries, 2).map((entry) => entry.id)).toEqual([
      "entry-3",
      "entry-2",
    ]);
  });
});
