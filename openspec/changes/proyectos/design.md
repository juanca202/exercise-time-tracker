## Context

Greenfield Next.js 16 (App Router) + React 19 + TypeScript app, offline-first, no backend (SRS-001 §2.1, §2.4). This is the first change implemented, so it also establishes the shared local-persistence infrastructure that the later `tareas` and `historial-de-registros` changes will reuse. Follows [ADR-005](../../../docs/adr/ADR-005-arquitectura-feature-based.md) (feature-based architecture), [ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md) (Zustand), [ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md) (Base UI), [ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md) (Tailwind).

## Goals / Non-Goals

**Goals:**

- Implement Project create/edit/list per US-001.
- Stand up a reusable `local-persistence` layer (storage adapter + Zustand `persist` wiring + hydration handling) that the `tareas` and `historial-de-registros` changes will build on for Tasks and Time Records.
- Match the Figma prototype and DESIGN.md design system.

**Non-Goals:**

- Task or Time Record management — covered by the `tareas` change.
- History/reporting — covered by the `historial-de-registros` change.
- Any storage mechanism beyond `localStorage` (no IndexedDB) — see Decisions.
- A dedicated "Editar Proyecto" screen — the Figma prototype only has "Nuevo Proyecto"; edit reuses it.

## Decisions

1. **Persistence: `localStorage` via Zustand `persist`.** Chosen over IndexedDB for simplicity at this data volume (a handful of Projects, later up to ~1,000 Time Records in the `historial-de-registros` change) — synchronous reads/writes in the low-millisecond range, no async-hydration complexity in Zustand, no extra dependency. Documented in full in [US-003's RS-002](../../../docs/specs/user-stories/US-003-historial-de-registros/research/RS-002-persistencia-local-localstorage-vs-indexeddb.md), which this change's persistence layer follows even though that research was written against the history performance requirement.
2. **Storage adapter as shared infrastructure.** Implemented in `src/shared/persistence` as a small `get`/`set`/`subscribe` interface plus a `schemaVersion` field, not inside `src/features/projects`, so the `tareas` and `historial-de-registros` changes reuse it instead of duplicating storage access.
3. **Edit reuses the create modal.** The "Nuevo Proyecto" modal takes an optional `initialValues` prop; when present it renders as "Editar Proyecto" with the fields precargados. Confirmed against Figma — no distinct edit screen exists.
4. **Hydration gating.** All reads of persisted Project state go through a `useHasHydrated()` hook so the server-rendered and first-client-rendered markup match, avoiding Next.js hydration-mismatch errors.

## Risks / Trade-offs

- **[Risk] `localStorage`'s ~5–10 MiB origin quota.** → Mitigation: the storage adapter is isolated behind an interface so a future migration to IndexedDB (if data volume grows) only touches `src/shared/persistence`.
- **[Risk] Safari ITP may purge `localStorage` after 7+ days without interaction.** → Mitigation: call `navigator.storage.persist()` on app load (best-effort, not guaranteed).
- **[Risk] Building shared persistence infrastructure inside the first (smallest) change risks under-designing it for the `tareas` change's heavier needs (timer state, weekly totals) and the `historial-de-registros` change's performance requirement.** → Mitigation: the adapter interface (1./2. above) is intentionally generic (`get`/`set`/`subscribe` over arbitrary JSON-serializable state), not Project-specific.

## Migration Plan

Not applicable — greenfield, no existing data. The `schemaVersion` field is included from the start to avoid a harder migration problem when the `tareas` and `historial-de-registros` changes add their own slices to the same store.

## Open Questions

None blocking. All ambiguities were already resolved during `work-define`/`work-research` (see US-001's Observaciones and research notes).
