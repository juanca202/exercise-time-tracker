## Context

Builds on the `proyectos` change (Project management + the shared `local-persistence` layer). [US-002](../../../docs/specs/user-stories/US-002-tareas/README.md) is the largest and riskiest of the three user stories: it combines CRUD-like Task management with a stateful, app-wide single-timer machine (BR-02/BR-03), manual time entry, and a fixed weekly-goal calculation whose exact scope (Monday–Friday vs. full calendar week) was resolved through dedicated research ([RS-001](../../../docs/specs/user-stories/US-002-tareas/research/RS-001-inicio-semana-total-semanal.md)).

## Goals / Non-Goals

**Goals:**

- Implement Task create/edit, the single-timer tracker with auto-stop, manual entry, and the Weekly Goal/Weekly Total per US-002.
- Keep the timer's exclusivity rule (BR-02/BR-03) enforced in one place (the store), not duplicated across UI call sites.
- Match the Figma prototype and DESIGN.md.

**Non-Goals:**

- Project management — already covered by the `proyectos` change.
- History/reporting across all Time Records — covered by `historial-de-registros`.
- A configurable week-start day or a configurable weekly goal — both are fixed by explicit product decision (BR-05, RS-001), not exposed as settings in this MVP.
- Prorating/splitting a timer session across a month boundary — out of scope for this change; the assignment rule lives in the `historial-de-registros` change's totals (US-003 AC-004), this change only needs to record accurate Start/End timestamps.

## Decisions

1. **Timer as a single source of truth in the shared store**: `activeTimer: { taskId, startedAt } | null`, with a derived selector "is this Task's timer running", not per-Task local component state. Required by BR-02/BR-03 — there is exactly one place that can be active app-wide, so it cannot live in a component that only knows about one Task.
2. **`startTimer(taskId)` performs the auto-stop internally**: if `activeTimer` is set and belongs to a different Task, it is stopped (Duration computed, Time Record persisted) as the first step of `startTimer`, before the new timer starts. This keeps BR-03's ordering guarantee (stop-then-start) inside one atomic store action instead of relying on call-site sequencing.
3. **Duration validation centralized**: a single `isValidDuration(minutes: number): boolean` (`> 0`) guard, shared by `stopTimer()` and `addManualTimeRecord()` (BR-04), instead of duplicating the check.
4. **Fixed workweek Monday–Friday**: `getWorkweekRange(date: Date)` always returns Monday 00:00:00–Friday 23:59:59 of the week containing `date`, Monday hardcoded (not derived from `Intl.Locale`, per RS-001's finding that browser-locale week-start detection has real cross-browser gaps and doesn't simplify anything here). The Weekly Total selector filters Time Records through this range; the Weekly Goal is a hardcoded `480` (8h × 5 days) constant, matching the same Monday–Friday scope so the percentage calculation is meaningful.
5. **Task and Time Record persistence reuse the `local-persistence` adapter** built in the `proyectos` change — no new storage mechanism introduced.
6. **Edit reuses the create modal**, same pattern as Projects: "Nueva Tarea" takes an optional `initialValues` prop and swaps to "Editar Tarea".

## Risks / Trade-offs

- **[Risk] The timer state machine (start / auto-stop / stop / duration validation) is the highest-complexity, highest-risk piece of the MVP** (reflected in US-002's 8-point estimate). → Mitigation: isolate it in a single store module with unit tests covering BR-02/BR-03/BR-04 directly (no UI required), before wiring the UI.
- **[Risk] Bundling Task management + timer + manual entry + weekly goal in one change/US risks a large, hard-to-review implementation.** → Mitigation: `tasks.md` sequences these as independently completable, independently testable groups.
- **[Trade-off] Fixing the workweek to Monday–Friday is a product opinion validated with the user during `work-research`, not a technical necessity** — documented here so a future "configurable week" request has one clear place (`getWorkweekRange`) to change.
- **[Risk] The ▷ icon as the sole timer-start affordance is an inferred interaction (confirmed with the user, not explicit in the original Figma annotations).** → Mitigation: covered explicitly by a `time-tracking` spec scenario and a task-list QA step, so a Figma update can be caught by spec drift.

## Migration Plan

Not applicable — greenfield. Task and Time Record slices are added to the same versioned store established by `proyectos`; no data migration needed since no Task/Time Record data exists yet.

## Open Questions

None blocking. Edit-modal reuse, weekly-goal scope, and the timer-start affordance were resolved during `work-define`/`work-research` (see US-002's Observaciones and RS-001).
