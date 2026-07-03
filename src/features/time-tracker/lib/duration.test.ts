import { describe, expect, it } from "vitest";
import {
  formatDurationClock,
  formatDurationShort,
  parseManualDuration,
} from "./duration";

describe("formatDurationClock", () => {
  it("formats seconds as zero-padded HH:MM:SS", () => {
    expect(formatDurationClock(3844)).toBe("01:04:04");
  });

  it("pads hours past 99 without truncating", () => {
    expect(formatDurationClock(591645)).toBe("164:20:45");
  });

  it("treats negative input as zero", () => {
    expect(formatDurationClock(-5)).toBe("00:00:00");
  });
});

describe("formatDurationShort", () => {
  it("formats seconds as 'Xh Ym'", () => {
    expect(formatDurationShort(46800)).toBe("13h 00m");
  });

  it("pads minutes under 10", () => {
    expect(formatDurationShort(3900)).toBe("1h 05m");
  });
});

describe("parseManualDuration", () => {
  it("parses HH:MM into seconds", () => {
    expect(parseManualDuration("02:30")).toBe(9000);
  });

  it("rejects an invalid format", () => {
    expect(parseManualDuration("abc")).toBeNull();
  });

  it("rejects a zero duration", () => {
    expect(parseManualDuration("00:00")).toBeNull();
  });

  it("rejects minutes over 59", () => {
    expect(parseManualDuration("01:75")).toBeNull();
  });
});
