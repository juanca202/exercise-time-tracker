# TK-002: Editar Proyecto

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Permitir editar el Nombre y la Descripción de un Proyecto existente reutilizando el mismo componente `ProyectoModal` de creación ([TK-001](TK-001-crear-proyecto.md)), precargado con sus datos actuales y con el título y la etiqueta del botón principal cambiados a "Editar Proyecto", bloqueando el guardado si el Nombre queda vacío o solo con espacios.

## Dependencias

- [TK-001: Crear Proyecto](TK-001-crear-proyecto.md) — `ProyectoModal` (componente controlado) y `useProyectoForm`, extendidos aquí para soportar el modo edición; sin esta tarea no existe el componente a reutilizar.
- [TK-004: Listado de Proyectos](TK-004-listado-proyectos.md) — `ProyectoCard`, donde se agrega la acción "Editar" que abre `ProyectoModal` precargado con el Proyecto de la tarjeta.
- [TK-003: Store raíz compartido — CRUD crudo (US-000)](../US-000-fundamentos/TK-003-store-raiz-crud-crudo.md) — `useAppStore` expone `actualizarProyecto(id: string, cambios: Partial<Omit<Proyecto, "id">>): void` sin validación; la validación de Nombre obligatorio en edición (BR-01) es responsabilidad de esta tarea.

## Referencias

- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md), [ADR-004: Uso de Zustand](../../../adr/ADR-004-uso-de-zustand.md), [ADR-005: Arquitectura feature-based](../../../adr/ADR-005-arquitectura-feature-based.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Diseño:** [Figma - Exercise · Time Tracker, diálogo "Nuevo Proyecto"](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L) (`nodeId 1:1642`) — el prototipo no incluye una pantalla o modal específico de "Editar Proyecto" (ver Observaciones de [US-001](./README.md)); esta tarea reutiliza el mismo modal con título/etiqueta condicionados por `modo`, conservando las etiquetas de campo "NOMBRE DEL PROYECTO" y "DESCRIPCIÓN" y sus placeholders confirmados en el prototipo (ver [TK-001](TK-001-crear-proyecto.md)).

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    └── features/
        └── proyectos/
            ├── components/
            │   ├── ~ proyecto-modal.tsx           # agrega props `modo: "crear" | "editar"` y `proyectoInicial?: Proyecto`; título/etiqueta dinámicos ("Editar Proyecto")
            │   ├── ~ proyecto-modal.test.tsx
            │   ├── ~ proyecto-card.tsx            # agrega la acción "Editar" que abre ProyectoModal en modo editar, precargado
            │   └── ~ proyecto-card.test.tsx
            └── hooks/
                ├── ~ use-proyecto-form.ts         # admite valores iniciales (nombre/descripcion) para precargar el formulario
                └── ~ use-proyecto-form.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Extender `ProyectoModal` (`proyecto-modal.tsx`) con las props `modo: "crear" | "editar"` (por defecto `"crear"`) y `proyectoInicial?: Proyecto`; calcular el título y la etiqueta del botón principal como "Editar Proyecto" cuando `modo === "editar"`, o "Nuevo Proyecto" en caso contrario (AC-005, TC-009).
- [ ] **IT-02** — Extender `useProyectoForm` (`use-proyecto-form.ts`) para aceptar valores iniciales opcionales (`nombre`, `descripcion` de `proyectoInicial`) y precargar el formulario con ellos al abrir el modal en modo editar.
- [ ] **IT-03** — Al confirmar en modo editar, invocar `actualizarProyecto(proyectoInicial.id, { nombre, descripcion })` de `useAppStore` en lugar de `crearProyecto`, aplicando la misma validación de Nombre obligatorio que en creación (BR-01, AC-006, TC-011, TC-012).
- [ ] **IT-04** — Agregar en `ProyectoCard` (`proyecto-card.tsx`, TK-004) una acción "Editar" que abre `ProyectoModal` en modo editar, precargado con el Proyecto de la tarjeta.
- [ ] **IT-05** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `proyecto-modal.test.tsx` (modo editar precarga los valores recibidos, título y etiqueta muestran "Editar Proyecto", Nombre vacío bloquea el guardado sin invocar `actualizarProyecto`) y `proyecto-card.test.tsx` (la acción "Editar" abre el modal con los datos de la tarjeta).

## Observaciones

Sin pendientes documentados.
