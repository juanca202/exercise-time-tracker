## 1. Fundamentos

- [ ] 1.1 Scaffolding de `src/features/history` según ADR-005 (si no está ya presente desde `fundamentos`).

## 2. Totales y selectores

- [ ] 2.1 Implementar el selector de total por Tarea en `src/features/history` (suma de Duraciones agrupadas por TaskId), leyendo desde `listTimeRecords` crudo de `fundamentos`.
- [ ] 2.2 Implementar el selector de total por Proyecto (suma de los totales de las Tareas de cada Proyecto), leyendo desde `listProjects`/`listTasks` crudos de `fundamentos`.
- [ ] 2.3 Implementar el selector de total por mes usando el `getRecordMonth` compartido de `fundamentos` (atribución por fecha de inicio, sin prorrateo).
- [ ] 2.4 Probar unitariamente de forma explícita el caso de cruce de mes: un registro con Hora de Inicio en el mes N y Hora de Fin en el mes N+1 cuenta en su totalidad para el mes N.

## 3. Pantalla de historial

- [ ] 3.1 Construir el encabezado navegador de período (mes anterior/siguiente) según Figma.
- [ ] 3.2 Construir las tarjetas de estadísticas por Proyecto usando el selector de total por Proyecto, acotadas al período seleccionado.
- [ ] 3.3 Construir la tabla de datos de registros (Fecha, Proyecto, Tarea, Duración) a partir del listado completo de Time Records.
- [ ] 3.4 Construir el resumen del pie de página (registros encontrados, proyectos, total de horas).
- [ ] 3.5 Manejar el estado de historial vacío (sin Time Records aún).
- [ ] 3.6 Aplicar los tokens de DESIGN.md "Precision Focus" a toda la pantalla.
- [ ] 3.7 Pasada de QA visual contra el frame de Figma "Historial de registros".

## 4. Verificación de rendimiento

- [ ] 4.1 Construir un fixture de 1.000 Time Records (abarcando múltiples Tareas, Proyectos y meses, incluyendo al menos un registro de timer que cruce de mes), sembrado directamente mediante `addProject`/`addTask`/`addTimeRecord` crudos de `fundamentos` — sin dependencia de las pantallas de `proyectos`/`tareas`.
- [ ] 4.2 Medir el tiempo de renderizado de la pantalla de Historial de registros contra el fixture y confirmar que se completa en menos de 2 segundos (AC-005).
- [ ] 4.3 Si el presupuesto está en riesgo, aplicar la mitigación documentada en design.md (virtualización de listas) — en caso contrario, registrar explícitamente que no fue necesaria.

## 5. Verificación

- [ ] 5.1 Confirmar que la pantalla de Historial de registros es completamente usable con la red deshabilitada (offline-first).
- [ ] 5.2 Ejecutar los casos de prueba `TC-XXX` existentes bajo `docs/specs/user-stories/US-003-historial-de-registros/test-cases/` contra la implementación y registrar los resultados, incluyendo el TC-012 actualizado (cruce de mes).
- [ ] 5.3 Confirmar que cada `AC-XXX` de US-003 se cumple de punta a punta.
