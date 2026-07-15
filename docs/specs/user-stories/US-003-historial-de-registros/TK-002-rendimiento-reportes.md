# TK-002: Rendimiento de los reportes de tiempo

**Estado**: Ready
**Historia**: [US-003](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Memoizar la lectura y el cálculo de los reportes del historial (filas enriquecidas del historial y totales por Tarea, por Proyecto y por mes) para que su renderizado en pantalla, incluyendo el peor caso de 1000 Registros de Tiempo, se complete en menos de 2 segundos, evitando recalcular sobre cada render mientras los datos crudos del store no cambien.

## Dependencias

- [TK-001: Lectura del historial y presentación de totales por Tarea, Proyecto y mes](TK-001-lectura-historial-y-calculo-de-totales.md) — memoiza el resultado de `buildHistoryRows` dentro de `useHistory`.
- [US-000 TK-001: Dominio, persistencia local, store raíz y helper de fecha compartidos](../US-000-fundamentos/TK-001-dominio-persistencia-store-y-fecha.md) — `calculateTotalByTask`, `calculateTotalByProject` y `calculateTotalByMonth` (`src/shared/reports/`), memoizadas aquí; los selectores `useProjects`, `useTasks`, `useTimeEntries` deben devolver referencias estables entre renders mientras los arreglos subyacentes no cambien; esa estabilidad es la condición que habilita usarlos como dependencias de `useMemo`.
- React (`useMemo`) — mecanismo de memoización, sin dependencias nuevas.

## Referencias

- **Investigación:** [RS-002: Viabilidad técnica de localStorage vs. IndexedDB](./research/RS-002-persistencia-local-localstorage-vs-indexeddb.md) — confirma que el costo de lectura/parseo/agregación en memoria para 1000 Registros es del orden de milisegundos, por lo que el riesgo real para AC-005 no es el almacenamiento sino evitar recomputar los reportes en cada render.
- **Arquitectura:** [ADR-004: Uso de Zustand para manejo de estado](../../../adr/ADR-004-uso-de-zustand.md) (estabilidad referencial de los selectores), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md), [ADR-008: Uso de Playwright para las pruebas E2E](../../../adr/ADR-008-uso-de-playwright-para-e2e.md) (medición de performance, TC-013/TC-014).

## Archivos afectados

```text
exercise-time-tracker/
├── e2e/
│   └── + us-003-history-performance.spec.ts   # TC-013 (500 registros), TC-014 (1000 registros)
└── src/
    └── features/
        └── historial/
            └── hooks/
                ├── ~ use-history.ts               # agrega useMemo sobre buildHistoryRows (TK-001)
                ├── ~ use-history.test.ts           # agrega caso: no recalcula si las referencias no cambian
                ├── + use-history-reports.ts       # useHistoryReports(): memoiza calculateTotalByTask/Project/Month (US-000 TK-001)
                └── + use-history-reports.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Envolver la llamada a `buildHistoryRows(projects, tasks, entries)` dentro de `useHistory` (TK-001) en `useMemo`, usando `[projects, tasks, entries]` (las referencias devueltas por los selectores del store, US-000 TK-001) como arreglo de dependencias, de modo que el join y la validación solo se recalculen cuando cambie alguna de esas tres colecciones.
- [ ] **IT-02** — Implementar `useHistoryReports()` en `use-history-reports.ts`: gatea con `useHasHydrated()` (igual que TK-001), lee `useProjects`, `useTasks`, `useTimeEntries` y devuelve `{ taskTotals, projectTotals, monthTotals }`, cada uno calculado con un `useMemo` independiente sobre `calculateTotalByTask`/`calculateTotalByProject`/`calculateTotalByMonth` (US-000 TK-001), de modo que el cambio de una sola colección no fuerce el recálculo de los tres reportes.
- [ ] **IT-03** — Verificar que ninguna función de `calculate-totals.ts` (`src/shared/reports/`, US-000 TK-001) ni de `build-history-rows.ts` (TK-001) realice búsquedas anidadas O(n×m): confirmar que ambas usan `indexById` (Map, O(1) por lookup) en vez de `Array.find`/`Array.filter` anidado, de modo que el costo total sea O(n) sobre el volumen combinado de Registros, Tareas y Proyectos — relevante recién a partir de los 1000 registros de TC-014.
- [ ] **IT-04** — Cubrir con pruebas Vitest (ADR-007) `use-history.test.ts` y `use-history-reports.test.ts`: renderizar cada hook dos veces con las mismas referencias de entrada (mock de los selectores del store) y verificar, mediante un espía (`vi.fn`/`vi.spyOn`) sobre `buildHistoryRows` y sobre `calculateTotalByTask`/`calculateTotalByProject`/`calculateTotalByMonth`, que la segunda renderización no vuelve a invocarlos.
- [ ] **IT-05** — Escribir `e2e/us-003-history-performance.spec.ts` (Playwright, ADR-008): sembrar 500 Registros de Tiempo sintéticos (TC-013, distribuidos entre >=5 Proyectos, >=15 Tareas y >=6 meses) y, en un segundo test, exactamente 1000 (TC-014); medir el tiempo entre la navegación a `/historial` y que la tabla y los reportes por Tarea/Proyecto/mes estén visibles/interactivos, verificando que sea menor a 2000 ms en ambos casos.
- [ ] **IT-06** — Si la medición de IT-05 no cumple el umbral de 2 segundos en el entorno de referencia, documentar el hallazgo como pendiente técnico y evaluar, como paso posterior fuera de este TK (registrado como nuevo TK o ADR si corresponde), una estrategia de virtualización de filas para `HistoryTable`; no se introduce de forma preventiva ninguna librería de virtualización porque ningún ADR vigente la contempla y, según RS-002, el volumen esperado (≤1000 filas) no la justifica de antemano.

## Observaciones

- La virtualización de `HistoryTable` (IT-06) es una mitigación condicional, no una tarea obligatoria de este TK: solo se activa si la medición E2E (IT-05) muestra que se incumple AC-005 en la práctica; a la fecha de esta planificación no hay evidencia de que el volumen de 1000 filas la requiera.
