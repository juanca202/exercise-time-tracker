# Code Review — US-30274-historial-de-registros

Fecha: 2026-07-10 03:41
Repositorio: exercise-time-tracker
Rama: loop/open-spec · Commit: db0859a (working tree con cambios sin commitear)
Working tree: sucio (implementación de este change aún no commiteada)
Modo: default
Historia: US-30274-historial-de-registros (change OpenSpec `historial-de-registros`, capability `time-history`)
Veredicto: ✅ Apto

## Resumen

Se revisó `time-history`: filtrado por periodo, la función de agregación única memoizada (totales por Tarea/Proyecto/mes + resumen), navegación entre meses y el listado de Registros. Todas las verificaciones automatizadas pasan. La revisión cualitativa no encontró hallazgos bloqueantes; se reconsidera y cierra la observación de acoplamiento cruzado señalada en el change anterior, dado que `time-history` es, por diseño, un lector de solo lectura de ambos stores (no agrega un nuevo ciclo de dependencias).

## 1. Verificaciones automatizadas

Símbolos de estado: `✅` PASS · `❌` FAIL · `⏭️` SKIPPED · `—` N/A · `ℹ️` informativo (Sonar).

| #   | Check      | Comando                      | Categoría   | Estado | Detalle                                                                                                                                                                                                                          | Duración |
| --- | ---------- | ---------------------------- | ----------- | ------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- |
| 1   | tipado     | `npx tsc --noEmit`           | Bloqueante  | ✅     | 0 errores                                                                                                                                                                                                                        | ~1.5s    |
| 2   | linter     | `npm run lint` (eslint)      | Bloqueante  | ✅     | 0 errors, 0 warnings                                                                                                                                                                                                             | ~1s      |
| 3   | unit tests | `npm run test:run` (vitest)  | Bloqueante  | ✅     | 80 passed, 0 failed (13 archivos)                                                                                                                                                                                                | ~2.2s    |
| 4   | coverage   | `npm run test:coverage`      | Bloqueante  | ✅     | Stmts 100% · Branches 88.5% · Funcs 100% · Lines 100% (umbral 80% en las 4 métricas)                                                                                                                                             | ~2.2s    |
| 5   | build      | `npm run build` (next build) | Bloqueante  | ✅     | Compilado y prerenderizado OK (`/`)                                                                                                                                                                                              | ~1.9s    |
| 6   | e2e        | `npx playwright test`        | Condicional | —      | N/A: sigue sin haber specs en `e2e/`; fuera del alcance de tasks.md. Verificado manualmente el flujo completo en navegador real (crear Proyecto → Tarea → registro manual → pestaña Historial → recarga) sin errores de consola. | —        |
| 7   | sonar      | —                            | Informativo | —      | N/A (sin `sonar-project.properties`)                                                                                                                                                                                             | —        |

### Detalle de checks fallidos

Sin checks fallidos.

## 2. Revisión cualitativa

Símbolos de severidad: `🔴` Crítico · `🟠` Mayor · `🟡` Menor · `💡` Sugerencia · `✅` dimensión conforme.

**Intención detectada:** implementar US-30274 (AC-001 a AC-007): lectura y listado del historial completo de Registros de Tiempo, totales acumulados por Tarea (todas, incluidas sin actividad), por Proyecto dentro del periodo (incluidos sin actividad en el periodo), por mes con navegación anterior/siguiente, listado con Fecha/Proyecto/Tarea/Duración, resumen del periodo (registros, proyectos involucrados, horas totales), y presupuesto de rendimiento (<2s hasta 1000 Registros).

### Análisis semántico

✅ conforme. Los siete AC quedan cubiertos exactamente según lo especificado en `design.md`: una única función de agregación (`aggregateTimeHistory`) que hace una sola pasada sobre los Registros ya filtrados por periodo, de la que se derivan los totales por Tarea/Proyecto/mes y el resumen — evitando triplicar el recorrido de la colección. El "resumen" cuenta proyectos involucrados vía `Set` (solo los que tienen actividad en el periodo), mientras que los totales por Tarea/Proyecto listan **todas** las Tareas/Proyectos existentes con 0 cuando no tienen actividad — distinción correcta y explícitamente distinta entre ambos conceptos, tal como piden AC-002/AC-003 vs. AC-006.

- 💡 El requirement de "Total de tiempo acumulado por Tarea" en `spec.md` no menciona explícitamente "dentro del periodo seleccionado" (a diferencia del de Proyecto, que sí lo dice), pero `design.md` fija que el filtrado por periodo ocurre "antes de cualquier cálculo de totales" para las tres vistas. La implementación siguió `design.md` (totales por Tarea también acotados al periodo seleccionado). **Por qué:** es una ambigüedad menor entre `spec.md` y `design.md`, no un desajuste de implementación — se siguió la fuente de mayor especificidad técnica. **Impacto:** ninguno, ambas lecturas son razonables y la elegida es internamente consistente (una sola pasada de agregación sobre el periodo). **Sugerencia:** si en el futuro se quiere un total histórico de Tarea sin filtro de periodo (análogo al de Proyecto en `project-management`, que sí es explícitamente sin filtro de fecha), documentarlo como una capability o AC separado para evitar la ambigüedad.

### Arquitectura y diseño

- ✅ [ISO-25010: Mantenibilidad] `time-history` no introduce un store propio, tal como exige `design.md` ("no introduce un nuevo store de Zustand con persist"): solo mantiene el estado de UI local del periodo seleccionado (`useState` dentro de `useTimeHistory`) y lee `useProjectStore`/`useTaskTimeTrackingStore` directamente. Esto **no** repite el patrón de acoplamiento bidireccional señalado en el code review de `gestion-de-tareas`: ahí el problema era que dos features **pares** (`project-management` y `task-time-tracking`) se importaban mutuamente. Aquí `time-history` es, por diseño, el lector de nivel superior de ambos — una dependencia unidireccional hacia dos features base, exactamente el rol que su propio `design.md` le asigna. No cierra ni empeora la observación anterior (que sigue viva entre `project-management`↔`task-time-tracking`), pero tampoco la agrava.
- ✅ [ISO-25010: Mantenibilidad] Memoización correcta: `entriesInPeriod` se memoiza por `[timeEntries, period]` y la agregación por `[entriesInPeriod, tasks, projects]`, exactamente la combinación que pide `design.md` ("por combinación de periodo seleccionado, Registros de Tiempo, Proyectos"). Los totales por Tarea/Proyecto se construyen iterando `tasks`/`projects` (arreglos pequeños), no la colección completa de Registros por segunda o tercera vez — cumple el objetivo de rendimiento sin necesidad de estructuras adicionales.
- 🟡 [ISO-25010: Mantenibilidad] `HistoryPage` concentra navegación de periodo, resumen, dos bloques de totales y la tabla de Registros en un único componente (~110 líneas). **Por qué:** aunque hoy es legible y cada bloque está claramente delimitado, si el listado crece (paginación, ordenamiento, filtros adicionales) el componente empezará a acumular responsabilidades no relacionadas. **Impacto:** bajo hoy; podría encarecer cambios futuros si la pantalla gana funcionalidad. **Sugerencia concreta:** extraer `PeriodNavigation`, `PeriodSummary` y `HistoryEntriesTable` como subcomponentes de presentación (reciben props, sin lógica propia) cuando se necesite tocar alguno de esos bloques de nuevo — no urge hacerlo solo por este change.
- ✅ conforme en el resto: TSDoc presente en `aggregateTimeHistory` (lógica no trivial) y omitido en tipos/componentes triviales, conforme ADR-006; `formatDate` se ubicó correctamente en `src/shared/lib/` al ser reutilizable (ya se usa desde `time-history` y sigue el mismo criterio que `format-duration.ts`).

### Feedback adicional

Buen manejo de los casos borde de navegación de periodo (cambio de año en diciembre/enero, cubierto por test) y de la distinción semántica entre "totales por entidad" (siempre completos, con ceros) vs. "resumen del periodo" (solo entidades con actividad) — es fácil confundir ambos conceptos y el código los mantiene claramente separados con nombres explícitos (`totalsByProject` vs. `summary.projectCount`). La prueba de rendimiento con 1000 Registros distribuidos en 6 meses distintos ejercita realmente el filtrado sobre el volumen completo (no solo el subconjunto renderizado), consistente con la redacción de AC-007 ("lee los 1000 Registros... calcula los totales").

## Próximas acciones

Sin acciones pendientes.

## Justificaciones aceptadas

Ninguna.
