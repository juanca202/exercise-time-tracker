import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { TimeHistoryTable } from "./TimeHistoryTable";

describe("TimeHistoryTable", () => {
  it("muestra el mensaje de vacío cuando no hay filas en el periodo (TC-002)", () => {
    render(<TimeHistoryTable rows={[]} />);

    expect(
      screen.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeVisible();
  });

  it("lista cada fila con Fecha, Proyecto, Tarea y Duración (TC-001/010)", () => {
    render(
      <TimeHistoryTable
        rows={[
          {
            taskId: "task-1",
            taskName: "Diseño",
            projectName: "Website",
            totalMs: (1 * 60 + 30) * 60_000,
            lastActivityIso: new Date(2026, 6, 8).toISOString(),
          },
        ]}
      />,
    );

    expect(screen.getByText("8 jul. 2026")).toBeVisible();
    expect(screen.getByText("Website")).toBeVisible();
    expect(screen.getByText("Diseño")).toBeVisible();
    expect(screen.getByText("01:30:00")).toBeVisible();
  });
});
