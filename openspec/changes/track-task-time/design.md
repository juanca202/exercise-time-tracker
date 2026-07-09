## Context

Esta capability se apoya en `project-management` (change `manage-projects`) para la existencia de Proyectos, y sienta las bases de datos (`Task`, `TimeEntry`) que `view-time-history` (US-30274) leerá para construir el historial y sus agregaciones. Es la historia más grande de las tres (8 story points) porque agrupa CRUD de Tarea, la lógica de concurrencia del temporizador único (BR-02) y el ingreso manual con sus validaciones (BR-03).

Al igual que `project-management`, sigue el stack ya fijado por ADR: App Router (ADR-001), Tailwind (ADR-002), Base UI (ADR-003), Zustand (ADR-004), arquitectura feature-based (ADR-005) y `localStorage` vía `persist` (ADR-011).

## Goals / Non-Goals

**Goals:**

- Definir los modelos `Task` y `TimeEntry` y su store Zustand persistido en `localStorage`.
- Implementar la invariante de un único temporizador activo en toda la aplicación (BR-02), incluyendo el corte y persistencia automática del temporizador anterior al iniciar uno nuevo.
- Implementar el ingreso manual de tiempo con sus validaciones (BR-03).
- Cumplir RP-001/RP-002 (temporizador inicia/detiene en <1s).
- Listar las Tareas existentes con su tiempo acumulado y última actividad, y mostrar el resumen semanal/mensual con meta semanal (agregado tras la revisión de fidelidad visual contra Figma).

**Non-Goals:**

- Edición o eliminación de Tareas o Registros de Tiempo (no está en el alcance de US-30272).
- Navegación entre periodos arbitrarios o historial completo con filtros (cubierto por `view-time-history`); el resumen semanal/mensual de esta capability se limita al periodo actual, sin navegación.
- Migrar el mecanismo de persistencia (sigue ADR-011 sin cambios).

## Decisions

- **Modelos de datos**:
  - `Task { id: string; projectId: string; name: string; createdAt: string }`
  - `TimeEntry { id: string; taskId: string; startedAt: string; endedAt: string; durationMs: number; source: 'timer' | 'manual' }`
- **Store único para Tareas y Registros de Tiempo**: `src/features/tasks/store/tasksStore.ts`, persistido con `persist` + `createJSONStorage(() => localStorage)` bajo la clave `time-tracker/tasks`. Se mantienen juntos porque comparten la misma invariante de negocio (temporizador único) y se escriben en la misma transacción lógica al detener/cambiar de temporizador.
- **Estado del temporizador activo**: un único campo `activeTimer: { taskId: string; startedAt: string } | null` en el store. Al invocar `startTimer(taskId)`:
  1. Si `activeTimer` no es `null` y pertenece a otra Tarea, se calcula su Duración, se valida BR-03, se persiste el `TimeEntry` resultante y se limpia `activeTimer`.
  2. Se establece el nuevo `activeTimer` con la Tarea y la hora de inicio.
     Esta secuencia sincrónica dentro de una sola acción del store es lo que garantiza BR-02 sin condiciones de carrera entre UI y estado.
- **Persistencia entre pestañas**: dado que `localStorage` sincroniza automáticamente vía el evento `storage` (ADR-011), el estado `activeTimer` queda consistente si el usuario tiene la aplicación abierta en más de una pestaña.
- **Validación de Duración (BR-03)**: se centraliza en una función pura `isValidDuration(ms: number): boolean` (retorna `ms > 0`), reutilizada tanto al detener el temporizador como al guardar un registro manual — evita duplicar la regla de negocio.
- **Rendimiento (RP-001/RP-002)**: `startTimer`/`stopTimer` solo escriben en el store (operación síncrona de `localStorage` sobre un dataset pequeño); no hay llamadas de red ni cálculos costosos, por lo que el umbral de <1s se cumple por diseño.
- **Meta semanal**: fija en 8 horas × 5 días hábiles (lunes a viernes) = 40h, sin persistirse ni ser configurable — es una constante derivada, no una entidad del dominio. El total semanal/mensual se calcula sobre los `TimeEntry` cuya fecha cae dentro de la semana/mes calendario actual (límites de semana/mes vía helpers en `src/lib/dateRanges.ts`, compartidos a futuro con `view-time-history`).
- **Última actividad por Tarea**: se deriva como el `endedAt` más reciente entre los `TimeEntry` de esa Tarea (sin campo nuevo en `Task`), formateado con una función local (`hace Xh`, `Ayer`, etc.) — no se persiste, se recalcula en cada render.
- **Sin dependencia circular entre stores**: `selectProjectTotalTime` (feature `projects`) necesita leer `tasksStore`, e inicialmente `addTask` iba a validar la existencia del Proyecto leyendo `projectsStore` — ambas juntas habrían creado un ciclo de imports entre features. Se resolvió en una sola dirección: `addTask` solo valida que se haya seleccionado un `projectId` (no vacío), sin verificar su existencia referencial; esa garantía la da la UI, que solo ofrece Proyectos reales en el Select. `projects → tasks` queda como la única dependencia cruzada, tal como ya preveía el design.md de `manage-projects`.

## Risks / Trade-offs

- [Cambiar de temporizador genera una escritura doble (detener + iniciar) en una sola interacción del usuario] → Mitigación: ambas operaciones ocurren dentro de la misma acción síncrona del store, sin punto intermedio observable por la UI.
- [Multi-pestaña: dos pestañas podrían intentar iniciar un temporizador casi simultáneamente] → Mitigación: fuera de alcance para esta historia (uso personal, single-user); se documenta como limitación conocida, no como bloqueo.
- [El selector `selectProjectTotalTime` de `project-management` empieza a depender de este store] → Mitigación: se coordina por interfaz (nombre de store y forma de los datos), sin que `project-management` necesite cambiar su código, solo dejar de recibir `0` fijo.

## Referencias

- [ADR-005: Arquitectura del proyecto basada en features](../../../docs/adr/ADR-005-arquitectura-feature-based.md)
- [ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local](../../../docs/adr/ADR-011-persistencia-local-con-localstorage.md)
