## 1. Foundations (shared, reused by later changes)

- [ ] 1.1 Define shared domain types (`Project`, and forward-declared `Task`/`TimeRecord` placeholders) in `src/shared/types`.
- [ ] 1.2 Implement the local-persistence storage adapter in `src/shared/persistence` wrapping `localStorage` behind a `get`/`set`/`subscribe` interface, including a `schemaVersion` field.
- [ ] 1.3 Create the root Zustand store with `persist` middleware wired to the storage adapter from 1.2.
- [ ] 1.4 Implement `useHasHydrated()` hook and gate persisted-state reads behind it.
- [ ] 1.5 Call `navigator.storage.persist()` on app load.
- [ ] 1.6 Scaffold `src/features/projects` per ADR-005.
- [ ] 1.7 Build the shared app shell: sidebar navigation (Tareas / Proyectos / Historial de registros, with Tareas/Historial as placeholder links until their changes land) and top-level layout, matching the Figma "Aside - SideNavBar".

## 2. Project management

- [ ] 2.1 Implement the Project slice of the store: create, edit, list — Name (required) + Description (optional).
- [ ] 2.2 Implement `isValidProjectName` validation (non-empty after trim) shared by create and edit paths.
- [ ] 2.3 Build the "Nuevo Proyecto" / "Editar Proyecto" modal component, accepting an optional `initialValues` prop to switch between create and edit.
- [ ] 2.4 Build the Proyectos screen: project cards grid + "Crear Nuevo Proyecto" empty-state card, per Figma.
- [ ] 2.5 Wire Project persistence to the storage adapter (1.2) and verify data survives reload.
- [ ] 2.6 Apply DESIGN.md "Precision Focus" tokens to the Proyectos screen and modal.
- [ ] 2.7 Visual QA pass of the Proyectos screen and modal against the Figma "Proyectos" / "Proyectos - Diálogo Nuevo proyecto" frames.

## 3. Verification

- [ ] 3.1 Confirm the Proyectos screen is fully usable with network disabled (offline-first).
- [ ] 3.2 Confirm no authentication gate exists before reaching the Proyectos screen.
- [ ] 3.3 Run the existing `TC-XXX` test cases under `docs/specs/user-stories/US-001-proyectos/test-cases/` against the implementation and record results.
- [ ] 3.4 Confirm every `AC-XXX` of US-001 is satisfied end-to-end.
