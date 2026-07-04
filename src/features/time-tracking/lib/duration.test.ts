import { describe, expect, it } from "vitest";
import { formatDuration } from "./duration";

describe("formatDuration", () => {
  it("should_format_zero_seconds", () => {
    expect(formatDuration(0)).toBe("00:00:00");
  });

  it("should_format_seconds_under_a_minute", () => {
    expect(formatDuration(9)).toBe("00:00:09");
  });

  it("should_format_seconds_over_an_hour_with_padding", () => {
    expect(formatDuration(3600 + 4 * 60 + 4)).toBe("01:04:04");
  });
});
