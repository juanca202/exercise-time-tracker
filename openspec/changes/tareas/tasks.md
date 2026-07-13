## 1. Foundations

- [ ] 1.1 Extend the shared domain types (`src/shared/types`) with `Task` and `TimeRecord`, referencing `Project` from the `proyectos` change.
- [ ] 1.2 Scaffold `src/features/tasks` per ADR-005 (includes the timer and manual-entry sub-modules, colocated per the Figma layout).
- [ ] 1.3 Activate the "Tareas" sidebar link (placeholder from the `proyectos` change) to point at the new screen.

## 2. Task management

- [ ] 2.1 Implement the Task slice of the store: create, edit, list-by-project — Name (required) + ProjectId (required, must reference an existing Project).
- [ ] 2.2 Implement `isValidTask` validation (Project selected + non-empty Name) shared by create and edit paths.
- [ ] 2.3 Build the "Nueva Tarea" / "Editar Tarea" modal (Proyecto select + Nombre input), reusing the create/edit-modal pattern from the `proyectos` change.
- [ ] 2.4 Wire Task persistence to the shared storage adapter and verify data (including Project association) survives reload.
- [ ] 2.5 Apply DESIGN.md tokens to the Task modal.

## 3. Timer

- [ ] 3.1 Implement the `activeTimer: { taskId, startedAt } | null` slice in the store, with a selector for "is this Task's timer running".
- [ ] 3.2 Implement `isValidDuration(minutes)` (`> 0`) as a shared guard used by both the timer and manual entry.
- [ ] 3.3 Implement `startTimer(taskId)`: if another timer is active on a different Task, stop and persist it first (auto-stop, BR-02/BR-03), then set the new `activeTimer`.
- [ ] 3.4 Implement `stopTimer()`: compute Duration = now − startedAt, validate with `isValidDuration`, and persist the resulting Time Record; discard if not valid.
- [ ] 3.5 Unit-test the timer state machine directly (start / auto-stop / stop / zero-duration rejection) before wiring the UI.
- [ ] 3.6 Wire the ▷ icon on each Task row to `startTimer(taskId)`.
- [ ] 3.7 Build the active-timer card (Task name, project/phase label, elapsed time counter, "Detener Sesión" button) per Figma.
- [ ] 3.8 Confirm start/stop-and-persist complete in under 1 second (AC-012).

## 4. Manual time entry

- [ ] 4.1 Implement `addManualTimeRecord({ taskId, date, durationMinutes })` using `isValidDuration`.
- [ ] 4.2 Build the "Entrada Manual" form (Fecha, Proyecto/Tarea combobox, Duración, "Guardar Registro") per Figma.
- [ ] 4.3 Wire form submission to `addManualTimeRecord`, with an inline error state when Duration is not > 0.
- [ ] 4.4 Verify manual Time Records persist and survive reload.

## 5. Weekly goal and weekly total

- [ ] 5.1 Implement `getWorkweekRange(date: Date)` returning Monday 00:00:00–Friday 23:59:59 of the week containing `date`, Monday hardcoded as week start.
- [ ] 5.2 Implement `WEEKLY_GOAL_MINUTES = 480` (8h × 5 days) as a fixed, non-configurable constant.
- [ ] 5.3 Implement a selector that sums Time Records (timer + manual) whose date falls within `getWorkweekRange(now)`, excluding Saturday/Sunday and the previous calendar week.
- [ ] 5.4 Implement the Weekly Goal percentage calculation `(weeklyTotal / WEEKLY_GOAL_MINUTES) * 100`, uncapped above 100%.
- [ ] 5.5 Build the "Has alcanzado el X% de tu meta semanal" copy and the "TOTAL SEMANAL" stat card on the Tasks screen per Figma.

## 6. Tasks screen assembly

- [ ] 6.1 Implement `getRecordMonth(record: TimeRecord)`, reused by the "TOTAL MENSUAL" stat card here and by the `historial-de-registros` change's totals.
- [ ] 6.2 Build the "TOTAL MENSUAL" stat card using `getRecordMonth` over the current calendar month.
- [ ] 6.3 Build the "Tareas Recientes" list (recent tasks with duration/status and the ▷ start-timer affordance) per Figma.
- [ ] 6.4 Assemble the full Tasks screen (active timer card + Entrada Manual + stat cards + Tareas Recientes) and wire the "Nueva Tarea" button.
- [ ] 6.5 Apply DESIGN.md tokens to the full Tasks screen.
- [ ] 6.6 Visual QA pass of the Tasks screen against the Figma "Tareas" frame.

## 7. Verification

- [ ] 7.1 Confirm the Tasks screen is fully usable with network disabled (offline-first).
- [ ] 7.2 Run the existing `TC-XXX` test cases under `docs/specs/user-stories/US-002-tareas/test-cases/` against the implementation and record results.
- [ ] 7.3 Confirm every `AC-XXX` of US-002 is satisfied end-to-end.
