import { describe, expect, it } from "vitest";
import { useTimeEntryStore } from "@/shared/store/use-time-entry-store";
import { useTimerStore } from "./use-timer-store";

function resetStores() {
  useTimerStore.setState({ activeTimer: null });
  useTimeEntryStore.setState({ timeEntries: [] });
}

describe("rendimiento del temporizador (AC-018, AC-019)", () => {
  it("inicia y detiene el temporizador en menos de 1 segundo", () => {
    resetStores();

    const startElapsedMs = measure(() =>
      useTimerStore.getState().start("task-1"),
    );
    const stopElapsedMs = measure(() => useTimerStore.getState().stop());

    expect(startElapsedMs).toBeLessThan(1000);
    expect(stopElapsedMs).toBeLessThan(1000);
  });
});

function measure(action: () => void): number {
  const start = performance.now();
  action();
  return performance.now() - start;
}
