## Why

Una vez que existen Proyectos (change `manage-projects`), el usuario necesita crear Tareas dentro de ellos y registrar el tiempo dedicado a cada una — el flujo principal de Time Tracker (SRS-001, sección 1.2). Sin esto, la aplicación no cumple su propósito central: llevar control preciso del tiempo invertido.

## What Changes

- Crear una nueva Tarea con Nombre, asociada obligatoriamente a un Proyecto existente, mediante el modal "Nueva Tarea".
- Persistir cada Tarea (incluyendo su asociación al Proyecto) en `localStorage` (ADR-011).
- Iniciar un temporizador en tiempo real para una Tarea específica.
- Garantizar un único temporizador activo en toda la aplicación: si se inicia uno nuevo mientras otro corre, el sistema detiene el anterior, calcula y persiste su Registro de Tiempo antes de iniciar el nuevo (BR-02).
- Detener el temporizador activo ("Detener Sesión"), calculando la Duración (Hora Fin − Hora Inicio) y persistiendo el Registro de Tiempo de inmediato.
- Crear un Registro de Tiempo manual (Fecha, Proyecto/Tarea, Duración) mediante el formulario "Entrada Manual".
- Validar que ninguna Duración (por temporizador o manual) sea menor o igual a cero (BR-03).
- Cumplir los umbrales de rendimiento: iniciar/detener el temporizador en menos de 1 segundo (RP-001, RP-002).
- Listar las Tareas en el panel principal con su Proyecto, tiempo acumulado y última actividad, con una acción para iniciar su temporizador (infraestructura implícita en AC-004/RIU-004, sin un AC propio en la historia original).
- Mostrar un resumen de tiempo trabajado en la semana y el mes calendario actual, con el progreso hacia una meta semanal fija de 8 horas por día hábil (lunes a viernes) — conforme al prototipo Figma; agregado tras la revisión de fidelidad visual, ya que no estaba cubierto por ningún AC de US-30272.

## Capabilities

### New Capabilities

- `task-time-tracking`: creación de Tareas asociadas a un Proyecto, temporizador con invariante de sesión única, ingreso manual de tiempo y sus validaciones de duración.

### Modified Capabilities

(ninguna — `project-management` no cambia sus requisitos; solo empieza a recibir datos reales para el selector de tiempo total que ya definió con valor 0 por defecto)

## Impact

- Código nuevo: feature `tasks` bajo `src/features/` (ADR-005), con su propio store de Zustand persistido en `localStorage` (ADR-011) para Tareas y Registros de Tiempo.
- Depende de `project-management` (change `manage-projects`) para poder asociar una Tarea a un Proyecto existente; no bloquea el desarrollo del temporizador ni del ingreso manual, pero sí las pruebas end-to-end completas (ver DoR de US-30272).
- Una vez implementado, el selector `selectProjectTotalTime` de `project-management` deja de retornar 0 y debe leer los Registros de Tiempo reales que introduce este change.
- UI: modal "Nueva Tarea", panel de Tareas con acciones de temporizador, y formulario "Entrada Manual", conforme a los prototipos Figma referenciados en US-30272.

## Referencias

- Historia de origen: [US-30272 — Gestión de Tareas y registro de tiempo](../../../docs/specs/user-stories/US-30272-gestion-de-tareas/README.md)
- Especificación de origen: [SRS-001: Time Tracker](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)
- Diseño / prototipo (alta fidelidad) — Tareas (panel principal): [Figma — Tareas](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1374)
- Diseño / prototipo (alta fidelidad) — Modal Nueva Tarea: [Figma — Tareas / Diálogo Nueva Tarea](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L/exercise-time-tracker?node-id=1-1539)
- [ADR-011: Uso de localStorage vía Zustand persist para el almacenamiento local](../../../docs/adr/ADR-011-persistencia-local-con-localstorage.md)
- Change relacionado: `manage-projects` (`openspec/changes/manage-projects/`)
