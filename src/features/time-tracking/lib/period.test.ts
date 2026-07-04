import { describe, expect, it } from "vitest";
import { addMonths, formatMonthLabel, isEntryInMonth } from "./period";
import { aTimeEntry } from "../testing/object-mothers";

describe("isEntryInMonth", () => {
  it("should_return_true_when_the_entry_date_is_in_the_given_month", () => {
    const entry = aTimeEntry({ date: "2026-03-15" });
    expect(isEntryInMonth(entry, 2026, 3)).toBe(true);
  });

  it("should_return_false_when_the_entry_date_is_in_a_different_month", () => {
    const entry = aTimeEntry({ date: "2026-04-01" });
    expect(isEntryInMonth(entry, 2026, 3)).toBe(false);
  });

  it("should_return_false_when_the_entry_date_is_in_a_different_year", () => {
    const entry = aTimeEntry({ date: "2025-03-15" });
    expect(isEntryInMonth(entry, 2026, 3)).toBe(false);
  });
});

describe("formatMonthLabel", () => {
  it("should_format_the_month_and_year_in_spanish_capitalized", () => {
    expect(formatMonthLabel(2023, 10)).toBe("Octubre 2023");
  });
});

describe("addMonths", () => {
  it("should_add_months_within_the_same_year", () => {
    expect(addMonths(2026, 3, 1)).toEqual({ year: 2026, month: 4 });
  });

  it("should_roll_over_to_the_next_year_in_december", () => {
    expect(addMonths(2026, 12, 1)).toEqual({ year: 2027, month: 1 });
  });

  it("should_roll_back_to_the_previous_year_in_january", () => {
    expect(addMonths(2026, 1, -1)).toEqual({ year: 2025, month: 12 });
  });
});
