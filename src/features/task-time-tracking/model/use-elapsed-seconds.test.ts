import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { useElapsedSeconds } from "./use-elapsed-seconds";

describe("useElapsedSeconds", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(0);
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("devuelve 0 cuando no hay temporizador activo", () => {
    const { result } = renderHook(() => useElapsedSeconds(null));

    expect(result.current).toBe(0);
  });

  it("aumenta cada segundo mientras el temporizador está activo", () => {
    const { result } = renderHook(() => useElapsedSeconds(0));

    expect(result.current).toBe(0);

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBe(3);
  });
});
