# TK-004: Vista "Proyectos" y modal "Nuevo Proyecto"

Estado: Ready
Historia: [US-001](./README.md)
Repositorio: exercise-time-tracker

## Descripción

Implementar la ruta `/projects`: una cuadrícula de tarjetas de Proyecto (nombre, descripción, tiempo total registrado) con una tarjeta especial para crear un nuevo proyecto, y el modal "Nuevo Proyecto" (Nombre obligatorio, Descripción opcional) que persiste el Proyecto a través del store.

## Dependencias

- Store de dominio (`createProject`, `projects`) — TK-001.
- `Modal`, `Field`, `TextareaField`, `Button` — TK-002.
- `Sidebar` / layout raíz — TK-003.

## Referencias

- **Arquitectura:** [ADR-004: Estructura del proyecto con arquitectura por features](../../../adr/ADR-004-feature-based-architecture.md)
- **Diseño:** [Wireframe — Vista Proyectos](assets/wireframe-vista-proyectos.png), [Wireframe — Modal Nuevo Proyecto](assets/wireframe-modal-nuevo-proyecto.png)

## Plan de implementación

### Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── + app/projects/page.tsx                            # página de la ruta /projects
    └── features/time-tracking/
        ├── + components/project-grid.tsx                  # cuadrícula de tarjetas de proyecto + tarjeta "Crear Nuevo Proyecto"
        ├── + components/new-project-modal.tsx              # modal de creación (usa Modal/Field/TextareaField)
        └── + lib/totals.ts                                 # projectTotalSeconds(projectId, tasks, timeEntries) — total por proyecto
```

### Subtareas

- [x] Implementar `projectTotalSeconds` en `totals.ts`: suma la duración de los `TimeEntry` de todas las Tareas de un Proyecto (0 si no hay registros).
- [x] Implementar `ProjectGrid` (Client Component): lee `projects` del store, muestra cada proyecto como tarjeta (nombre, descripción, tiempo total formateado) y una tarjeta final para abrir el modal de creación.
- [x] Implementar `NewProjectModal`: campos Nombre (obligatorio) y Descripción (opcional), validación de nombre no vacío antes de habilitar "Crear Proyecto", llamada a `createProject` del store al confirmar, cierre del modal tras crear.
- [x] Ensamblar `app/projects/page.tsx` componiendo `ProjectGrid` (que internamente gestiona la apertura del modal).
- [x] Documentar con TSDoc en español las funciones/componentes exportados.
- [x] Escribir tests: unitario para `projectTotalSeconds` (proyecto sin tareas, con tareas sin registros, con registros de varias tareas) y de componente para el flujo de creación de proyecto (nombre vacío bloquea el envío; nombre válido crea y cierra el modal).

## Observaciones

Sin pendientes documentados.
