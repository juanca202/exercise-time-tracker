import type { TimeEntry } from "./types";

export type TimerEntryResult =
  | { ok: true; entry: TimeEntry }
  | { ok: false; code: "INTERVAL_TOO_SHORT"; message: string };

export type ManualEntryResult =
  | { ok: true; entry: TimeEntry }
  | { ok: false; code: "INVALID_DURATION"; message: string };

function toDateString(iso: string): string {
  const d = new Date(iso);
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function createTimerEntry(params: {
  taskId: string;
  startedAt: string;
  endedAt: string;
  id?: string;
  createdAt?: string;
}): TimerEntryResult {
  const started = new Date(params.startedAt).getTime();
  const ended = new Date(params.endedAt).getTime();
  const durationMs = ended - started;

  if (durationMs <= 0) {
    return {
      ok: false,
      code: "INTERVAL_TOO_SHORT",
      message: "El intervalo es demasiado corto",
    };
  }

  const now = params.createdAt ?? new Date().toISOString();

  return {
    ok: true,
    entry: {
      id: params.id ?? crypto.randomUUID(),
      taskId: params.taskId,
      date: toDateString(params.startedAt),
      startedAt: params.startedAt,
      endedAt: params.endedAt,
      durationMs,
      source: "timer",
      createdAt: now,
    },
  };
}

function toLocalMidnightIso(date: string): string {
  const [year, month, day] = date.split("-").map(Number);
  return new Date(year, month - 1, day, 0, 0, 0, 0).toISOString();
}

export function createManualEntry(params: {
  taskId: string;
  date: string;
  durationMs: number;
  id?: string;
  createdAt?: string;
}): ManualEntryResult {
  if (params.durationMs <= 0) {
    return {
      ok: false,
      code: "INVALID_DURATION",
      message: "La duración debe ser mayor que cero",
    };
  }

  const startedAt = toLocalMidnightIso(params.date);
  const endedAt = new Date(
    new Date(startedAt).getTime() + params.durationMs,
  ).toISOString();
  const now = params.createdAt ?? new Date().toISOString();

  return {
    ok: true,
    entry: {
      id: params.id ?? crypto.randomUUID(),
      taskId: params.taskId,
      date: params.date,
      startedAt,
      endedAt,
      durationMs: params.durationMs,
      source: "manual",
      createdAt: now,
    },
  };
}
