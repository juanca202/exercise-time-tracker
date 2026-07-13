## Why

With Projects implemented (`proyectos` change), the app still cannot record any time. [US-002](../../../docs/specs/user-stories/US-002-tareas/README.md) (Ready, 19 acceptance criteria) is the core of Time Tracker: Task management, the single-timer tracker, manual time entry, and the fixed weekly goal — everything the Tasks screen needs to let a user actually track time against a Task.

## What Changes

- Add Task creation under an existing Project (Name required, Project required).
- Add Task editing, reusing the "Nueva Tarea" modal precargado (title/button swapped to "Editar Tarea") — no separate edit screen exists in Figma.
- Add a single, app-wide active timer per Task: start (via the ▷ icon on a Task row), stop, duration computed as End − Start.
- Add auto-stop: starting a timer on a different Task automatically stops and persists the previously active one (only one active timer app-wide).
- Add duration validation (> 0) shared by the timer-stop flow and manual entry.
- Add manual Time Record entry (Task + Fecha + Duración), independent of the timer.
- Add a fixed 40h Weekly Goal (8h × 5 workdays) and a Weekly Total scoped to the current workweek (Monday–Friday only, weekends excluded), with a percentage-of-goal indicator.
- Persist Tasks and Time Records locally, reusing the storage adapter from the `proyectos` change.
- Assemble the full Tasks screen (active timer card, Entrada Manual form, Total Semanal/Total Mensual stat cards, Tareas Recientes list) per the Figma prototype and DESIGN.md.

No **BREAKING** changes.

## Capabilities

### New Capabilities

- `task-management`: Create and edit Tasks under a Project, reusing the creation modal for edit. Source: US-002, AC-001 to AC-005, AC-016.
- `time-tracking`: Single active timer with auto-stop, manual time entry, duration validation, and the fixed Weekly Goal/Weekly Total/percentage indicator scoped to Monday–Friday. Source: US-002, AC-006 to AC-015, AC-017 to AC-019, BR-01 to BR-05.

### Modified Capabilities

- None — `project-management` (from the `proyectos` change) is not modified; this change only consumes it (a Task references an existing Project).

## Impact

- **Affected code**: `src/features/tasks` (new — includes the timer and manual-entry UI, colocated with Task management per the Figma layout and the US-002 scope decision). Extends the shared Zustand store (from `proyectos`) with Task, Time Record and `activeTimer` slices.
- **Dependencies**: none new; reuses `src/shared/persistence` established by the `proyectos` change.
- **Systems**: none external — offline-first, no backend.
- **Design system**: must match the Figma prototype ("Tareas" and "Tareas - Diálogo Nueva Tarea" frames) and DESIGN.md "Precision Focus".
- **Sequencing**: depends on the `proyectos` change (a Task requires an existing Project, BR-01) and should land before `historial-de-registros` (the history view has no data to show without Time Records from this change).
- **Note on scope**: US-002's own INVEST validation marks the "Small" dimension as `Parcial` because it bundles Task management, the timer, and manual entry by explicit product decision; `tasks.md` below breaks this into independently completable steps to keep the implementation reviewable.
