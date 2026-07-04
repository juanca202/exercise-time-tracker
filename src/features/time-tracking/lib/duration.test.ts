import { describe, expect, it } from "vitest";
import { formatDuration, formatRelativeTime } from "./duration";

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

describe("formatRelativeTime", () => {
  it("should_return_just_now_for_less_than_a_minute", () => {
    expect(
      formatRelativeTime(new Date(Date.now() - 30_000).toISOString()),
    ).toBe("Justo ahora");
  });

  it("should_return_minutes_for_less_than_an_hour", () => {
    expect(
      formatRelativeTime(new Date(Date.now() - 5 * 60_000).toISOString()),
    ).toBe("hace 5min");
  });

  it("should_return_hours_for_less_than_a_day", () => {
    expect(
      formatRelativeTime(new Date(Date.now() - 2 * 3_600_000).toISOString()),
    ).toBe("hace 2h");
  });

  it("should_return_yesterday_for_exactly_one_day", () => {
    expect(
      formatRelativeTime(new Date(Date.now() - 24 * 3_600_000).toISOString()),
    ).toBe("Ayer");
  });

  it("should_return_days_for_more_than_a_day", () => {
    expect(
      formatRelativeTime(
        new Date(Date.now() - 3 * 24 * 3_600_000).toISOString(),
      ),
    ).toBe("hace 3 días");
  });
});
