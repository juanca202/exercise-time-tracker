import { renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { useProjectsStore } from "./projectsStore";
import { useHydrateProjectsStore } from "./useHydrateProjectsStore";

describe("useHydrateProjectsStore", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("rehidrata useProjectsStore desde localStorage al montarse", () => {
    const rehydrate = vi.spyOn(useProjectsStore.persist, "rehydrate");

    renderHook(() => useHydrateProjectsStore());

    expect(rehydrate).toHaveBeenCalledTimes(1);
  });
});
