# Progreso

## Trabajo: US-003-ingreso-manual-reportes

- Tipo: historia de usuario
- Última actualización: 2026-07-03

### Unidades

- TK-001 Cálculos de agregación y utilidades de periodo
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/lib/totals.ts
  - src/features/time-tracking/lib/totals.test.ts
  - src/features/time-tracking/lib/period.ts
  - src/features/time-tracking/lib/period.test.ts
    Notas:
  - 20 tests en verde en `totals.test.ts` + `period.test.ts`.
    Decisiones adicionales:
  - `addMonths` se implementó con aritmética de meses en base 0 (`year*12 + month`) para simplificar el manejo de bordes de año en ambas direcciones, en vez de una serie de `if` por caso.

- TK-002 Panel "Entrada Manual" y lista "Tareas Recientes"
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/lib/duration-input.ts
  - src/features/time-tracking/lib/duration-input.test.ts
  - src/features/time-tracking/lib/duration.ts (+ formatRelativeTime)
  - src/features/time-tracking/lib/duration.test.ts
  - src/features/time-tracking/store/time-tracking-store.ts (+ createManualTimeEntry)
  - src/features/time-tracking/store/manual-entry.test.ts
  - src/features/time-tracking/components/manual-entry-panel.tsx
  - src/features/time-tracking/components/manual-entry-panel.test.tsx
  - src/features/time-tracking/components/recent-entries-list.tsx
  - src/features/time-tracking/components/recent-entries-list.test.tsx
  - src/app/tasks/page.tsx
    Notas:
  - `npm run build` en verde.
    Decisiones adicionales:
  - Se añadió `formatRelativeTime(isoDate)` a `duration.ts` (en vez de un archivo nuevo) para el "tiempo relativo" de `RecentEntriesList`, reutilizando el mismo módulo del `formatDuration` HH:MM:SS ya introducido en US-002.
  - `RecentEntriesList` no se renderiza (retorna `null`) cuando no hay ningún `TimeEntry`, evitando un encabezado "Tareas Recientes" vacío.

- TK-003 Vista "Historial de Registros"
  Estado: Pending
  Implementador: "juanca202"
  Archivos: []
  Notas: []
  Decisiones adicionales: []
