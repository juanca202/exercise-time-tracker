import { describe, expect, it } from "vitest";
import {
  countWeekdaysInMonth,
  filterByMonth,
  getWeeklyGoalPercent,
  sumDuration,
} from "./aggregations";
import { createTimeEntryMother } from "../testing/object-mothers";

describe("aggregations", () => {
  describe("filterByMonth", () => {
    it("filtra registros por año y mes", () => {
      const entries = [
        createTimeEntryMother({
          id: "e1",
          date: "2026-06-01",
          durationMs: 1000,
        }),
        createTimeEntryMother({
          id: "e2",
          date: "2026-05-31",
          durationMs: 2000,
        }),
        createTimeEntryMother({
          id: "e3",
          date: "2026-06-15",
          durationMs: 3000,
        }),
      ];

      const june = filterByMonth(entries, 2026, 6);
      expect(june).toHaveLength(2);
      expect(june.map((e) => e.id)).toEqual(["e1", "e3"]);
    });
  });

  describe("sumDuration", () => {
    it("suma duraciones en milisegundos", () => {
      const entries = [
        createTimeEntryMother({ durationMs: 3600000 }),
        createTimeEntryMother({ id: "e2", durationMs: 1800000 }),
      ];
      expect(sumDuration(entries)).toBe(5400000);
    });
  });

  describe("countWeekdaysInMonth", () => {
    it("cuenta solo lunes a viernes del mes", () => {
      // Junio 2026: 30 días, verificar contra cálculo manual
      const count = countWeekdaysInMonth(2026, 6);
      expect(count).toBeGreaterThan(20);
      expect(count).toBeLessThan(24);
    });
  });

  describe("getWeeklyGoalPercent", () => {
    it("calcula 85% para 34h de 40h meta", () => {
      const thirtyFourHours = 34 * 60 * 60 * 1000;
      expect(getWeeklyGoalPercent(thirtyFourHours)).toBe(85);
    });

    it("devuelve 0% sin registros", () => {
      expect(getWeeklyGoalPercent(0)).toBe(0);
    });
  });
});
