## Context

Esta capability es de solo lectura: no introduce datos propios, sino que agrega y presenta los que ya producen `project-management` (change `manage-projects`) y `task-time-tracking` (change `track-task-time`), ambos persistidos en `localStorage` (ADR-011). El volumen de referencia para su requisito de rendimiento (RP-003) es explícito: hasta 1000 Registros de Tiempo cargando en menos de 2 segundos.

## Goals / Non-Goals

**Goals:**

- Leer el historial completo de Registros de Tiempo y agregarlo por Tarea, por Proyecto (dentro del periodo seleccionado) y por mes.
- Ofrecer navegación entre mes anterior y mes siguiente, con el mes actual como periodo por defecto.
- Cumplir RP-003 (carga <2s con hasta 1000 registros).

**Non-Goals:**

- Crear, editar o eliminar Registros de Tiempo (cubierto por `track-task-time`).
- Persistir el periodo/mes seleccionado entre sesiones — es estado transitorio de la vista, no un dato del dominio.
- Paginación o virtualización de la lista — el volumen de referencia (1000 registros) es manejable en memoria sin esa complejidad adicional (ver Decisions).

## Decisions

- **Sin store propio**: `time-history` no persiste nada; lee los Registros de Tiempo y Tareas directamente de los stores de `tasks` y `projects` vía selectores derivados. Evita duplicar datos y mantiene una única fuente de verdad (ADR-011).
- **Periodo seleccionado como estado local de componente**: el mes visible (`selectedMonth: { year: number; month: number }`) vive en `useState` del componente de la pantalla "Historial de registros", inicializado en el mes calendario actual (`new Date()`). No requiere Zustand porque no se comparte con otras pantallas ni sobrevive a un refresco (Non-Goal).
- **Agregaciones en memoria**: dado que el propio criterio de rendimiento (RP-003) acota el volumen a 1000 registros, los totales por Tarea, Proyecto y mes se calculan con `reduce`/`filter` estándar de JS sobre el arreglo completo de Registros de Tiempo en cada render — evita la complejidad de índices o consultas incrementales que solo se justificarían con datasets mucho mayores (consistente con la decisión de `localStorage` en ADR-011 y con la recomendación de RS-001 de no sobre-diseñar para un volumen que la propia SRS no contempla).
- **Filtrado por periodo**: un Registro de Tiempo pertenece a un mes si su fecha cae dentro de `[primerDía, últimoDía]` del mes seleccionado, comparado en la zona horaria local del dispositivo (consistente con que la app es de un solo usuario, sin sincronización entre dispositivos).
- **Resumen del periodo**: se deriva del mismo arreglo ya filtrado por mes — cantidad de registros (`length`), proyectos involucrados (`Set` de `projectId` únicos) y total de horas (`reduce` de `durationMs`) — un solo recorrido, sin recomputar el filtrado tres veces.
- **Tabla agrupada por Tarea, no por Registro de Tiempo individual** (decisión tomada tras revisar el frame Figma, que no muestra Registros individuales sino un total por Tarea): a partir de `selectEntriesInMonth`, se agrupan los Registros por `taskId` y se deriva una fila por Tarea con actividad en el periodo: `{ taskId, taskName, projectName, totalMs, lastActivityIso }`. `Duración` = suma de sus Registros en el periodo (satisface AC-002, ahora acotado al periodo visible para que toda la pantalla sea consistente con la navegación por mes). `Fecha` = `endedAt` más reciente entre esos Registros dentro del periodo. Filas ordenadas por `lastActivityIso` descendente.
- **Acento de color en las tarjetas de Proyecto**: se reutiliza `colorFromString(project.name)` (ya usado en `manage-projects`/`track-task-time`) para un borde de acento consistente en las tres tarjetas, en vez de resaltar una sola tarjeta sin criterio documentado (el frame Figma resalta "Nexus App" sin que corresponda a un criterio derivable, ej. no es el proyecto con más horas).

## Risks / Trade-offs

- [Recalcular agregaciones en cada render sobre hasta 1000 registros] → Mitigación: es una operación O(n) sobre un arreglo pequeño (miles, no millones, de elementos); si en el futuro se requiere más, memoizar los selectores derivados es una optimización incremental, no un rediseño.
- [Los TC de esta historia dependen del "mes actual real" del sistema (TC-007, TC-008, TC-009, TC-012, TC-013), lo que puede introducir flakiness en pruebas automatizadas] → Mitigación: las pruebas deben fijar/mockear el reloj (fake timers de Vitest, o Playwright Clock en e2e) en lugar de depender de `Date.now()` real, tal como señalan las observaciones de esos TC.
- [Sin paginación, listas muy grandes podrían afectar el scroll/renderizado del DOM] → Mitigación: fuera de alcance mientras el volumen de referencia siga siendo ~1000 registros (RP-003); documentado como límite conocido.

## Referencias

- [ADR-005: Arquitectura del proyecto basada en features](../../../docs/adr/ADR-005-arquitectura-feature-based.md)
- [ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local](../../../docs/adr/ADR-011-persistencia-local-con-localstorage.md)
