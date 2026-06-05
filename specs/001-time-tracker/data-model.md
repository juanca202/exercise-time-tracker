# Data Model: Time Tracker

**Date**: 2026-06-05  
**Spec**: [spec.md](./spec.md)  
**Storage key**: `time-tracker:v1` (localStorage via Zustand persist)

## Entity Relationship

```text
Proyecto 1 ──< Tarea N ──< Registro de Tiempo N
                │
                └── (opcional) Temporizador Activo → taskId
```

## Entities

### Project (`Project`)

| Field         | Type     | Required | Rules                      |
| ------------- | -------- | -------- | -------------------------- |
| `id`          | `string` | yes      | UUID v4, unique            |
| `name`        | `string` | yes      | Trim; min 1 char (FR-002)  |
| `description` | `string` | no       | Trim; empty → omit display |
| `createdAt`   | `string` | yes      | ISO datetime               |

**Relationships**: Has many `Task`.

---

### Task (`Task`)

| Field       | Type     | Required | Rules                                           |
| ----------- | -------- | -------- | ----------------------------------------------- |
| `id`        | `string` | yes      | UUID v4, unique                                 |
| `projectId` | `string` | yes      | Must reference existing Project (FR-003, BR-02) |
| `name`      | `string` | yes      | Trim; min 1 char                                |
| `createdAt` | `string` | yes      | ISO datetime                                    |

**Relationships**: Belongs to one `Project`; has many `TimeEntry`.

---

### TimeEntry (`TimeEntry`)

| Field        | Type                  | Required | Rules                                 |
| ------------ | --------------------- | -------- | ------------------------------------- |
| `id`         | `string`              | yes      | UUID v4                               |
| `taskId`     | `string`              | yes      | FK → Task (BR-03)                     |
| `date`       | `string`              | yes      | `YYYY-MM-DD` — calendar date of entry |
| `startedAt`  | `string`              | yes      | ISO datetime                          |
| `endedAt`    | `string`              | yes      | ISO datetime; `endedAt > startedAt`   |
| `durationMs` | `number`              | yes      | Integer > 0 (BR-05)                   |
| `source`     | `'timer' \| 'manual'` | yes      | See derivation rules                  |
| `createdAt`  | `string`              | yes      | ISO datetime                          |

**Derivation rules**:

- `source: 'timer'`: `durationMs = endedAt - startedAt` from real clock (FR-010b).
- `source: 'manual'`: user provides `date` + `durationMs`; `startedAt = dateT00:00:00` local, `endedAt = startedAt + durationMs` (FR-010a).

**Validation**:

- Reject if `durationMs <= 0` (FR-009).
- Reject manual if duration parse fails or ≤ 0.

---

### ActiveTimer (`ActiveTimer`)

| Field       | Type     | Required | Rules                           |
| ----------- | -------- | -------- | ------------------------------- |
| `taskId`    | `string` | yes      | FK → Task                       |
| `startedAt` | `string` | yes      | ISO datetime when timer started |

**Constraints**: At most one active timer globally (BR-04). `null` when idle.

---

### SelectedPeriod (`SelectedPeriod`)

| Field   | Type     | Required | Rules     |
| ------- | -------- | -------- | --------- |
| `year`  | `number` | yes      | e.g. 2023 |
| `month` | `number` | yes      | 1–12      |

**Default**: Current calendar month. Controlled from Historial UI; syncs Proyectos totals (FR-029).

---

## Persisted Store Shape (`TimeTrackerState`)

```typescript
interface TimeTrackerState {
  projects: Project[];
  tasks: Task[];
  timeEntries: TimeEntry[];
  activeTimer: ActiveTimer | null;
  selectedPeriod: SelectedPeriod;
  // UI flags (ephemeral, optional persist)
  modals: {
    newProject: boolean;
    newTask: boolean;
  };
}
```

## Computed Values (not persisted)

| Computed            | Inputs                                         | Used in                    |
| ------------------- | ---------------------------------------------- | -------------------------- |
| `weeklyTotalMs`     | entries in current Mon–Sun week                | Tareas panel (FR-028)      |
| `monthlyTotalMs`    | entries in current month                       | Tareas panel (FR-028)      |
| `weeklyGoalPercent` | `weeklyTotalMs / 40h`                          | Tareas message (FR-027)    |
| `projectTotalMs`    | entries filtered by `selectedPeriod` + project | Proyectos cards (FR-012)   |
| `recentTasks`       | top 5 tasks by latest entry                    | Tareas recientes (FR-016a) |
| `historyRows`       | entries filtered by `selectedPeriod`           | Historial table (FR-020)   |

## State Transitions

### Timer

```text
idle ──start(task)──> running(task)
running(A) ──start(B)──> stop A (create entry) ──> running(B)
running ──stop()──> idle + new TimeEntry
```

### CRUD (v1 scope)

```text
create Project → append to projects[]
create Task → append to tasks[] (requires project)
create TimeEntry → append (manual or timer stop)
```

No edit/delete in v1 (assumption spec).

## Indexes (in-memory)

For performance with personal-scale data, derive on read:

- `tasksByProjectId: Map<string, Task[]>`
- `entriesByTaskId: Map<string, TimeEntry[]>`
- `entriesByMonth: Map<string, TimeEntry[]>` key `YYYY-MM`

No external DB; full scan acceptable for &lt;10k entries.

## Migration

Version field in persisted JSON: `{ version: 1, state: TimeTrackerState }`. Future migrations in `lib/migrate.ts` if schema changes.
