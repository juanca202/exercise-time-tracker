## Why

Time Tracker aún no tiene código para su flujo principal: crear Tareas asociadas a un Proyecto y registrar el tiempo dedicado a cada una, ya sea con un temporizador en tiempo real o mediante entrada manual. Sin esto, la aplicación no cumple su propósito central ([SRS-001](../../../docs/specs/requirements/SRS-001-timetracker-app/README.md)). US-30272 ya está en `Estado: Ready` (sin decisiones técnicas pendientes: el mecanismo de persistencia local quedó resuelto en [ADR-011](../../../docs/adr/ADR-011-uso-de-localstorage-para-persistencia.md)), por lo que puede implementarse ahora.

## What Changes

- Modal "Nueva Tarea": crear una Tarea con Nombre y Proyecto asociado (obligatorio), validando campos vacíos.
- Persistencia de Tareas en `localStorage` vía el middleware `persist` de Zustand (ADR-011), incluyendo su asociación al Proyecto.
- Temporizador único de la aplicación: iniciar, y si ya hay uno activo en otra Tarea, detenerlo automáticamente calculando y guardando su Registro de Tiempo antes de iniciar el nuevo (BR-02).
- Detener el temporizador activo ("Detener Sesión"), calculando Duración (Hora Fin − Hora Inicio) y persistiendo el Registro de Tiempo de inmediato.
- Formulario de entrada manual de Registro de Tiempo (Fecha, Proyecto/Tarea, Duración) con persistencia inmediata al confirmar.
- Validación transversal: ninguna Duración (por temporizador o manual) puede ser menor o igual a cero (BR-03).
- Presupuesto de rendimiento: iniciar el temporizador y persistir el registro al detenerlo, cada uno en menos de 1 segundo.

## Capabilities

### New Capabilities

- `task-time-tracking`: creación de Tareas asociadas a un Proyecto, temporizador único de la aplicación (inicio/detención con reemplazo automático) y registro manual de tiempo, incluyendo sus validaciones y persistencia local.

### Modified Capabilities

(ninguna — no hay capacidades existentes en `openspec/specs/` todavía)

## Impact

- Código nuevo en `src/features/` (feature de tareas/temporizador, según ADR-005 arquitectura feature-based) y su store de Zustand con persistencia `localStorage` (ADR-011).
- Depende de que exista al menos un Proyecto para poder asociarle una Tarea — cubierto por la capability `project-management` (change `gestion-de-proyectos`, US-30273); no bloquea el desarrollo del temporizador ni del ingreso manual, pero sí las pruebas end-to-end completas.
- Alimenta a la capability de historial (change `historial-de-registros`, US-30274), que consume los Registros de Tiempo generados aquí.
- UI conforme al prototipo de alta fidelidad en Figma (frames "Tareas" y "Diálogo Nueva Tarea") referenciado en US-30272.
