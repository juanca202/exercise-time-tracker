import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { ProjectSummaryCard } from "./ProjectSummaryCard";

describe("ProjectSummaryCard", () => {
  it("muestra el Nombre del Proyecto y su total acumulado en el periodo (TC-005)", () => {
    render(
      <ProjectSummaryCard
        projectName="Website"
        totalMs={(2 * 60 + 15) * 60_000}
      />,
    );

    expect(screen.getByText("Website")).toBeVisible();
    expect(screen.getByText("2h 15m")).toBeVisible();
  });

  it("muestra 0h 00m cuando el Proyecto no tiene Registros en el periodo (TC-006)", () => {
    render(<ProjectSummaryCard projectName="App Móvil" totalMs={0} />);

    expect(screen.getByText("App Móvil")).toBeVisible();
    expect(screen.getByText("0h 00m")).toBeVisible();
  });
});
