# Tasks: Time Tracker

**Input**: Design documents from `/specs/001-time-tracker/`  
**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/, quickstart.md

**Tests**: TDD obligatorio (constitución III, plan.md) — tests co-located `*.test.ts` en `src/features/time-tracker/`.

**Organization**: Tareas agrupadas por user story para entrega incremental independiente.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Paralelizable (archivos distintos, sin dependencias pendientes)
- **[Story]**: US1, US2, US3, US4 según spec.md

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Estructura base, tokens de diseño y utilidades compartidas

- [x] T001 Crear estructura de carpetas `src/features/time-tracker/{components,store,lib,testing}` y `src/components/ui/` según plan.md
- [x] T002 [P] Mapear tokens Precision Focus de `DESIGN.md` a variables `@theme` en `src/app/globals.css`
- [x] T003 [P] Configurar fuentes Inter y JetBrains Mono con `next/font/google` y `lang="es"` en `src/app/layout.tsx`
- [x] T004 [P] Crear helper `cn()` en `src/lib/utils.ts` para composición de clases Tailwind
- [x] T005 [P] Verificar/ajustar `vitest.config.ts` y `vitest.setup.ts` para imports `@/` y jsdom

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Tipos, store base, primitivas UI y shell de navegación — **bloquea todas las user stories**

**⚠️ CRITICAL**: Ninguna user story comienza hasta completar esta fase

- [x] T006 [P] Definir tipos de dominio (`Project`, `Task`, `TimeEntry`, `ActiveTimer`, `SelectedPeriod`) en `src/features/time-tracker/lib/types.ts`
- [x] T007 [P] Implementar utilidades `parseDuration`/`formatDuration`/`formatDurationHms` en `src/features/time-tracker/lib/duration.ts`
- [x] T008 [P] Crear Object Mothers en `src/features/time-tracker/testing/object-mothers.ts` (proyecto, tarea, registro, store vacío)
- [x] T009 [P] Implementar wrapper `Button` en `src/components/ui/button.tsx` con variantes primary/secondary según DESIGN.md
- [x] T010 [P] Implementar wrapper `Input` en `src/components/ui/input.tsx`
- [x] T011 [P] Implementar wrapper `Textarea` en `src/components/ui/textarea.tsx`
- [x] T012 [P] Implementar wrapper `Dialog` (modal) en `src/components/ui/dialog.tsx` con Base UI
- [x] T013 [P] Implementar wrapper `Select` en `src/components/ui/select.tsx` con Base UI
- [x] T014 Implementar store Zustand con middleware `persist` (clave `time-tracker:v1`) y estado inicial en `src/features/time-tracker/store/time-tracker-store.ts`
- [x] T015 Implementar `Sidebar` con navegación Tareas/Proyectos/Historial en `src/features/time-tracker/components/sidebar.tsx` (FR-021, wireframe)
- [x] T016 Crear layout tracker con sidebar 280px en `src/app/(tracker)/layout.tsx`
- [x] T017 [P] Crear páginas delgadas `src/app/(tracker)/page.tsx`, `proyectos/page.tsx`, `historial/page.tsx` que componen Client Components

**Checkpoint**: Foundation ready — user story implementation can now begin

---

## Phase 3: User Story 1 - Gestión de Proyectos y Tareas (Priority: P1) 🎯 MVP

**Goal**: Crear proyectos y tareas asociadas con persistencia local y vista Proyectos

**Independent Test**: Crear proyecto con nombre/descripción, crear tarea vinculada, recargar → datos persisten (US-1, SC-006)

### Tests for User Story 1 ⚠️

> **NOTE: Escribir tests primero; deben FALLAR antes de la implementación**

- [x] T018 [P] [US1] Test RED: `createProject` valida nombre obligatorio en `src/features/time-tracker/store/time-tracker-store.test.ts`
- [x] T019 [P] [US1] Test RED: `createTask` requiere proyecto existente y nombre en `src/features/time-tracker/store/time-tracker-store.test.ts`

### Implementation for User Story 1

- [x] T020 [US1] Implementar acciones `createProject`, `createTask`, `openModal`, `closeModal` en `src/features/time-tracker/store/time-tracker-store.ts` (GREEN T018–T019)
- [x] T021 [P] [US1] Implementar `NewProjectModal` (nombre obligatorio, descripción opcional) en `src/features/time-tracker/components/new-project-modal.tsx` (LB-TT-img-4)
- [x] T022 [P] [US1] Implementar `NewTaskModal` (select proyecto + nombre) en `src/features/time-tracker/components/new-task-modal.tsx` (LB-TT-img-2)
- [x] T023 [P] [US1] Implementar `ProjectCard` con nombre, descripción y placeholder TIEMPO REGISTRADO en `src/features/time-tracker/components/project-card.tsx`
- [x] T024 [US1] Implementar `ProjectsPage` con botón Nuevo Proyecto, grid de tarjetas y tarjeta punteada Crear Nuevo Proyecto en `src/features/time-tracker/components/projects-page.tsx` (LB-TT-img-5)
- [x] T025 [US1] Conectar `src/app/(tracker)/proyectos/page.tsx` a `ProjectsPage` y validar persistencia tras reload

**Checkpoint**: US1 funcional — proyectos y tareas creables y visibles en Proyectos

---

## Phase 4: User Story 2 - Temporizador de Tiempo (Priority: P2)

**Goal**: Iniciar/detener temporizador con auto-switch, panel activo y tareas recientes con Play

**Independent Test**: Iniciar timer, esperar, detener → registro con duración > 0; iniciar en otra tarea detiene la anterior (US-2, SC-002, SC-004)

### Tests for User Story 2 ⚠️

- [x] T026 [P] [US2] Test RED: `startTimer`/`stopTimer` crea `TimeEntry` source=timer con duración > 0 en `src/features/time-tracker/store/time-tracker-store.test.ts`
- [x] T027 [P] [US2] Test RED: iniciar timer en tarea B detiene automáticamente timer en tarea A en `src/features/time-tracker/store/time-tracker-store.test.ts`
- [x] T028 [P] [US2] Test RED: rechazar intervalo ≤ 0 (`INTERVAL_TOO_SHORT`) en `src/features/time-tracker/lib/time-entry-factory.test.ts`

### Implementation for User Story 2

- [x] T029 [US2] Implementar `createTimerEntry` en `src/features/time-tracker/lib/time-entry-factory.ts` (GREEN T028)
- [x] T030 [US2] Implementar `startTimer`, `stopTimer`, `getElapsedMs` en `src/features/time-tracker/store/time-tracker-store.ts` (GREEN T026–T027)
- [x] T031 [P] [US2] Implementar `ActiveTimerPanel` (contexto proyecto/tarea, hora inicio, display time, Detener Sesión) en `src/features/time-tracker/components/active-timer-panel.tsx` (LB-TT-img-1)
- [x] T032 [P] [US2] Implementar hook `useTimerTick` (intervalo 1s) en `src/features/time-tracker/lib/use-timer-tick.ts`
- [x] T033 [P] [US2] Implementar `RecentTasksList` con Play, duración y tiempo relativo en `src/features/time-tracker/components/recent-tasks-list.tsx` (FR-016a–c)
- [x] T034 [US2] Implementar `TasksPage` shell con botón Nueva Tarea y áreas para timer/recientes en `src/features/time-tracker/components/tasks-page.tsx`
- [x] T035 [US2] Conectar `src/app/(tracker)/page.tsx` a `TasksPage`; verificar restauración de timer tras reload (US-2 escenario 4)

**Checkpoint**: US1 + US2 — temporizador operativo con persistencia

---

## Phase 5: User Story 3 - Registro Manual de Tiempo (Priority: P3)

**Goal**: Entrada manual con fecha, proyecto/tarea y duración (sin hora inicio/fin del usuario)

**Independent Test**: Guardar registro manual desde panel Entrada Manual → aparece en store con duración correcta (US-3)

### Tests for User Story 3 ⚠️

- [x] T036 [P] [US3] Test RED: `createManualEntry` deriva startedAt/endedAt y rechaza duración ≤ 0 en `src/features/time-tracker/lib/time-entry-factory.test.ts`
- [x] T037 [P] [US3] Test RED: `createManualEntry` en store persiste entry source=manual en `src/features/time-tracker/store/time-tracker-store.test.ts`

### Implementation for User Story 3

- [x] T038 [US3] Implementar `createManualEntry` factory (medianoche + duración) en `src/features/time-tracker/lib/time-entry-factory.ts` (GREEN T036)
- [x] T039 [US3] Implementar acción `createManualEntry` en `src/features/time-tracker/store/time-tracker-store.ts` (GREEN T037)
- [x] T040 [US3] Implementar `ManualEntryPanel` (Fecha, Proyecto/Tarea, Duración, Guardar Registro) en `src/features/time-tracker/components/manual-entry-panel.tsx` (LB-TT-img-1)
- [x] T041 [US3] Integrar `ManualEntryPanel` en `src/features/time-tracker/components/tasks-page.tsx`

**Checkpoint**: US1–US3 — registro manual y temporizador coexisten

---

## Phase 6: User Story 4 - Visualización de Totales e Historial (Priority: P4)

**Goal**: Historial por período, totales en Proyectos sincronizados, metas semanal/mensual en Tareas

**Independent Test**: Cambiar período en Historial → tabla y totales en Proyectos coinciden; % meta semanal correcto (US-4, SC-009, SC-010)

### Tests for User Story 4 ⚠️

- [x] T042 [P] [US4] Test RED: `filterByMonth`, `sumDuration`, `countWeekdaysInMonth` en `src/features/time-tracker/lib/aggregations.test.ts`
- [x] T043 [P] [US4] Test RED: `getWeeklyGoalPercent` (34h → 85%) y meta 40h en `src/features/time-tracker/lib/aggregations.test.ts`
- [x] T044 [P] [US4] Test RED: `getProjectTotalMs` respeta `selectedPeriod` en `src/features/time-tracker/store/time-tracker-store.test.ts`
- [x] T045 [P] [US4] Test RED: `getRecentTasks(5)` orden por último registro en `src/features/time-tracker/store/time-tracker-store.test.ts`

### Implementation for User Story 4

- [x] T046 [US4] Implementar agregaciones y metas en `src/features/time-tracker/lib/aggregations.ts` (GREEN T042–T043)
- [x] T047 [US4] Implementar selectores `getWeeklyTotalMs`, `getMonthlyTotalMs`, `getWeeklyGoalPercent`, `getProjectTotalMs`, `getRecentTasks`, `getHistoryRows`, `getHistorySummary`, `getProjectSummaries` en `src/features/time-tracker/store/time-tracker-store.ts` (GREEN T044–T045)
- [x] T048 [US4] Implementar `setSelectedPeriod` y `shiftPeriod` en `src/features/time-tracker/store/time-tracker-store.ts` (FR-029)
- [x] T049 [P] [US4] Implementar `PeriodSelector` en `src/features/time-tracker/components/period-selector.tsx` (LB-TT-img-3)
- [x] T050 [P] [US4] Implementar `HistoryPage` (tarjetas resumen, tabla Fecha/Proyecto/Tarea/Duración, pie) en `src/features/time-tracker/components/history-page.tsx` (LB-TT-img-3)
- [x] T051 [US4] Actualizar `ProjectCard`/`ProjectsPage` para mostrar TIEMPO REGISTRADO del período seleccionado en `src/features/time-tracker/components/project-card.tsx`
- [x] T052 [US4] Añadir tarjetas TOTAL SEMANAL, TOTAL MENSUAL y mensaje % meta semanal en `src/features/time-tracker/components/tasks-page.tsx` (LB-TT-img-1, FR-025–027)
- [x] T053 [US4] Conectar `src/app/(tracker)/historial/page.tsx` a `HistoryPage`; enlace Ver Historial en `recent-tasks-list.tsx`
- [x] T054 [US4] Actualizar metadata (title/description) en layouts y páginas tracker a español en `src/app/layout.tsx` y `src/app/(tracker)/layout.tsx`

**Checkpoint**: US1–US4 completas — flujo end-to-end según quickstart.md

---

## Phase 7: Polish & Cross-Cutting Concerns

**Purpose**: Calidad, a11y, responsive y validación final

- [x] T055 [P] Añadir estilos estado activo temporizador (borde verde secundario) en `src/features/time-tracker/components/active-timer-panel.tsx` (FR-022)
- [x] T056 [P] Aplicar tipografía monoespaciada a duraciones en listas e historial (FR-023)
- [x] T057 Implementar listener `storage` para reconciliación multi-pestaña en `src/features/time-tracker/store/time-tracker-store.ts`
- [x] T058 [P] Ajustar responsive sidebar (&lt;768px) en `src/features/time-tracker/components/sidebar.tsx` y `(tracker)/layout.tsx` (DESIGN.md)
- [x] T059 Ejecutar validación manual de `specs/001-time-tracker/quickstart.md` (US-1 a US-4)
- [x] T060 Ejecutar gate: `npm run test:run`, `npm run lint`, `npm run build`

---

## Phase 8: Iconografía @heroicons/react (FR-030)

**Purpose**: Sustituir iconos ad hoc por `@heroicons/react` alineados a wireframes (clarificación 2026-06-05, R-011)

**Prerequisite**: Phase 7 completa; dependencia aún no instalada en `package.json`

- [x] T061 Instalar `@heroicons/react` en `package.json` y verificar build
- [x] T062 [P] Crear módulo de re-exports con tamaños/tokens en `src/features/time-tracker/components/icons.tsx` (R-011)
- [x] T063 [P] Integrar iconos Heroicons en navegación lateral en `src/features/time-tracker/components/sidebar.tsx` (LB-TT-img-1..5, FR-021)
- [x] T064 [P] Integrar iconos Heroicons en `src/features/time-tracker/components/period-selector.tsx`, `recent-tasks-list.tsx` y `active-timer-panel.tsx` (Play, chevrons, reloj/stop)
- [x] T065 [P] Integrar iconos Heroicons en `new-project-modal.tsx`, `new-task-modal.tsx`, `projects-page.tsx` y `tasks-page.tsx` donde wireframes muestren iconografía
- [x] T066 Validar alineación visual de iconos vs wireframes `specs/001-time-tracker/assets/LB-TT-img-*.png` (SC-008, quickstart.md)

**Checkpoint**: Iconografía unificada con Heroicons; decorativos con `aria-hidden`, controles con `aria-label`

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: Sin dependencias — inicio inmediato
- **Foundational (Phase 2)**: Depende de Phase 1 — **bloquea** todas las user stories
- **US1 (Phase 3)**: Depende de Phase 2
- **US2 (Phase 4)**: Depende de Phase 2 + US1 (necesita tareas existentes)
- **US3 (Phase 5)**: Depende de Phase 2 + US1
- **US4 (Phase 6)**: Depende de Phase 2 + US1; datos de US2/US3 enriquecen pruebas pero store/aggregations son testeables con Object Mothers
- **Polish (Phase 7)**: Depende de US1–US4
- **Iconografía (Phase 8)**: Depende de Phase 7 (o US1–US4 si Phase 7 ya completada)

### User Story Dependencies

| Story  | Depende de                        | Independiente para test                  |
| ------ | --------------------------------- | ---------------------------------------- |
| US1 P1 | Foundation                        | ✅ Crear proyecto/tarea + persistencia   |
| US2 P2 | US1 (tareas)                      | ✅ Timer start/stop/auto-switch          |
| US3 P3 | US1 (tareas)                      | ✅ Entrada manual                        |
| US4 P4 | US1; mejora con registros US2/US3 | ✅ Filtros y totales con datos de prueba |

### Within Each User Story

1. Tests RED primero
2. lib/ factory o aggregations
3. store actions/selectors GREEN
4. componentes UI
5. integración en página
6. checkpoint

### Parallel Opportunities

- Phase 1: T002, T003, T004, T005 en paralelo
- Phase 2: T006–T013 y T017 en paralelo; luego T014→T016 secuencial
- US1: T018–T019 paralelo; T021–T023 paralelo tras T020
- US2: T026–T028 paralelo; T031–T033 paralelo tras T030
- US3: T036–T037 paralelo
- US4: T042–T045 paralelo; T049–T050 paralelo tras T048
- Polish: T055, T056, T058 en paralelo
- Phase 8: T062–T065 en paralelo tras T061

---

## Parallel Example: User Story 1

```bash
# Tests RED en paralelo:
T018: store test createProject validation
T019: store test createTask validation

# UI en paralelo tras T020:
T021: new-project-modal.tsx
T022: new-task-modal.tsx
T023: project-card.tsx
```

---

## Parallel Example: Phase 8 (Iconografía)

```bash
# Tras T061 (install):
T062: icons.tsx re-exports
T063: sidebar.tsx nav icons
T064: period-selector + recent-tasks + active-timer
T065: modales + pages iconografía
# Luego T066 validación visual
```

---

## Parallel Example: User Story 4

```bash
# Tests RED en paralelo:
T042: aggregations.test.ts filters
T043: aggregations.test.ts weekly goal
T044: store project total by period
T045: store recent tasks

# UI en paralelo tras T048:
T049: period-selector.tsx
T050: history-page.tsx
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. **STOP and VALIDATE**: quickstart US-1
5. Demo: proyectos y tareas persistidos

### Incremental Delivery

1. Setup + Foundational → base lista
2. US1 → MVP (proyectos/tareas)
3. US2 → temporizador
4. US3 → entrada manual
5. US4 → historial y metas
6. Polish → gate pre-merge
7. Phase 8 → iconografía Heroicons (FR-030)

### Suggested MVP Scope

**User Story 1 (P1)** tras Phase 1–2: crear proyecto, crear tarea, vista Proyectos con persistencia.

---

## Notes

- Tareas con [P] = archivos distintos, sin conflicto
- Cada checkpoint valida la story de forma independiente
- Wireframes en `specs/001-time-tracker/assets/LB-TT-img-*.png`
- Iconos: `@heroicons/react` — outline/solid según wireframe más cercano (FR-030, R-011)
- Cobertura ≥ 80 % ramas en `lib/` y `store/` antes de merge (constitución III)
- T001–T066 completadas (Phase 8 iconografía Heroicons integrada)
