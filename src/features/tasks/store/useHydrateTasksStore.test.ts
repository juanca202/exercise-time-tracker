import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useTasksStore } from "./tasksStore";
import { useHydrateTasksStore } from "./useHydrateTasksStore";

describe("useHydrateTasksStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rehidrata useTasksStore desde localStorage al montarse", () => {
    const rehydrate = vi.spyOn(useTasksStore.persist, "rehydrate");

    renderHook(() => useHydrateTasksStore());

    expect(rehydrate).toHaveBeenCalledTimes(1);
  });
});
