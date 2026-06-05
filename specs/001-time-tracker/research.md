# Research: Time Tracker (001-time-tracker)

**Date**: 2026-06-05  
**Spec**: [spec.md](./spec.md)

## R-001: Persistencia local offline-first

**Decision**: Zustand store único (`useTimeTrackerStore`) con middleware `persist` apuntando a `localStorage`, clave `time-tracker:v1`.

**Rationale**: La spec exige BR-01 (offline-first, solo almacenamiento local). ADR-003 establece Zustand como store estándar. El middleware `persist` serializa estado de dominio + UI global (período seleccionado, temporizador activo) en una sola fuente de verdad.

**Alternatives considered**:

- _IndexedDB_: mayor capacidad pero innecesaria para volumen personal; más complejidad de serialización.
- _localStorage manual sin Zustand_: duplica lógica de hidratación y suscripciones.
- _Backend/API_: fuera de alcance (YAGNI, constitución V).

---

## R-002: Representación de duración y fechas

**Decision**: Almacenar duraciones como **enteros en milisegundos** (`durationMs`). Fechas de registro como **ISO 8601 date** (`YYYY-MM-DD`). Marcas de tiempo (inicio/fin de temporizador y derivadas) como **ISO 8601 datetime** en UTC local del navegador.

**Rationale**: Evita errores de parsing de strings `HH:MM`; simplifica sumas (BR-06), filtros por período y tests. La UI formatea a `HH:MM:SS` o `Xh Ym` con utilidades dedicadas y tipografía monoespaciada (FR-023).

**Alternatives considered**:

- _Guardar solo strings "02:30"_: ambigüedad en sumas y comparaciones.
- _Minutos como float_: riesgo de precisión en intervalos largos.

---

## R-003: Registros manuales — hora inicio/fin derivadas

**Decision**: Para origen `manual`, derivar `startedAt` = medianoche local de la fecha seleccionada (`T00:00:00`) y `endedAt` = `startedAt + durationMs`. Persistir `source: 'manual' | 'timer'` en el registro.

**Rationale**: Cumple BR-05 (fecha, inicio, fin, duración > 0) sin exponer campos al usuario (FR-010, FR-010a). La tabla de Historial no muestra inicio/fin (FR-023).

**Alternatives considered**:

- _Solo fecha + duración sin inicio/fin_: viola BR-05 de integridad de almacenamiento.
- _Pedir inicio/fin al usuario_: contradice clarificación de sesión 2026-06-05.

---

## R-004: Temporizador activo y concurrencia

**Decision**: Estado `activeTimer: { taskId, startedAt } | null` en el store persistido. Al iniciar en otra tarea, ejecutar `stopTimer()` (crear registro) antes de `startTimer()`. Tick de UI con `setInterval` 1 s en Client Component; al detener, `endedAt = new Date()`.

**Rationale**: BR-04 (un solo temporizador). FR-007/FR-008. Persistencia permite restaurar tras recarga (US-2 escenario 4).

**Alternatives considered**:

- _Web Workers para el tick_: over-engineering para una app personal.
- _No persistir temporizador_: rompe US-2 escenario 4.

**Multi-tab**: Escuchar evento `storage` de `localStorage` para reconciliar si otra pestaña modifica el store; última escritura gana (edge case documentado en spec).

---

## R-005: Período global y agregaciones

**Decision**: `selectedPeriod: { year: number; month: number }` (1–12) en store persistido. Selector UI solo en `/historial`; vistas `/proyectos` y resúmenes de Historial leen el mismo slice. Totales en `/` (Tareas) usan **semana/mes calendario actual** independientes del período global (assumption spec).

**Rationale**: FR-029, FR-029a, clarificación Q5. Funciones puras en `lib/aggregations.ts`: `filterByMonth`, `sumDuration`, `countWeekdaysInMonth`, `getWeekBounds` (lunes–domingo ISO local).

**Alternatives considered**:

- _Período duplicado por vista_: riesgo de desincronización (SC-010).
- _URL searchParams para período_: válido pero no requerido; store persistido cubre FR-001.

---

## R-006: Metas semanal y mensual

**Decision**: Constantes `DAILY_GOAL_HOURS = 8`, `WEEKLY_GOAL_MS = 40 * 3600000`. Meta mensual = `countWeekdaysInMonth(year, month) * 8h`. Porcentaje semanal = `Math.round((weeklyTotalMs / WEEKLY_GOAL_MS) * 100)`.

**Rationale**: FR-025–FR-027, SC-009. Sin configuración de usuario en v1.

**Alternatives considered**:

- _Metas configurables_: fuera de alcance (assumption spec).

---

## R-007: Estructura de rutas y RSC

**Decision**: App Router con layout compartido (`src/app/(tracker)/layout.tsx`) — sidebar 280px + área principal. Rutas: `/` (Tareas), `/proyectos`, `/historial`. Páginas como Server Components delgados que componen Client Components de `src/features/time-tracker/`.

**Rationale**: ADR-001, constitución II (lógica fuera de páginas). Wireframes comparten navegación lateral (FR-021).

**Alternatives considered**:

- _SPA single page con estado de vista_: peor deep-linking y no alinea con App Router.
- _Parallel routes_: innecesario para 3 vistas estáticas.

---

## R-008: Sistema de diseño y tipografía

**Decision**: Mapear tokens de `DESIGN.md` a variables CSS en `globals.css` (`@theme` Tailwind v4). Cargar **Inter** y **JetBrains Mono** vía `next/font/google` en layout raíz; reemplazar Geist boilerplate.

**Rationale**: FR-015, ADR-002. Wireframes LB-TT-img-\* como referencia visual en `specs/001-time-tracker/assets/`.

**Alternatives considered**:

- _Mantener Geist_: no cumple DESIGN.md.
- _CSS-in-JS tokens_: contradice ADR-002.

---

## R-009: UI — Base UI + modales

**Decision**: Wrappers en `src/components/ui/` sobre `@base-ui/react` para Dialog (modales Nuevo Proyecto / Nueva Tarea), Select (proyecto/tarea), Button, Input, Textarea. Composición de vistas en `src/features/time-tracker/components/`.

**Rationale**: ADR-006, constitución. Wireframes LB-TT-img-2 y LB-TT-img-4 definen modales.

**Alternatives considered**:

- _Modales custom sin Base UI_: más trabajo de a11y (focus trap, ESC).

---

## R-010: Testing strategy

**Decision**: TDD en `src/features/time-tracker/lib/` y `store/` con Vitest. Object Mothers en `src/features/time-tracker/testing/`. Componentes con lógica (formularios, temporizador) con Testing Library. Cobertura de ramas ≥ 80 % en lib/store antes de merge.

**Rationale**: Constitución III, ADR-005. Escenarios Given/When/Then de spec.md mapean a tests por user story.

**Alternatives considered**:

- _E2E Playwright en v1_: deferido; quickstart cubre validación manual.

---

## R-011: Iconografía — @heroicons/react

**Decision**: Usar `@heroicons/react` como biblioteca única de iconos. En cada ubicación de la UI, importar el componente que mejor coincida visualmente con el wireframe de referencia (variante `outline` o `solid` según corresponda). Centralizar re-exports opcionales en `src/features/time-tracker/components/icons.tsx` para consistencia de tamaño (`className` con tokens de color `on-surface-variant` / `secondary`).

**Rationale**: FR-030 y clarificación de sesión 2026-06-05. Heroicons integra nativamente con React 19 y Tailwind; outline/solid cubren la mayoría de iconos de los wireframes (navegación, play, reloj, flechas de período, plus).

**Alternatives considered**:

- _SVG inline por icono_: duplica mantenimiento y rompe consistencia de trazo.
- _Lucide / Phosphor_: no especificados en spec; cambio innecesario.
- _Emojis o caracteres Unicode_: no alinean con wireframes ni DESIGN.md.

**Guía de selección** (implementación):

| Contexto UI              | Wireframe      | Criterio                                  |
| ------------------------ | -------------- | ----------------------------------------- |
| Nav lateral              | LB-TT-img-1..5 | Icono outline que coincida con wireframe  |
| Play en Tareas Recientes | LB-TT-img-1    | `PlayIcon` o equivalente solid/outline    |
| Selector período ‹ ›     | LB-TT-img-3    | `ChevronLeftIcon` / `ChevronRightIcon`    |
| Temporizador activo      | LB-TT-img-1    | `ClockIcon` o `StopIcon` según wireframe  |
| Nuevo Proyecto / Tarea   | LB-TT-img-4/2  | `PlusIcon` donde el wireframe muestre “+” |

Decorativos: `aria-hidden="true"`. Iconos con significado (p. ej. Play) llevan `aria-label` en el control padre.
