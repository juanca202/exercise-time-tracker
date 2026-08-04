import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { HistoryTable } from "./history-table";

const projects = [{ id: "p1", name: "Quantum Redesign", description: "" }];
const tasks = [{ id: "t1", projectId: "p1", name: "Wireframing" }];
const timeEntries = [
  {
    id: "e1",
    taskId: "t1",
    source: "manual" as const,
    date: "2026-07-26",
    durationSeconds: 3600 * 3 + 60 * 30,
  },
  {
    id: "e2",
    taskId: "t1",
    source: "timer" as const,
    date: "2026-07-25",
    durationSeconds: 3600,
  },
];

describe("HistoryTable", () => {
  it("muestra el mensaje de estado vacío cuando no hay Registros de Tiempo", () => {
    render(<HistoryTable timeEntries={[]} tasks={tasks} projects={projects} />);

    expect(
      screen.getByText("No hay Registros de Tiempo en este periodo."),
    ).toBeInTheDocument();
  });

  it("lista cada Registro de Tiempo con Fecha, Proyecto, Tarea y Duración", () => {
    render(
      <HistoryTable
        timeEntries={timeEntries}
        tasks={tasks}
        projects={projects}
      />,
    );

    expect(screen.getByText("26 jul. 2026")).toBeInTheDocument();
    expect(screen.getAllByText("Quantum Redesign")).toHaveLength(2);
    expect(screen.getAllByText("Wireframing")).toHaveLength(2);
    expect(screen.getByText("03:30:00")).toBeInTheDocument();
    expect(screen.getByText("01:00:00")).toBeInTheDocument();
  });

  it("muestra el resumen: registros encontrados, proyectos y total de horas", () => {
    render(
      <HistoryTable
        timeEntries={timeEntries}
        tasks={tasks}
        projects={projects}
      />,
    );

    expect(screen.getByText("2 registros")).toBeInTheDocument();
    expect(screen.getByText("1 proyectos")).toBeInTheDocument();
    expect(screen.getByText("04:30:00")).toBeInTheDocument();
  });
});
