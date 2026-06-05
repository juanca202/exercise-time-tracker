# Implementation Plan: Time Tracker

**Branch**: `001-time-tracker` | **Date**: 2026-06-05 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-time-tracker/spec.md`

## Summary

Implementar una aplicación personal de registro de tiempo (proyectos → tareas → registros) con temporizador, entrada manual, totales semanal/mensual con metas, historial filtrable por mes y persistencia offline en `localStorage`. Stack: Next.js 16 App Router, React 19, Zustand persist, Tailwind v4 + tokens `DESIGN.md`, Base UI, iconos `@heroicons/react` alineados a wireframes. Código bajo `src/features/time-tracker/` siguiendo wireframes en `specs/001-time-tracker/assets/`.

## Technical Context

**Language/Version**: TypeScript 5 (strict), Node.js 20+

**Primary Dependencies**: Next.js 16.2, React 19, Zustand 5, @base-ui/react, @heroicons/react, Tailwind CSS v4

**Storage**: `localStorage` vía Zustand `persist` (clave `time-tracker:v1`); sin backend

**Testing**: Vitest 4 + Testing Library + jsdom; TDD en `lib/` y `store/`

**Target Platform**: Navegador moderno (SPA offline-first); responsive desktop/tablet según DESIGN.md

**Project Type**: Web application (single Next.js app)

**Performance Goals**: UI del temporizador actualiza cada 1 s sin jank; operaciones CRUD imperceptibles (&lt;100 ms) en datasets personales (&lt;5k registros)

**Constraints**: Offline-first (BR-01); un solo temporizador (BR-04); UI en español; sin auth/API

**Scale/Scope**: 1 usuario; 3 rutas + 2 modales; 4 user stories P1–P4; 5 wireframes

## Constitution Check

_GATE: Must pass before Phase 0 research. Re-check after Phase 1 design._

Reference: `.specify/memory/constitution.md` (v1.0.0). All items MUST pass or be listed in _Complexity Tracking_.

| Gate               | Requirement                                                                        | Status |
| ------------------ | ---------------------------------------------------------------------------------- | ------ |
| Decision hierarchy | Plan aligns with MEMORY.md, Accepted ADRs, and spec/user-story BR-SC               | ✅     |
| Routing            | App Router only under `src/app/`; no `pages/`                                      | ✅     |
| Structure          | Feature code under `src/features/time-tracker/`; shared UI in `src/components/ui/` | ✅     |
| Spec traceability  | User stories P1–P4; clarifications 2026-06-05 integradas (incl. FR-030)            | ✅     |
| Stack              | Next 16, React 19, Tailwind, Base UI, Zustand, @heroicons/react per ADRs/spec      | ✅     |
| Scope              | Sin backend/auth; localStorage solo                                                | ✅     |
| UI                 | DESIGN.md + wireframes LB-TT-img-1..5 + @heroicons/react (FR-030)                  | ✅     |
| Quality            | `lint`, `test:run`, `build` en quickstart; TDD lib/store                           | ✅     |
| Simplicity         | Solo deps aprobadas (spec/ADRs); agregaciones como funciones puras                 | ✅     |

**Post-design re-check**: ✅ Sin violaciones. No entries en Complexity Tracking.

## Project Structure

### Documentation (this feature)

```text
specs/001-time-tracker/
├── plan.md              # This file
├── research.md          # Phase 0
├── data-model.md        # Phase 1
├── quickstart.md        # Phase 1
├── contracts/           # Phase 1
│   ├── routes.md
│   ├── store-actions.md
│   └── storage-schema.json
├── assets/              # Wireframes LB-TT-img-1..5
├── spec.md
└── tasks.md             # Phase 2 (/speckit-tasks — not yet)
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── layout.tsx                 # Root: fonts Inter + JetBrains Mono, lang=es
│   ├── globals.css                # DESIGN.md tokens (@theme Tailwind v4)
│   └── (tracker)/
│       ├── layout.tsx             # Sidebar + main shell
│       ├── page.tsx               # / → Tareas
│       ├── proyectos/page.tsx
│       └── historial/page.tsx
├── components/
│   └── ui/                        # Base UI wrappers (Button, Dialog, Input, Select…)
├── features/
│   └── time-tracker/
│       ├── components/
│       │   ├── icons.tsx              # Re-exports @heroicons/react por contexto UI
│       │   ├── sidebar.tsx
│       │   ├── tasks-page.tsx
│       │   ├── active-timer-panel.tsx
│       │   ├── manual-entry-panel.tsx
│       │   ├── recent-tasks-list.tsx
│       │   ├── projects-page.tsx
│       │   ├── project-card.tsx
│       │   ├── history-page.tsx
│       │   ├── period-selector.tsx
│       │   ├── new-project-modal.tsx
│       │   └── new-task-modal.tsx
│       ├── store/
│       │   ├── time-tracker-store.ts
│       │   └── time-tracker-store.test.ts
│       ├── lib/
│       │   ├── types.ts
│       │   ├── duration.ts          # parse/format ms ↔ HH:MM:SS
│       │   ├── aggregations.ts      # weekly/monthly/period filters, goals
│       │   ├── time-entry-factory.ts
│       │   ├── *.test.ts
│       └── testing/
│           └── object-mothers.ts
└── lib/
    └── utils.ts                     # cn() helper if needed
```

**Structure Decision**: Monolito Next.js con arquitectura por features (constitución II, ADR-004). Páginas en `src/app/(tracker)/` solo importan y componen; toda lógica de dominio en `src/features/time-tracker/`.

## Implementation Phases (guidance for tasks.md)

### Phase A — Fundación (US-1)

- Instalar `@heroicons/react`; módulo `icons.tsx` con re-exports (R-011)
- Tokens CSS + fuentes DESIGN.md en layout
- Store Zustand + persist + tipos
- Layout sidebar + rutas vacías (iconos nav según wireframes)
- Modales Nuevo Proyecto / Nueva Tarea
- Vista Proyectos con tarjetas

### Phase B — Temporizador (US-2)

- `startTimer` / `stopTimer` con auto-switch
- Panel temporizador activo + tick UI
- Tareas recientes + Play
- Tests store/lib temporizador

### Phase C — Entrada manual (US-3)

- Panel Entrada Manual (fecha, proyecto/tarea, duración)
- Factory manual entry con inicio/fin derivados
- Validación duración &gt; 0

### Phase D — Historial y agregaciones (US-4)

- Selector período global
- Historial: tarjetas, tabla, pie
- Totales semanal/mensual + % meta 40h
- Proyectos sincronizados con período
- Tests agregaciones y SC-009/SC-010

## Complexity Tracking

> Sin violaciones de constitución que requieran justificación.

| Violation | Why Needed | Simpler Alternative Rejected Because |
| --------- | ---------- | ------------------------------------ |
| —         | —          | —                                    |

## Generated Artifacts

| Artifact       | Path                                                             |
| -------------- | ---------------------------------------------------------------- |
| Research       | [research.md](./research.md)                                     |
| Data model     | [data-model.md](./data-model.md)                                 |
| Quickstart     | [quickstart.md](./quickstart.md)                                 |
| Route contract | [contracts/routes.md](./contracts/routes.md)                     |
| Store contract | [contracts/store-actions.md](./contracts/store-actions.md)       |
| Storage schema | [contracts/storage-schema.json](./contracts/storage-schema.json) |
| Icons (FR-030) | [research.md](./research.md) § R-011                             |

## Next Step

Ejecutar **`/speckit-tasks`** para generar `tasks.md` con desglose TDD por user story y checkpoints.
