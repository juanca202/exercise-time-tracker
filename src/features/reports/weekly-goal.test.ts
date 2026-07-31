import { describe, expect, it } from "vitest";
import {
  WEEKLY_GOAL_HOURS,
  calculateWeeklyGoalPercentage,
} from "./weekly-goal";

describe("calculateWeeklyGoalPercentage", () => {
  it("calcula el porcentaje exacto por debajo de la meta", () => {
    const totalSeconds = WEEKLY_GOAL_HOURS * 3600 * 0.5;

    expect(calculateWeeklyGoalPercentage(totalSeconds)).toBe(50);
  });

  it("capa el porcentaje en 100 cuando el total semanal supera la meta", () => {
    const totalSeconds = WEEKLY_GOAL_HOURS * 3600 * 1.25;

    expect(calculateWeeklyGoalPercentage(totalSeconds)).toBe(100);
  });

  it("devuelve 0 cuando no hay tiempo registrado", () => {
    expect(calculateWeeklyGoalPercentage(0)).toBe(0);
  });
});
