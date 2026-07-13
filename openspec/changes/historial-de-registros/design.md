## Context

Builds on `proyectos` (Project management + shared persistence) and `tareas` (Task management, timer, manual entry — the source of all Time Records). [US-003](../../../docs/specs/user-stories/US-003-historial-de-registros/README.md) is read-only aggregation and presentation over data those two changes already produce and persist.

## Goals / Non-Goals

**Goals:**

- Implement the full history list and totals by Task, Project and month per US-003.
- Meet the <2s render budget for up to 1,000 Time Records.
- Resolve and implement the month-crossing attribution rule via a single, shared helper reused by the `tareas` change's "Total Mensual" stat card.
- Match the Figma prototype and DESIGN.md.

**Non-Goals:**

- Creating, editing or deleting Time Records — out of scope; this change is read-only (that's `tareas`).
- Prorating a timer session across a month boundary — explicitly rejected by research (RS-001); the full duration goes to the Start Time's month.
- Any storage mechanism beyond `localStorage` — confirmed sufficient by RS-002 at this volume; IndexedDB documented as a future upgrade path only if volume grows well past 1,000 records.
- A distinct "total by week" summary on this screen — Weekly Total/Goal lives on the Tasks screen, delivered by the `tareas` change.

## Decisions

1. **Month attribution: by Start Time, no prorating.** A Time Record's month is always `Registro.Fecha` (manual entries) or the date of `HoraInicio` (timer-generated records), per US-003 AC-004 and [RS-001](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-001-regla-cruce-de-mes.md)'s finding that this matches the industry default (Toggl, QuickBooks Time without split) and needs no new persisted state (no splitting a record into two). Implemented as `getRecordMonth(record: TimeRecord): YearMonth`, a pure function shared with the `tareas` change's "Total Mensual" stat card rather than duplicated.
2. **Totals computed as derived selectors, not persisted aggregates.** Total-by-Task, total-by-Project and total-by-month are all `O(n)` reductions over the in-memory Time Record array on read, not maintained incrementally on write. Simpler and, per RS-002's benchmark, well within the 2-second budget at 1,000 records (aggregation cost is on the order of single-digit milliseconds; the storage read itself is the larger, still-small cost).
3. **`localStorage` via Zustand `persist`, no IndexedDB**, confirmed by RS-002 specifically against this change's <2s/1000-record requirement — the storage adapter from `proyectos` is reused unmodified.
4. **Pagination/virtualization deliberately deferred.** At 1,000 records the full table renders within budget without virtualization (per RS-002's cost analysis); if real usage grows well beyond that, list virtualization is the documented next step rather than a premature optimization now.

## Risks / Trade-offs

- **[Risk] The 1,000-record performance budget (AC-005) is the one requirement in this change that needs an actual measurement, not just code review.** → Mitigation: `tasks.md` includes a dedicated fixture-based performance check (1,000-record dataset, render-time assertion) rather than treating it as implicitly satisfied.
- **[Risk] Computing totals as on-read reductions could regress if the record count grows far beyond the 1,000-record target used to validate performance.** → Mitigation: the aggregation logic is isolated in selector functions (Decision 2), making a future move to memoized/incremental totals a localized change if ever needed.
- **[Trade-off] Assigning month-crossing records entirely to the Start Time's month (Decision 1) is the simplest rule, not the most "precise" one (a prorating rule exists in the industry, e.g. QuickBooks Time's opt-in split).** → Accepted per RS-001's recommendation: precision at the minute level across a month boundary isn't required by AC-004 and isn't worth the added data-model complexity for a personal offline tool.

## Migration Plan

Not applicable — read-only feature, no new persisted schema. No changes to the store's `schemaVersion` established by `proyectos`.

## Open Questions

None blocking. The month-crossing rule and the storage-mechanism decision were resolved via `work-research` (RS-001, RS-002) before this change was proposed.
