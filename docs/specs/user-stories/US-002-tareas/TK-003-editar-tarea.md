# TK-003: Editar Tarea

**Estado**: Ready
**Historia**: [US-002](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Permitir editar el Nombre de una Tarea existente en cualquier momento, reutilizando el modal "Nueva Tarea" ([TK-004](./TK-004-ui-pantalla-tareas.md)) precargado con los datos existentes de la Tarea y con el título y la etiqueta del botón principal cambiados a "Editar Tarea", validando el Nombre editado con la misma regla usada al crear (BR-01).

## Dependencias

- `src/shared/domain/types.ts` — tipo `Tarea`.
- `src/shared/store/app-store.ts` — `actualizarTarea`, `useProyectos()`.
- `src/features/tareas/domain/validar-tarea.ts` ([TK-001](./TK-001-crear-tarea.md)) — reutilizado para validar el Nombre editado (el Proyecto de la Tarea no es editable en este alcance).
- `src/features/tareas/components/ModalTarea.tsx` ([TK-004](./TK-004-ui-pantalla-tareas.md)) — modal genérico creación/edición donde se integra este hook en modo edición.

## Referencias

- **Diseño:** [Figma - Exercise · Time Tracker (modal Nueva Tarea, reutilizado en modo edición)](https://www.figma.com/design/YYHDIH7CBsZrZ4VKXvbzkR/Exercise---Time-Tracker) — el prototipo no incluye un modal específico de "Editar Tarea"; por decisión del usuario (ver [Observaciones de la US](./README.md#observaciones)), se reutiliza este mismo prototipo.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── tareas/
            └── hooks/
                └── + useEditarTarea.ts   # precarga datos, valida y actualiza el Nombre de una Tarea existente
```

## Plan de implementación

- [ ] **IT-01** — Crear `useEditarTarea.ts`: hook que recibe una `Tarea` existente, reutiliza `validarTarea({ proyectoId: tarea.proyectoId, nombre })` ([TK-001](./TK-001-crear-tarea.md)) validando solo el nuevo Nombre, y si es válido invoca `useAppStore().actualizarTarea(tarea.id, { nombre })`.
      Cubre AC-004; ver [TC-005](./test-cases/TC-005-editar-nombre-tarea-happy.md).
- [ ] **IT-02** — Definir en el hook el modo de precarga: recibe la `Tarea` a editar y retorna sus valores iniciales (`proyectoId`, `nombre`) para inicializar `ModalTarea`/`FormularioTarea` ([TK-004](./TK-004-ui-pantalla-tareas.md)) en modo edición.
- [ ] **IT-03** — Exponer un indicador de modo (`"crear" | "editar"`) que `ModalTarea` ([TK-004](./TK-004-ui-pantalla-tareas.md)) usa para cambiar el título del modal y la etiqueta del botón principal a "Editar Tarea".

## Observaciones

Sin pendientes documentados.
