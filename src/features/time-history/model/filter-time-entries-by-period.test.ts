import { describe, expect, it } from "vitest";
import { filterTimeEntriesByPeriod } from "./filter-time-entries-by-period";

function aTimeEntry(
  overrides: Partial<{ id: string; startedAt: number }> = {},
) {
  return {
    id: "entry-1",
    taskId: "task-1",
    startedAt: new Date(2026, 6, 8).getTime(),
    endedAt: new Date(2026, 6, 8).getTime() + 60_000,
    durationSeconds: 60,
    source: "manual" as const,
    ...overrides,
  };
}

describe("filterTimeEntriesByPeriod", () => {
  it("mantiene solo los Registros de Tiempo dentro del periodo seleccionado", () => {
    // Arrange
    const inPeriod = aTimeEntry({
      id: "in-period",
      startedAt: new Date(2026, 6, 15).getTime(),
    });
    const outOfPeriod = aTimeEntry({
      id: "out-of-period",
      startedAt: new Date(2026, 5, 15).getTime(),
    });

    // Act
    const result = filterTimeEntriesByPeriod([inPeriod, outOfPeriod], {
      year: 2026,
      month: 6,
    });

    // Assert
    expect(result).toEqual([inPeriod]);
  });

  it("devuelve un arreglo vacío cuando ningún registro cae en el periodo", () => {
    // Arrange
    const entry = aTimeEntry({ startedAt: new Date(2026, 5, 15).getTime() });

    // Act
    const result = filterTimeEntriesByPeriod([entry], { year: 2026, month: 6 });

    // Assert
    expect(result).toEqual([]);
  });
});
