## Why

Una vez que existen Registros de Tiempo (change `track-task-time`), el usuario necesita poder consultarlos y entender en qué invirtió su tiempo — por Tarea, por Proyecto y por mes — para tomar decisiones sobre su productividad (SRS-001, sección 2.2). Sin esta vista, los datos registrados quedan atrapados en el almacenamiento local sin utilidad práctica para el usuario.

## What Changes

- Leer el historial completo de Registros de Tiempo y presentarlo agrupado por Tarea dentro del periodo seleccionado, incluyendo el estado vacío cuando no hay ninguno.
- Calcular y mostrar el total de tiempo acumulado por Tarea dentro del periodo seleccionado (columna "Duración" de la tabla, no el Registro de Tiempo individual — decisión tomada tras la revisión de fidelidad Figma, ver design.md).
- Calcular y mostrar el total de tiempo acumulado por Proyecto dentro del periodo (mes) seleccionado.
- Calcular y mostrar el total de tiempo acumulado por mes, con navegación entre mes anterior y mes siguiente, seleccionando el mes actual por defecto.
- Listar cada Tarea con actividad en el periodo mostrando Fecha (última actividad en el periodo), Proyecto, Tarea y Duración (total acumulado en el periodo), conforme al prototipo de alta fidelidad.
- Mostrar un resumen del periodo seleccionado: total de registros encontrados, cantidad de proyectos involucrados y total de horas.
- Cumplir el umbral de rendimiento: cargar la visualización en menos de 2 segundos para hasta 1000 Registros de Tiempo.
- Alcance explícitamente excluido: no incluye creación ni edición de Registros de Tiempo (eso corresponde al change `track-task-time`).

## Capabilities

### New Capabilities

- `time-history-reporting`: lectura del historial de Registros de Tiempo y sus agregaciones (por Tarea, por Proyecto y por mes), navegación entre periodos y resumen del periodo seleccionado.

### Modified Capabilities

(ninguna — solo lee datos producidos por `project-management` y `task-time-tracking`, sin cambiar sus requisitos)

## Impact

- Código nuevo: feature `time-history` bajo `src/features/` (ADR-005). No necesita un store propio persistido: lee directamente de los stores de `projects` (`manage-projects`) y `tasks` (`track-task-time`), ambos ya persistidos en `localStorage` (ADR-011).
- Depende de que existan Registros de Tiempo generados por `track-task-time` para mostrar datos reales; sin ellos, la pantalla solo exhibe el estado vacío — esto es un orden de implementación natural, no un bloqueo.
- Las agregaciones (por Tarea, Proyecto, mes) se calculan en memoria sobre el conjunto de Registros de Tiempo; el umbral de rendimiento (RP-003, hasta 1000 registros) condiciona cómo se implementan esos cálculos (ver design.md).
- UI: pantalla "Historial de registros", conforme al prototipo Figma referenciado en US-30274.

## Referencias

- Historia de origen: [US-30274 — Historial de Registros](../../../docs/specs/user-stories/US-30274-historial-de-registros/README.md)
- Especificación de origen: [SRS-001: Time Tracker](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)
- Diseño / prototipo (alta fidelidad) — Historial de registros: [Figma — Historial de registros](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1740)
- Changes relacionados: `manage-projects`, `track-task-time` (`openspec/changes/`)
