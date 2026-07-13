## 1. Foundations

- [ ] 1.1 Scaffold `src/features/history` per ADR-005.
- [ ] 1.2 Activate the "Historial de registros" sidebar link (placeholder from the `proyectos` change) to point at the new screen.
- [ ] 1.3 Implement `getRecordMonth(record: TimeRecord)` if not already present from the `tareas` change, ensuring both features import the same shared helper (`src/shared`) rather than duplicating it.

## 2. Totals and selectors

- [ ] 2.1 Implement the total-by-Task selector (sum of Durations grouped by TaskId).
- [ ] 2.2 Implement the total-by-Project selector (sum of each Project's Tasks' totals).
- [ ] 2.3 Implement the total-by-month selector using `getRecordMonth` (start-date attribution, no prorating).
- [ ] 2.4 Unit-test the month-crossing case explicitly: a record with Start Time in month N and End Time in month N+1 counts entirely toward month N.

## 3. History screen

- [ ] 3.1 Build the period navigator (previous/next month) header per Figma.
- [ ] 3.2 Build the per-Project stat cards using the total-by-Project selector, scoped to the selected period.
- [ ] 3.3 Build the records data table (Fecha, Proyecto, Tarea, Duración) sourced from the full Time Record list.
- [ ] 3.4 Build the footer summary (registros encontrados, proyectos, total de horas).
- [ ] 3.5 Handle the empty-history state (no Time Records yet).
- [ ] 3.6 Apply DESIGN.md "Precision Focus" tokens to the full screen.
- [ ] 3.7 Visual QA pass against the Figma "Historial de registros" frame.

## 4. Performance verification

- [ ] 4.1 Build a 1,000-Time-Record fixture (spanning multiple Tasks, Projects and months, including at least one month-crossing timer record) for testing.
- [ ] 4.2 Measure render time of the Historial de registros screen against the fixture and confirm it completes in under 2 seconds (AC-005).
- [ ] 4.3 If the budget is at risk, apply the mitigation documented in design.md (list virtualization) — otherwise, explicitly record that it was not needed.

## 5. Verification

- [ ] 5.1 Confirm the Historial de registros screen is fully usable with network disabled (offline-first).
- [ ] 5.2 Run the existing `TC-XXX` test cases under `docs/specs/user-stories/US-003-historial-de-registros/test-cases/` against the implementation and record results, including the updated TC-012 (month-crossing).
- [ ] 5.3 Confirm every `AC-XXX` of US-003 is satisfied end-to-end.
