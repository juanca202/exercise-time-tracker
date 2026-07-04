import { describe, expect, it } from "vitest";
import {
  formatHoursAndMinutes,
  monthTotalSeconds,
  projectTotalSeconds,
  taskTotalSeconds,
  totalsByProject,
  totalsByTask,
} from "./totals";
import { aProject, aTask, aTimeEntry } from "../testing/object-mothers";

describe("formatHoursAndMinutes", () => {
  it("should_format_zero_seconds_as_zero_hours_and_zero_minutes", () => {
    expect(formatHoursAndMinutes(0)).toBe("0h 00m");
  });

  it("should_format_seconds_under_an_hour_as_zero_hours", () => {
    expect(formatHoursAndMinutes(30 * 60)).toBe("0h 30m");
  });

  it("should_format_seconds_over_an_hour_with_padded_minutes", () => {
    expect(formatHoursAndMinutes(13 * 3600)).toBe("13h 00m");
    expect(formatHoursAndMinutes(9 * 3600 + 30 * 60)).toBe("9h 30m");
  });

  it("should_truncate_incomplete_minutes", () => {
    expect(formatHoursAndMinutes(3661)).toBe("1h 01m");
  });
});

describe("projectTotalSeconds", () => {
  it("should_return_zero_when_project_has_no_tasks", () => {
    // Arrange
    const tasks = [aTask({ id: "t1", projectId: "other-project" })];
    const timeEntries = [aTimeEntry({ taskId: "t1", durationSeconds: 1000 })];

    // Act
    const total = projectTotalSeconds("project-1", tasks, timeEntries);

    // Assert
    expect(total).toBe(0);
  });

  it("should_return_zero_when_tasks_have_no_time_entries", () => {
    // Arrange
    const tasks = [aTask({ id: "t1", projectId: "project-1" })];

    // Act
    const total = projectTotalSeconds("project-1", tasks, []);

    // Assert
    expect(total).toBe(0);
  });

  it("should_sum_durations_across_all_tasks_of_the_project", () => {
    // Arrange
    const tasks = [
      aTask({ id: "t1", projectId: "project-1" }),
      aTask({ id: "t2", projectId: "project-1" }),
      aTask({ id: "t3", projectId: "other-project" }),
    ];
    const timeEntries = [
      aTimeEntry({ id: "e1", taskId: "t1", durationSeconds: 1000 }),
      aTimeEntry({ id: "e2", taskId: "t2", durationSeconds: 500 }),
      aTimeEntry({ id: "e3", taskId: "t3", durationSeconds: 9999 }),
    ];

    // Act
    const total = projectTotalSeconds("project-1", tasks, timeEntries);

    // Assert
    expect(total).toBe(1500);
  });
});

describe("taskTotalSeconds", () => {
  it("should_return_zero_when_the_task_has_no_time_entries", () => {
    expect(taskTotalSeconds("t1", [])).toBe(0);
  });

  it("should_sum_only_entries_of_the_given_task", () => {
    const timeEntries = [
      aTimeEntry({ id: "e1", taskId: "t1", durationSeconds: 100 }),
      aTimeEntry({ id: "e2", taskId: "t1", durationSeconds: 50 }),
      aTimeEntry({ id: "e3", taskId: "t2", durationSeconds: 999 }),
    ];
    expect(taskTotalSeconds("t1", timeEntries)).toBe(150);
  });
});

describe("monthTotalSeconds", () => {
  it("should_sum_only_entries_within_the_given_month", () => {
    const timeEntries = [
      aTimeEntry({ id: "e1", date: "2026-03-01", durationSeconds: 100 }),
      aTimeEntry({ id: "e2", date: "2026-03-15", durationSeconds: 200 }),
      aTimeEntry({ id: "e3", date: "2026-04-01", durationSeconds: 999 }),
    ];
    expect(monthTotalSeconds(timeEntries, 2026, 3)).toBe(300);
  });

  it("should_return_zero_when_no_entries_fall_in_the_month", () => {
    expect(monthTotalSeconds([], 2026, 3)).toBe(0);
  });
});

describe("totalsByTask", () => {
  it("should_return_totals_sorted_from_highest_to_lowest", () => {
    // Arrange
    const tasks = [
      aTask({ id: "t1", name: "Tarea A" }),
      aTask({ id: "t2", name: "Tarea B" }),
    ];
    const timeEntries = [
      aTimeEntry({ id: "e1", taskId: "t1", durationSeconds: 100 }),
      aTimeEntry({ id: "e2", taskId: "t2", durationSeconds: 500 }),
    ];

    // Act
    const totals = totalsByTask(tasks, timeEntries);

    // Assert
    expect(totals).toEqual([
      { id: "t2", name: "Tarea B", totalSeconds: 500 },
      { id: "t1", name: "Tarea A", totalSeconds: 100 },
    ]);
  });
});

describe("totalsByProject", () => {
  it("should_return_totals_sorted_from_highest_to_lowest", () => {
    // Arrange
    const projects = [
      aProject({ id: "p1", name: "Proyecto A" }),
      aProject({ id: "p2", name: "Proyecto B" }),
    ];
    const tasks = [
      aTask({ id: "t1", projectId: "p1" }),
      aTask({ id: "t2", projectId: "p2" }),
    ];
    const timeEntries = [
      aTimeEntry({ id: "e1", taskId: "t1", durationSeconds: 100 }),
      aTimeEntry({ id: "e2", taskId: "t2", durationSeconds: 500 }),
    ];

    // Act
    const totals = totalsByProject(projects, tasks, timeEntries);

    // Assert
    expect(totals).toEqual([
      { id: "p2", name: "Proyecto B", totalSeconds: 500 },
      { id: "p1", name: "Proyecto A", totalSeconds: 100 },
    ]);
  });
});
