import { describe, expect, it } from "vitest";
import { formatTimeAmPm } from "./format-time-am-pm";

describe("formatTimeAmPm", () => {
  it("formatea la mañana con AM", () => {
    expect(formatTimeAmPm(new Date(2026, 6, 8, 9, 15).getTime())).toBe(
      "09:15 AM",
    );
  });

  it("formatea la tarde con PM", () => {
    expect(formatTimeAmPm(new Date(2026, 6, 8, 13, 5).getTime())).toBe(
      "01:05 PM",
    );
  });

  it("formatea medianoche como 12:00 AM", () => {
    expect(formatTimeAmPm(new Date(2026, 6, 8, 0, 0).getTime())).toBe(
      "12:00 AM",
    );
  });

  it("formatea mediodía como 12:00 PM", () => {
    expect(formatTimeAmPm(new Date(2026, 6, 8, 12, 0).getTime())).toBe(
      "12:00 PM",
    );
  });
});
