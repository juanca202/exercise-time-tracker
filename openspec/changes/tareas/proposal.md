## Why

[US-002](../../../docs/specs/user-stories/US-002-tareas/README.md) (Ready, 19 criterios de aceptación) es el núcleo de Time Tracker: la gestión de Tareas, el cronómetro único, la entrada manual de tiempo y la meta semanal fija — todo lo que la pantalla de Tareas necesita para que un usuario pueda efectivamente registrar tiempo contra una Tarea. El change `fundamentos` ya provee datos reales de Project (el CRUD crudo `addProject`/`listProjects`, no solo el tipo `Project`) y el shell de la app, de modo que este change puede construirse y verificarse de extremo a extremo — incluyendo un selector real de "Proyecto" en la creación de Tarea — sin esperar a que exista la propia pantalla del change `proyectos`.

## What Changes

- Agregar creación de Tarea bajo un Proyecto existente (Nombre requerido, Proyecto requerido).
- Agregar edición de Tarea, reutilizando el modal "Nueva Tarea" precargado (título/botón intercambiados a "Editar Tarea") — no existe una pantalla de edición separada en Figma.
- Agregar un cronómetro activo único, a nivel de toda la app, por Tarea: iniciar (mediante el ícono ▷ en una fila de Tarea), detener, duración calculada como Fin − Inicio.
- Agregar auto-detención: iniciar un cronómetro en una Tarea distinta detiene y persiste automáticamente el que estaba activo previamente (solo un cronómetro activo a nivel de toda la app).
- Agregar validación de duración (> 0) compartida por el flujo de detención del cronómetro y la entrada manual.
- Agregar entrada manual de Registro de Tiempo (Tarea + Fecha + Duración), independiente del cronómetro.
- Agregar una Meta Semanal fija de 40h (8h × 5 días laborables) y un Total Semanal acotado a la semana laboral actual (solo lunes a viernes, fines de semana excluidos), con un indicador de porcentaje de la meta.
- Persistir Tareas y Registros de Tiempo localmente mediante el CRUD crudo `addTask`/`updateTask`/`addTimeRecord` provisto por el change `fundamentos`.
- Ensamblar la pantalla completa de Tareas (tarjeta de cronómetro activo, formulario de Entrada Manual, tarjetas de estadísticas Total Semanal/Total Mensual, lista de Tareas Recientes) según el prototipo de Figma y DESIGN.md.

No hay cambios **BREAKING**.

## Capacidades

### Capacidades Nuevas

- `task-management`: Crear y editar Tareas bajo un Proyecto, reutilizando el modal de creación para la edición. Fuente: US-002, AC-001 a AC-005, AC-016.
- `time-tracking`: Cronómetro activo único con auto-detención, entrada manual de tiempo, validación de duración, y la Meta Semanal/Total Semanal/indicador de porcentaje fijos, acotados a lunes-viernes. Fuente: US-002, AC-006 a AC-015, AC-017 a AC-019, BR-01 a BR-05.

### Capacidades Modificadas

- Ninguna — `project-management` (del change `proyectos`) no se modifica; este change lee Proyectos a través del `listProjects` crudo de `fundamentos`, independientemente de si la pantalla de `proyectos` ya está lista.

## Impacto

- **Código afectado**: solo `src/features/tasks` (nuevo — incluye el cronómetro y la UI de entrada manual, colocados junto con la gestión de Tareas según el layout de Figma y la decisión de alcance de US-002), además de `isValidTask`, `isValidDuration`, la máquina de estados del cronómetro, y la lógica de la meta semanal, todo local a la feature. Consume (sin modificar) los tipos Task/TimeRecord/Project, el CRUD crudo y el shell de la app provistos por `fundamentos`.
- **Dependencias**: ninguna nueva; reutiliza `src/shared/persistence` y el store raíz establecidos por el change `fundamentos`.
- **Sistemas**: ninguno externo — offline-first, sin backend.
- **Sistema de diseño**: debe coincidir con el prototipo de Figma (frames "Tareas" y "Tareas - Diálogo Nueva Tarea") y con DESIGN.md "Precision Focus".
- **Secuenciación**: depende únicamente del change `fundamentos` (los datos reales de Proyecto vía su CRUD crudo son suficientes — la propia pantalla de `proyectos` no necesita existir todavía). Sin dependencia de `proyectos` ni de `historial-de-registros`; los tres pueden implementarse en paralelo una vez que `fundamentos` esté mergeado.
- **Nota sobre el alcance**: la propia validación INVEST de US-002 marca la dimensión "Small" como `Parcial` porque agrupa la gestión de Tareas, el cronómetro y la entrada manual por decisión explícita de producto; el `tasks.md` de abajo desglosa esto en pasos completables de forma independiente para mantener la implementación revisable.
