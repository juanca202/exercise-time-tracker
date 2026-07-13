## Why

With Projects and Tasks/timer/manual-entry implemented (`proyectos` and `tareas` changes), Time Tracker can record time but offers no way to review it in aggregate. [US-003](../../../docs/specs/user-stories/US-003-historial-de-registros/README.md) (Ready, 7 acceptance criteria) closes the MVP loop by letting the user see the full history and totals by Task, Project and month.

## What Changes

- Add the Historial de registros screen: full list of stored Time Records.
- Add total accumulated time by Task.
- Add total accumulated time by Project (sum of its Tasks' totals).
- Add total accumulated time by month, with month-crossing timer records assigned entirely to the Start Time's month (no prorating).
- Meet a performance budget of under 2 seconds to render the full report set for up to 1,000 Time Records.
- Implement the UI per the Figma prototype and DESIGN.md "Precision Focus", with an explicit visual-fidelity acceptance criterion.

No **BREAKING** changes. This change only reads data produced by the `tareas` change — it does not modify how Projects, Tasks or Time Records are created.

## Capabilities

### New Capabilities

- `time-history`: Full time-record history and totals by Task/Project/Month, plus the <2s/1000-record performance requirement. Source: US-003, AC-001 to AC-007.

### Modified Capabilities

- None — this change is read-only over the data model established by `proyectos` and `tareas`.

## Impact

- **Affected code**: `src/features/history` (new). Reads Project/Task/Time Record state from the shared Zustand store; no new persisted state of its own.
- **Dependencies**: none new; reuses `src/shared/persistence`. Confirmed sufficient at this data volume by [RS-002](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) — `localStorage` via Zustand `persist`, no IndexedDB needed.
- **Systems**: none external — offline-first, no backend.
- **Design system**: must match the Figma prototype ("Historial de registros" frame) and DESIGN.md.
- **Sequencing**: depends on both `proyectos` and `tareas` — without Time Records from `tareas`, this screen has nothing to aggregate (though it can be developed in parallel against fixture data).
- **Business rule note**: the month-crossing attribution rule (start-date, no prorating) was resolved via dedicated research — see [RS-001](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-001-regla-cruce-de-mes.md).
