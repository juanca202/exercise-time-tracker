## 1. Selectores de agregación

- [x] 1.1 Crear carpeta `src/features/time-history/` (ADR-005) con la estructura interna estándar (`selectors/`, `components/`)
- [x] 1.2 Implementar `selectEntriesInMonth(year, month)`: filtra los Registros de Tiempo (leídos del store de `tasks`) cuya fecha cae dentro del mes dado
- [x] 1.3 Implementar `selectTaskRowsForMonth(year, month)`: a partir de `selectEntriesInMonth`, agrupar por `taskId` y derivar una fila por Tarea con actividad en el periodo — `{ taskId, taskName, projectName, totalMs, lastActivityIso }` —, ordenadas por `lastActivityIso` descendente (AC-002, decisión de agrupar por Tarea tras revisión Figma)
- [x] 1.4 Implementar `selectProjectTotalInMonth(projectId, year, month)`: suma las duraciones de las Tareas del Proyecto dentro del mes dado (0 si no hay coincidencias)
- [x] 1.5 Implementar `selectMonthSummary(year, month)`: a partir de `selectEntriesInMonth`, calcular en un solo recorrido cantidad de registros, cantidad de proyectos únicos (`Set` de `projectId`) y total de horas

## 2. Estado de navegación de periodo

- [x] 2.1 Implementar el estado local `selectedMonth` en el componente de la pantalla, inicializado en el mes calendario actual
- [x] 2.2 Implementar las acciones "mes anterior" / "mes siguiente" que actualizan `selectedMonth` y disparan el recálculo de los selectores del periodo

## 3. UI — Listado de Tareas del periodo

- [x] 3.1 Construir la pantalla "Historial de registros" (App Router, componente cliente) que lea `selectTaskRowsForMonth` y `selectedMonth`
- [x] 3.2 Construir la fila de Tarea (Fecha de última actividad, Proyecto, Tarea, Duración acumulada del periodo) con Tailwind (ADR-002), conforme al prototipo Figma
- [x] 3.3 Renderizar el estado vacío cuando no existan Tareas con actividad en el periodo, sin errores
- [x] 3.4 (no planificada) Ruta `/history` + activar el ítem "Historial de registros" del `AppShell` y el link "Ver Historial" de `TasksScreen` (antes placeholders no interactivos)

## 4. UI — Totales y resumen

- [x] 4.1 (fusionada con 3.2 — la Duración de cada fila ya es el total acumulado de esa Tarea en el periodo)
- [x] 4.2 Mostrar el total acumulado por Proyecto para el periodo seleccionado, en tarjetas con acento de color vía `colorFromString` (consistente con `manage-projects`/`track-task-time`)
- [x] 4.3 Construir el bloque de resumen del periodo (registros, proyectos involucrados, total de horas) usando `selectMonthSummary`
- [x] 4.4 Construir los controles de navegación "mes anterior" / "mes siguiente" conectados a las acciones de la sección 2

## 5. Pruebas

- [x] 5.1 Pruebas unitarias (Vitest + Testing Library, ADR-007) de los selectores: filas de Tarea por periodo, total por Proyecto en un periodo, y resumen del periodo, incluyendo los casos límite en cero
- [x] 5.2 Pruebas unitarias de `selectEntriesInMonth`/`selectTaskRowsForMonth` con fechas fijas construidas en el test (sin depender del reloj real), evitando flakiness en los bordes de mes
- [x] 5.3 Prueba de rendimiento: agregaciones sobre un dataset de 1000 Registros de Tiempo generados por fixture, verificando el umbral de <2s (RP-003)
- [x] 5.4 Prueba e2e (Playwright, ADR-008) del flujo happy path: historial con registros existentes, mostrando filas de Tarea, tarjetas por Proyecto y resumen correctos
- [x] 5.5 Prueba e2e del estado vacío (sin registros) y de la navegación a un mes sin registros
- [x] 5.6 Prueba e2e de la navegación entre mes anterior y mes siguiente, fijando el reloj del navegador (Playwright Clock) para reproducibilidad determinista
- [x] 5.7 Documentar los selectores públicos con TSDoc (ADR-006)
