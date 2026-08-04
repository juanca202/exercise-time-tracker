import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TasksSummaryHeader } from "./tasks-summary-header";

describe("TasksSummaryHeader", () => {
  it("muestra el porcentaje de la meta semanal y los totales formateados", () => {
    render(
      <TasksSummaryHeader
        weeklyGoalPercentage={84}
        totalSecondsThisWeek={3600 * 32 + 60 * 45}
        totalSecondsThisMonth={3600 * 128 + 60 * 12}
      />,
    );

    expect(screen.getByText("84%")).toBeInTheDocument();
    expect(screen.getByText("32h 45m")).toBeInTheDocument();
    expect(screen.getByText("128h 12m")).toBeInTheDocument();
  });
});
