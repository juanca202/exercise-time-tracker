import { beforeEach, describe, expect, it } from "vitest";
import { loadState, saveState, STORAGE_KEY } from "./storage";
import type { TimeTrackingState } from "../types/domain";

function anEmptyState(): TimeTrackingState {
  return { projects: [], tasks: [], timeEntries: [], activeTimer: null };
}

describe("storage", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("should_return_null_when_nothing_persisted", () => {
    // Arrange
    // (localStorage cleared in beforeEach)

    // Act
    const result = loadState();

    // Assert
    expect(result).toBeNull();
  });

  it("should_persist_and_reload_the_same_state", () => {
    // Arrange
    const state: TimeTrackingState = {
      ...anEmptyState(),
      projects: [
        { id: "p1", name: "Proyecto 1", createdAt: "2026-01-01T00:00:00.000Z" },
      ],
    };

    // Act
    saveState(state);
    const result = loadState();

    // Assert
    expect(result).toEqual(state);
  });

  it("should_return_null_when_persisted_value_is_not_valid_json", () => {
    // Arrange
    localStorage.setItem(STORAGE_KEY, "{not-json");

    // Act
    const result = loadState();

    // Assert
    expect(result).toBeNull();
  });
});
