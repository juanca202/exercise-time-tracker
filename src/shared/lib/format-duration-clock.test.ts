import { describe, expect, it } from "vitest";
import { formatDurationClock } from "./format-duration-clock";

describe("formatDurationClock", () => {
  it("formatea segundos como H:MM:SS", () => {
    expect(formatDurationClock(3 * 3600 + 30 * 60)).toBe("3:30:00");
  });

  it("no acota las horas a 24", () => {
    expect(formatDurationClock(164 * 3600 + 20 * 60 + 45)).toBe("164:20:45");
  });

  it("formatea 0 segundos como 0:00:00", () => {
    expect(formatDurationClock(0)).toBe("0:00:00");
  });
});
