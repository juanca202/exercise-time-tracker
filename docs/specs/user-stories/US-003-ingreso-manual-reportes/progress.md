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
  Estado: Done
  Implementador: "juanca202"
  Archivos:
  - src/features/time-tracking/components/history-view.tsx
  - src/features/time-tracking/components/history-view.test.tsx
  - src/app/history/page.tsx
    Notas:
  - Suite completa (proyecto): 84 tests en verde, 93.47% cobertura de ramas. `npm run build` en verde con las 5 rutas (/, /tasks, /projects, /history, /\_not-found).
  - US-003 (Ingreso Manual de Tiempo y Reportes) queda completamente implementada: TK-001 a TK-003 en Done. Con esto, las 3 historias de usuario derivadas del SRS quedan implementadas.
    Decisiones adicionales:
  - El pie de estadísticas ("N registros"/"N proyectos") se renderiza como un único nodo de texto por interpolación de plantilla (`${count} registros`) en vez de JSX con texto y variable separados, para evitar que quede partido en varios nodos de texto del DOM (dificulta las aserciones de test y lectores de pantalla).
  - Cuando el periodo no tiene Registros de Tiempo, se muestra únicamente el mensaje de estado vacío (sin tarjetas de proyecto, tabla ni pie en 0), evitando un layout vacío confuso.
