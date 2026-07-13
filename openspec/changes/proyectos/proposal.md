## Why

Time Tracker has no implemented functionality yet. [US-001](../../../docs/specs/user-stories/US-001-proyectos/README.md) (Ready, 9 acceptance criteria) specifies Project management as the foundation the rest of the app builds on — a Task cannot exist without a Project (US-002, BR-01). This change implements that foundation first.

## What Changes

- Add Project creation: Name (required) + Description (optional).
- Add Project editing, reusing the "Nuevo Proyecto" modal precargado with the existing data (title/button swapped to "Editar Proyecto") — the Figma prototype has no separate edit screen.
- Add the Proyectos list screen (project cards + "Crear Nuevo Proyecto" empty-state card).
- Persist Projects locally (offline-first, no backend), surviving reload/restart.
- Add sidebar navigation to the Proyectos section.
- Implement the UI per DESIGN.md "Precision Focus" and the Figma prototype, with an explicit visual-fidelity acceptance criterion.

No **BREAKING** changes — first implementation, greenfield.

## Capabilities

### New Capabilities

- `project-management`: Create, edit and list Projects, persisted locally. Source: [US-001](../../../docs/specs/user-stories/US-001-proyectos/README.md), AC-001 to AC-009.

### Modified Capabilities

- None.

## Impact

- **Affected code**: `src/features/projects` (new), plus the shared app shell (sidebar nav) and `src/shared/persistence` (new — local storage adapter, reused by the `tareas` and `historial-de-registros` changes).
- **Dependencies**: no new runtime dependency; storage via native `localStorage` + Zustand `persist` ([ADR-004](../../../docs/adr/ADR-004-uso-de-zustand.md)); UI via Base UI ([ADR-003](../../../docs/adr/ADR-003-uso-de-base-ui.md)) and Tailwind CSS ([ADR-002](../../../docs/adr/ADR-002-uso-de-tailwind-css.md)).
- **Systems**: none external — fully client-side, offline-first (SRS-001 §2.1, §2.4).
- **Design system**: must match the Figma prototype (`https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker`, "Proyectos" and "Proyectos - Diálogo Nuevo proyecto" frames).
- **Sequencing**: this change should land before the `tareas` change, since Tasks require an existing Project (US-002 BR-01).
