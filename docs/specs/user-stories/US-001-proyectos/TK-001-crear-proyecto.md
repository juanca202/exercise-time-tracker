# TK-001: Crear Proyecto

**Estado**: Ready
**Historia**: [US-001](./README.md)
**Repositorio**: exercise-time-tracker
**Asignado a**: juanca202

## Descripción

Permitir crear un Proyecto mediante un modal "Nuevo Proyecto" (componente controlado, reutilizable en modo edición por [TK-002](TK-002-editar-proyecto.md)) que solicita un Nombre obligatorio y una Descripción opcional, bloqueando el guardado y mostrando el error junto al campo Nombre cuando este está vacío o contiene solo espacios, y persistiendo el Proyecto creado en el store raíz compartido.

## Dependencias

- [TK-001: Tipos de dominio compartidos (US-000)](../US-000-fundamentos/TK-001-tipos-dominio-compartidos.md) — tipo `Proyecto` (`id`, `nombre`, `descripcion?`).
- [TK-003: Store raíz compartido — CRUD crudo (US-000)](../US-000-fundamentos/TK-003-store-raiz-crud-crudo.md) — `useAppStore` expone `crearProyecto(proyecto: Proyecto): void` sin validación; la validación de Nombre obligatorio (BR-01) es responsabilidad de esta tarea.
- `@base-ui/react/dialog` — primitivas `Root`, `Portal`, `Backdrop`, `Popup`, `Title`, `Close` para el modal (sin `Trigger` propio: el modal es controlado por `open`/`onOpenChange` desde quien lo invoca, para poder reutilizarse desde el disparador "Nuevo Proyecto" de esta tarea y desde la acción "Editar" de [TK-002](TK-002-editar-proyecto.md)).
- `@base-ui/react/field` — primitivas `Root`, `Label`, `Control`, `Error` para el campo Nombre y su mensaje de error.
- Web Crypto API (`crypto.randomUUID()`) — generación del `id` del Proyecto antes de invocar `crearProyecto`.

## Referencias

- **Arquitectura:** [ADR-002: Uso de Tailwind CSS](../../../adr/ADR-002-uso-de-tailwind-css.md), [ADR-003: Uso de Base UI](../../../adr/ADR-003-uso-de-base-ui.md), [ADR-004: Uso de Zustand](../../../adr/ADR-004-uso-de-zustand.md), [ADR-005: Arquitectura feature-based](../../../adr/ADR-005-arquitectura-feature-based.md), [ADR-006: Documentación con TSDoc](../../../adr/ADR-006-documentacion-con-tsdoc.md), [ADR-007: Estrategia de pruebas unitarias](../../../adr/ADR-007-estrategia-pruebas-unitarias.md).
- **Diseño:** [Figma - Exercise · Time Tracker, diálogo "Nuevo Proyecto"](https://www.figma.com/design/K6uQLWg82KsCSpHJVXSf6L) (`nodeId 1:1642`) — confirma etiquetas de campo "NOMBRE DEL PROYECTO" y "DESCRIPCIÓN", placeholders "ej. Estrategia de Marketing Q4" y "Define los objetivos primarios...", y botones "Cancelar" / "Crear Proyecto"; la fidelidad visual concreta (colores, tipografía, espaciado) se resuelve en [TK-005](TK-005-ui-diseno-proyectos.md), que además aplica los tokens de `DESIGN.md`.

## Archivos afectados

```text
exercise-time-tracker/
└── src/
    ├── app/
    │   └── proyectos/
    │       └── ~ page.tsx                       # reemplaza el placeholder "Próximamente" (US-000 TK-006) por el encabezado "Proyectos" y el disparador "Nuevo Proyecto"
    └── features/
        └── proyectos/
            ├── components/
            │   ├── + proyecto-modal.tsx          # Dialog controlado (open/onOpenChange) "Nuevo Proyecto": Nombre obligatorio, Descripción opcional
            │   └── + proyecto-modal.test.tsx
            └── hooks/
                ├── + use-proyecto-form.ts        # estado del formulario (nombre/descripcion) + validación BR-01 (Nombre obligatorio, trim)
                └── + use-proyecto-form.test.ts
```

## Plan de implementación

- [ ] **IT-01** — Implementar `useProyectoForm` (`use-proyecto-form.ts`): estado controlado `{ nombre, descripcion }` y una función `validar()` que aplica BR-01 recortando espacios (`trim()`) y considerando inválida una cadena vacía o de solo espacios (TC-003, TC-004), fijando un `errorNombre` legible.
- [ ] **IT-02** — Implementar `ProyectoModal` (`proyecto-modal.tsx`) como componente controlado (`open: boolean`, `onOpenChange: (open: boolean) => void`) sobre `Dialog` de Base UI (`Root`, `Portal`, `Backdrop`, `Popup`, `Title`, `Close`), con título "Nuevo Proyecto": campo Nombre con etiqueta "NOMBRE DEL PROYECTO" y placeholder "ej. Estrategia de Marketing Q4" (`Field` de Base UI, obligatorio, muestra `errorNombre` junto al campo), y campo Descripción con etiqueta "DESCRIPCIÓN" y placeholder "Define los objetivos primarios..." (opcional). Acciones del pie: botón "Cancelar" (cierra sin guardar) y botón principal "Crear Proyecto".
- [ ] **IT-03** — Al confirmar, invocar `validar()`; si es válido, generar `id` con `crypto.randomUUID()` e invocar `crearProyecto({ id, nombre, descripcion })` de `useAppStore`, y cerrar el modal (`onOpenChange(false)`); si no es válido, mantener el modal abierto con el error visible (TC-003).
- [ ] **IT-04** — Integrar en `src/app/proyectos/page.tsx` el encabezado "Proyectos" y un botón "Nuevo Proyecto" que controla la apertura de `ProyectoModal`, reemplazando el `ComingSoon` de US-000 (TK-006). El listado de Proyectos existentes se agrega en [TK-004](TK-004-listado-proyectos.md).
- [ ] **IT-05** — Cubrir con pruebas Vitest + Testing Library (ADR-007): `use-proyecto-form.test.ts` (Nombre vacío o solo espacios bloquea; Descripción es opcional) y `proyecto-modal.test.tsx` (envío válido invoca `crearProyecto` con los datos ingresados y cierra el modal; envío con Nombre vacío no invoca `crearProyecto`, mantiene el modal abierto y muestra el error).

## Observaciones

Sin pendientes documentados.
