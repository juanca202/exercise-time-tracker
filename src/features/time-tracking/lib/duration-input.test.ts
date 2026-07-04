import { describe, expect, it } from "vitest";
import { parseDurationInput } from "./duration-input";

describe("parseDurationInput", () => {
  it("should_parse_a_valid_hh_mm_string_into_seconds", () => {
    expect(parseDurationInput("02:30")).toBe(9000);
  });

  it("should_parse_a_single_digit_hour", () => {
    expect(parseDurationInput("1:00")).toBe(3600);
  });

  it("should_return_null_for_an_empty_string", () => {
    expect(parseDurationInput("")).toBeNull();
  });

  it("should_return_null_for_a_malformed_string", () => {
    expect(parseDurationInput("abc")).toBeNull();
    expect(parseDurationInput("02-30")).toBeNull();
  });

  it("should_return_null_when_minutes_are_out_of_range", () => {
    expect(parseDurationInput("01:75")).toBeNull();
  });

  it("should_return_null_when_the_resulting_duration_is_zero", () => {
    expect(parseDurationInput("00:00")).toBeNull();
  });

  it("should_return_null_when_the_resulting_duration_is_negative", () => {
    expect(parseDurationInput("-01:00")).toBeNull();
  });
});
