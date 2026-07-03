# TK-005: Vista "Tareas" (esqueleto) y modal "Nueva Tarea"

Estado: Ready
Historia: [US-001](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Implementar la ruta `/tasks` con su encabezado y el botón "Nueva Tarea", y el modal "Nueva Tarea" (selección de Proyecto existente obligatoria, Nombre obligatorio) que persiste la Tarea asociada al Proyecto a través del store. Esta página se completará en US-002 (card de temporizador) y US-003 (entrada manual e historial reciente); aquí solo se deja el esqueleto y la creación de tareas.

## Dependencias

- Store de dominio (`createTask`, `projects`, `tasks`) — TK-001.
- `Modal`, `Field`, `SelectField`, `Button` — TK-002.
- `Sidebar` / layout raíz — TK-003.

## Referencias

- **Arquitectura:** [ADR-004: Estructura del proyecto con arquitectura por features](../../../adr/ADR-004-feature-based-architecture.md)
- **Diseño:** [Wireframe — Modal Nueva Tarea](assets/wireframe-modal-nueva-tarea.png), [Wireframe — Panel de Tareas (referencia)](assets/wireframe-panel-tareas-referencia.png)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── + app/tasks/page.tsx                       # página de la ruta /tasks: encabezado + botón "Nueva Tarea" + zona de contenido (placeholder para US-002/US-003)
    └── features/time-tracking/components/
        └── + new-task-modal.tsx                   # modal de creación de tarea (SelectField de Proyecto + Field de Nombre)
```

### Subtareas

- [x] Implementar `NewTaskModal`: `SelectField` con la lista de `projects` del store (obligatorio, sin valor por defecto seleccionado), `Field` de Nombre (obligatorio); botón "Crear Tarea" valida ambos campos al confirmar (en vez de deshabilitarse de antemano, muestra el error correspondiente si falta alguno); al confirmar con datos válidos, llama a `createTask` del store y cierra el modal.
- [x] Si no existe ningún Proyecto al abrir el modal, mostrar un estado vacío indicando que se debe crear un Proyecto primero (enlace a `/projects`), sin permitir confirmar la creación.
- [x] Ensamblar `app/tasks/page.tsx`: encabezado con botón "Nueva Tarea" que abre `NewTaskModal`, y un contenedor de contenido vacío/placeholder donde US-002 y US-003 añadirán el card de temporizador, el panel de entrada manual y la lista de tareas recientes.
- [x] Documentar con TSDoc en español el componente exportado.
- [x] Escribir tests de componente: creación de tarea válida asociada a un proyecto existente; intento de confirmar sin proyecto seleccionado queda bloqueado y muestra el mensaje de error (AC-004 de la historia).

## Observaciones

Sin pendientes documentados.
