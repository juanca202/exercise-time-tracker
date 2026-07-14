import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { act, renderHook } from "@testing-library/react";
import { useAhoraEnVivo } from "./useAhoraEnVivo";

describe("useAhoraEnVivo", () => {
  beforeEach(() => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2026, 6, 13, 9, 0, 0));
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("no programa ningún intervalo cuando activo es false", () => {
    const { result } = renderHook(() => useAhoraEnVivo(false));
    const valorInicial = result.current;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(valorInicial);
  });

  it("actualiza el valor cada segundo mientras activo es true", () => {
    const { result } = renderHook(() => useAhoraEnVivo(true));
    const valorInicial = result.current;

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current).toBeGreaterThan(valorInicial);
    expect(result.current - valorInicial).toBeGreaterThanOrEqual(3000);
  });

  it("deja de actualizar tras desmontarse", () => {
    const { result, unmount } = renderHook(() => useAhoraEnVivo(true));
    unmount();
    const valorTrasDesmontar = result.current;

    act(() => {
      vi.advanceTimersByTime(5000);
    });

    expect(result.current).toBe(valorTrasDesmontar);
  });
});
