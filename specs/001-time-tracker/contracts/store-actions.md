# Store Actions Contract: `useTimeTrackerStore`

**Module**: `src/features/time-tracker/store/time-tracker-store.ts`  
**Persistence**: `localStorage` key `time-tracker:v1`

## Selectors (read)

| Selector                  | Returns                            | Spec refs      |
| ------------------------- | ---------------------------------- | -------------- |
| `getProjects()`           | `Project[]`                        | FR-002         |
| `getTasks()`              | `Task[]`                           | FR-003         |
| `getTasksByProject(id)`   | `Task[]`                           | FR-003         |
| `getActiveTimer()`        | `ActiveTimer \| null`              | FR-005         |
| `getElapsedMs()`          | `number` (live tick)               | FR-016         |
| `getSelectedPeriod()`     | `SelectedPeriod`                   | FR-029         |
| `getWeeklyTotalMs()`      | `number`                           | FR-028         |
| `getMonthlyTotalMs()`     | `number`                           | FR-028         |
| `getWeeklyGoalPercent()`  | `number` 0–100+                    | FR-027         |
| `getProjectTotalMs(id)`   | `number` (filtered period)         | FR-012, SC-010 |
| `getRecentTasks(limit=5)` | `RecentTaskRow[]`                  | FR-016a        |
| `getHistoryRows()`        | `HistoryRow[]`                     | FR-020         |
| `getHistorySummary()`     | `{ count, projectCount, totalMs }` | FR-020         |
| `getProjectSummaries()`   | `{ projectId, name, totalMs }[]`   | FR-020         |

## Actions (write)

| Action                     | Input                          | Preconditions                    | Effects                                                | Spec refs      |
| -------------------------- | ------------------------------ | -------------------------------- | ------------------------------------------------------ | -------------- |
| `createProject`            | `{ name, description? }`       | `name` non-empty                 | Append project; close modal                            | FR-002         |
| `createTask`               | `{ projectId, name }`          | Project exists; `name` non-empty | Append task; close modal                               | FR-003         |
| `startTimer`               | `{ taskId }`                   | Task exists                      | If timer active → `stopTimer` first; set `activeTimer` | FR-005–007     |
| `stopTimer`                | —                              | Timer active                     | Create `TimeEntry` source=timer; clear `activeTimer`   | FR-008, BR-05  |
| `createManualEntry`        | `{ taskId, date, durationMs }` | `durationMs > 0`                 | Append entry source=manual with derived start/end      | FR-010         |
| `setSelectedPeriod`        | `{ year, month }`              | Valid month                      | Update period; aggregates refresh                      | FR-029         |
| `shiftPeriod`              | `delta: -1 \| 1`               | —                                | Move month prev/next                                   | FR-020         |
| `openModal` / `closeModal` | modal id                       | —                                | Toggle UI flags                                        | FR-017, FR-019 |

## Error contract

Actions return `Result<void, StoreError>` or throw typed errors consumed by UI:

| Code                 | User message (es)                       |
| -------------------- | --------------------------------------- |
| `NAME_REQUIRED`      | El nombre es obligatorio                |
| `NO_PROJECTS`        | Crea un proyecto antes de añadir tareas |
| `INVALID_DURATION`   | La duración debe ser mayor que cero     |
| `INTERVAL_TOO_SHORT` | El intervalo es demasiado corto         |
| `TASK_NOT_FOUND`     | Tarea no encontrada                     |

## Side effects

- `persist` middleware writes full state after each mutation
- `storage` event listener rehydrates on cross-tab changes (edge case spec)
