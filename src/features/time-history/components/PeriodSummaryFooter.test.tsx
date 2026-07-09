import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PeriodSummaryFooter } from "./PeriodSummaryFooter";

describe("PeriodSummaryFooter", () => {
  it("muestra los registros, proyectos y el total de horas del periodo (TC-012)", () => {
    render(
      <PeriodSummaryFooter
        summary={{
          recordCount: 3,
          projectCount: 2,
          totalMs: (4 * 60 + 15) * 60_000,
        }}
      />,
    );

    expect(screen.getByText("3 registros")).toBeVisible();
    expect(screen.getByText("2 proyectos")).toBeVisible();
    expect(screen.getByText("04:15:00")).toBeVisible();
  });

  it("muestra 0 registros, 0 proyectos y 00:00:00 cuando el periodo no tiene actividad (TC-013)", () => {
    render(
      <PeriodSummaryFooter
        summary={{ recordCount: 0, projectCount: 0, totalMs: 0 }}
      />,
    );

    expect(screen.getByText("0 registros")).toBeVisible();
    expect(screen.getByText("0 proyectos")).toBeVisible();
    expect(screen.getByText("00:00:00")).toBeVisible();
  });
});
