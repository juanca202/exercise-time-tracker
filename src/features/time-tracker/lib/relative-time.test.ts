import { describe, expect, it } from "vitest";
import { formatRelativeTime } from "./relative-time";

const NOW = new Date("2026-07-02T12:00:00.000Z");

describe("formatRelativeTime", () => {
  it("returns 'hace un momento' for less than a minute ago", () => {
    expect(formatRelativeTime("2026-07-02T11:59:30.000Z", NOW)).toBe(
      "hace un momento",
    );
  });

  it("returns minutes ago under an hour", () => {
    expect(formatRelativeTime("2026-07-02T10:30:00.000Z", NOW)).toBe(
      "hace 90m",
    );
  });

  it("returns hours ago under a day", () => {
    expect(formatRelativeTime("2026-07-02T10:00:00.000Z", NOW)).toBe("hace 2h");
  });

  it("returns 'Ayer' for exactly one day ago", () => {
    expect(formatRelativeTime("2026-07-01T12:00:00.000Z", NOW)).toBe("Ayer");
  });

  it("returns days ago for more than one day", () => {
    expect(formatRelativeTime("2026-06-29T12:00:00.000Z", NOW)).toBe(
      "hace 3 días",
    );
  });
});
